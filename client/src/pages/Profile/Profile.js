import { useState, useEffect, useContext } from "react";
import LeftCol from "../../components/LeftCol/LeftCol";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import AvatarDialog from "../../components/AvatarDialog/AvatarDialog";
// import EditButton from "../../components/EditButton/EditButton";
import FollowButton from "../../components/FollowButton/FollowButton";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { getUserByUsername } from "../../helpers/Api";
import Post from "../../components/Post/Post";
import LoadingPage from "../LoadingPage/LoadingPage";
import {
    getTopPostsByUser,
    getNewPostsByUser,
    getRecentlyLikedPostsByUser,
    getCommentsByUser,
} from "../../helpers/Api";
import { UserContext } from "../../helpers/UserContext";

const Profile = () => {
    const { username } = useParams();
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const data = await getUserByUsername(username);
                setUserData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [username]);

    useEffect(() => {
        (async () => {
            try {
                if (tabValue === 0) {
                    const data = await getNewPostsByUser(username);
                    setPosts(data);
                }
                if (tabValue === 1) {
                    const data = await getTopPostsByUser(username);
                    setPosts(data);
                }
                if (tabValue === 2) {
                    const data = await getRecentlyLikedPostsByUser(username);
                    setPosts(data);
                }
                if (tabValue === 3) {
                    const data = await getCommentsByUser(username);
                    setPosts(data);
                }
                console.log(posts);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [tabValue]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return <LoadingPage />;
    }
    return (
        <>
            <Navbar />
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                }}
            >
                <LeftCol />
                <Box
                    sx={{
                        width: "40%",
                        minWidth: "400px",
                        height: "100%",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "visible",
                        margin: "0 auto",
                        paddingTop: "64px",
                        marginLeft: "30%",
                        border: 1,
                        borderTop: 0,
                        borderBottom: 0,
                        borderColor: "divider",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 2,
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center", // Aligns items vertically centered
                                justifyContent: "space-between", // Aligns items horizontally with space between
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <AvatarDialog
                                    avatarUrl={userData?.avatarUrl}
                                    username={userData?.username}
                                />
                                <Typography
                                    variant="h4"
                                    color="primary"
                                    sx={{
                                        marginLeft: 2, // Adds some space between the Avatar and the Username
                                    }}
                                >
                                    {userData?.username}
                                </Typography>
                            </Box>
                            {user && user.username === userData.username ? null : (
                                <FollowButton userData={userData} />
                            )}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                minHeight: "100px",
                                width: "100%",
                                marginTop: 2,
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="textPrimary"
                                sx={{
                                    flexGrow: 1,
                                }}
                            >
                                {"Test placeholder bio"}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="body1"
                                    color="textPrimary"
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    {userData?.followingCount}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Following
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    marginLeft: 2,
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    color="textPrimary"
                                    sx={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    {userData?.followersCount}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Followers
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab icon={<NewReleasesIcon />} label="Recently Posted" />
                            <Tab icon={<EqualizerIcon />} label="Top Posted" />
                            <Tab icon={<ThumbUpIcon />} label="Recently Liked" />
                            <Tab icon={<ModeCommentIcon />} label="Comments" />
                        </Tabs>
                    </Box>
                    {/* Conditionally render posts */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Post postData={post} setPosts={setPosts} key={post._id} />
                            ))
                        ) : (
                            <Box sx={{ marginTop: 2 }}>
                                <Typography variant="h5" color="textSecondary">
                                    No posts to show
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: "30%",
                        height: "100%",
                        margin: "0 auto",
                        overflow: "auto",
                    }}
                ></Box>
            </Box>
        </>
    );
};

export default Profile;
