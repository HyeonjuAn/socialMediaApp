import Navbar from "../../components/Navbar/Navbar";
import Post from "../../components/Post/Post";
import CreatePost from "../../components/CreatePost/CreatePost";
import LeftCol from "../../components/LeftCol/LeftCol";
import { makePost } from "../../helpers/Api";
import { getTrendingPosts, getNewPosts, getTopPosts } from "../../helpers/Api";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../helpers/UserContext";
import { Box, Tabs, Tab } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LoadingPage from "../LoadingPage/LoadingPage";

const Home = () => {
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [sortType, setSortType] = useState("trending");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const trendingPosts = await getTrendingPosts();
                setPosts(trendingPosts);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                if (sortType === "trending") {
                    const trendingPosts = await getTrendingPosts();
                    setPosts(trendingPosts);
                } else if (sortType === "new") {
                    const newPosts = await getNewPosts();
                    setPosts(newPosts);
                } else if (sortType === "top") {
                    const topPosts = await getTopPosts();
                    setPosts(topPosts);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [sortType]);

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
                    <Tabs
                        value={sortType}
                        onChange={(event, newValue) => setSortType(newValue)}
                        variant="fullWidth"
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Tab icon={<WhatshotIcon />} label="Trending" value="trending" />
                        <Tab icon={<NewReleasesIcon />} label="New" value="new" />
                    </Tabs>
                    {user && <CreatePost apiCall={makePost} callback={setPosts} />}
                    {posts &&
                        posts.map((post) => (
                            <Post postData={post} key={post._id} setPosts={setPosts} />
                        ))}
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

export default Home;
