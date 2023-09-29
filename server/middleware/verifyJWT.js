const User = require("../models/User/User");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    const verifyPromises = [];

    if (!accessToken && !refreshToken) {
        return res
            .status(401)
            .json({ message: "Unauthorized from VerifyJWT", redirect: "/login" });
    }

    if (accessToken) {
        verifyPromises.push(
            new Promise((resolve, reject) => {
                jwt.verify(
                    accessToken,
                    process.env.JWT_ACCESS_TOKEN,
                    async (err, decoded) => {
                        if (err) {
                            if (err.name === "TokenExpiredError") {
                                const decodedAccess = jwt.decode(accessToken);
                                const username = decodedAccess.UserInfo.username;
                                const foundUser = await User.findOne({
                                    username: username,
                                }).exec();
                                if (!foundUser) {
                                    res.clearCookie("accessToken");
                                    res.clearCookie("refreshToken");
                                    return reject(new Error("User not found"));
                                }

                                res.clearCookie("accessToken");

                                jwt.verify(
                                    refreshToken,
                                    process.env.JWT_REFRESH_TOKEN,
                                    (err, decoded) => {
                                        if (err) {
                                            res.clearCookie("refreshToken");
                                            return reject(new Error("Refresh Token invalid"));
                                        } else {
                                            req.username = decoded.username;
                                            req.userId = decoded.id;
                                            req.roles = decoded.roles;

                                            const newAccessToken = jwt.sign(
                                                {
                                                    UserInfo: {
                                                        username: foundUser.username,
                                                        roles: foundUser.roles,
                                                    },
                                                },
                                                process.env.JWT_ACCESS_TOKEN,
                                                { expiresIn: "5m" }
                                            );

                                            res.cookie("accessToken", newAccessToken, {
                                                httpOnly: true,
                                                secure: false, // TODO: Change to true when in production
                                                maxAge: 300000,
                                            });
                                            resolve();
                                        }
                                    }
                                );
                            } else {
                                // Is not token expired error (access token is invalid)
                                res.clearCookie("accessToken");
                                res.clearCookie("refreshToken");
                                return reject(new Error("Unauthorized from VerifyJWT"));
                            }
                        } else {
                            // Was able to verify the access token
                            req.username = decoded.UserInfo.username;
                            req.userId = decoded.UserInfo.id;
                            req.roles = decoded.UserInfo.roles;
                            resolve();
                        }
                    }
                );
            })
        );
    }

    if (!accessToken && refreshToken) {
        verifyPromises.push(
            new Promise((resolve, reject) => {
                jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_TOKEN,
                    async (err, decoded) => {
                        if (err) {
                            res.clearCookie("refreshToken");
                            return reject(new Error("Refresh Token invalid"));
                        } else {
                            req.username = decoded.username;
                            req.userId = decoded.id;
                            req.roles = decoded.roles;

                            const foundUser = await User.findOne({
                                username: req.username,
                            }).exec();

                            const newAccessToken = jwt.sign(
                                {
                                    UserInfo: {
                                        username: foundUser.username,
                                        roles: foundUser.roles,
                                    },
                                },
                                process.env.JWT_ACCESS_TOKEN,
                                { expiresIn: "5m" }
                            );

                            res.cookie("accessToken", newAccessToken, {
                                httpOnly: true,
                                secure: false, // TODO: Change to true when in production
                                maxAge: 300000,
                            });
                            resolve();
                        }
                    }
                );
            })
        );
    }
    try {
        await Promise.all(verifyPromises);
        next();
    } catch (err) {
        // Handle the error as you wish
        // For example, redirect the user to the login page
        res.status(401).json({ message: err.message, redirect: "/login" });
    }
};

module.exports = { verifyJWT };
