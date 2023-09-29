const User = require("../models/User/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Image Processing
const sharp = require("sharp");
const {
    generateFileName,
    uploadFile,
    deleteFile,
    getObjectSignedUrl,
} = require("../config/s3");

const userRegistration = async (req, res) => {
    console.log("Registration request: ", req.body);
    const { email, username, password } = req.body;

    // Check if user already exists
    const duplicateEmail = await User.findOne({ email: email }).exec();
    const duplicateUsername = await User.findOne({ username: username }).exec();
    if (duplicateEmail || duplicateUsername) {
        return res.status(409).json({
            message: "An account with this username or email already exists.",
        });
    }

    try {
        let avatarName = "";

        if (req.file) {
            const avatar = req.file;
            avatarName = generateFileName();
            const avatarBuffer = await sharp(avatar.buffer)
                .resize({ width: 250, height: 250 })
                .toBuffer();

            await uploadFile(avatarBuffer, avatarName, avatar.mimetype);
        }

        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            username,
            password: hashedPwd,
            avatar: avatarName,
        });

        console.log("New user created: ", newUser);

        res.status(200).json({ redirect: "/login" });
    } catch (error) {
        res
            .status(400)
            .json({ message: "Registration failed, internal server error" });
    }
};

const userLogin = async (req, res) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email }).exec();
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        } else {
            if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
                return res.status(401).json({ message: "Password is incorrect" });
            } else {
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: foundUser.username,
                            roles: foundUser.roles,
                        },
                    },
                    process.env.JWT_ACCESS_TOKEN,
                    { expiresIn: "5m" }
                );

                const refreshToken = jwt.sign(
                    { username: foundUser.username },
                    process.env.JWT_REFRESH_TOKEN,
                    { expiresIn: "1h" }
                );

                let avatarUrl = "";
                if (foundUser.avatar) {
                    avatarUrl = await getObjectSignedUrl(foundUser.avatar);
                }

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false, // TODO: Change to true when in production
                    maxAge: 300000,
                });

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, // TODO: Change to true when in production
                    maxAge: 3600000,
                });

                return res.status(200).json({
                    message: "Login successful",
                    redirect: "/",
                    currentUser: {
                        id: foundUser._id,
                        username: foundUser.username,
                        roles: foundUser.roles,
                        avatarUrl,
                        expirationTime: Date.now() + 3600000, // TODO: Set expiration time equal to JWT expiration time
                    },
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Authentication failed" });
    }
};

const userLogout = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ redirect: "/" });
};

//TODO: Test functionality
const userDelete = async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.username }).exec();
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await deleteFile(foundUser.avatar);
        await User.deleteOne({ username: req.username }).exec();
        return res.status(200).json({ message: "User deleted", redirect: "/" });
    } catch (error) {
        console.error(`Error deleting user: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const specificUser = await User.findOne({ username });
        if (!specificUser) {
            return res
                .status(404)
                .json({ message: "User with this username does not exist" });
        }

        const filteredUser = {
            id: specificUser._id,
            username: specificUser.username,
            bio: specificUser.bio,
            dateJoined: specificUser.dateJoined,
            followersCount: specificUser.followersCount,
            followingCount: specificUser.followingCount,
            following: specificUser.following,
            followers: specificUser.followers,
        };
        if (specificUser.avatar)
            filteredUser.avatarUrl = await getObjectSignedUrl(specificUser.avatar);

        return res.status(200).json(filteredUser);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.params;
        const users = await User.find({
            username: new RegExp(query, "i"),
        }).select("username avatar bio");
        if (users.length === 0) {
            return res.status(200).json([]);
        }
        const usersArray = [];
        for (let user of users) {
            let avatarUrl = "";
            if (user.avatar) {
                avatarUrl = await getObjectSignedUrl(user.avatar);
            }
            const userObj = {
                username: user.username,
                avatarUrl,
            };
            usersArray.push(userObj);
        }
        return res.status(200).json(usersArray);
    } catch (error) {
        console.error(`Error searching users: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const followUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req;

        const userToBeFollowed = await User.findById(id);
        if (!userToBeFollowed) {
            return res.status(404).json({ message: "User not found" });
        }

        const follower = await User.findOne({ username }).exec();
        if (!follower) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userToBeFollowed._id.toString() === follower._id.toString()) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }

        if (follower?.following.includes(id)) {
            follower.following.pull(id);
            follower.followingCount--;
            userToBeFollowed.followers.pull(follower._id);
            userToBeFollowed.followersCount--;
            await follower.save();
            await userToBeFollowed.save();
            return res.status(200).json({ following: false });
        } else {
            follower.following.push(id);
            follower.followingCount++;
            userToBeFollowed.followers.push(follower._id);
            userToBeFollowed.followersCount++;
            await follower.save();
            await userToBeFollowed.save();
            return res.status(200).json({ following: true });
        }
    } catch (error) {
        console.error(`Error following user: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const isFollowingUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req;

        const userToBeFollowed = await User.findById(id);
        if (!userToBeFollowed) {
            return res.status(404).json({ message: "User not found" });
        }

        const follower = await User.findOne({ username }).exec();
        if (!follower) {
            return res.status(404).json({ message: "User not found" });
        }

        if (follower?.following.includes(id)) {
            return res.status(200).json({ following: true });
        } else {
            return res.status(200).json({ following: false });
        }
    } catch (error) {
        console.error(`Error checking if user is following: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    userRegistration,
    userLogin,
    userLogout,
    userDelete,
    getUserByUsername,
    searchUsers,
    isFollowingUser,
    followUser,
};
