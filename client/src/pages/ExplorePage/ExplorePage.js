import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import LeftCol from "../../components/LeftCol/LeftCol";
import Navbar from "../../components/Navbar/Navbar";
import { Typography, Box, Tab, Tabs } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CircularProgress from "@mui/material/CircularProgress";
import Post from "../../components/Post/Post";
import UserComponent from "../../components/UserComponent/UserComponent";

const ExplorePage = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

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
                    <SearchBar
                        setPosts={setPosts}
                        setUsers={setUsers}
                        setHasSearched={setHasSearched}
                        setIsLoading={setLoading}
                    />
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab icon={<ChatBubbleIcon />} label="posts" />
                        <Tab icon={<PersonIcon />} label="users" />
                    </Tabs>
                    {loading ? (
                        <CircularProgress sx={{ display: "block", margin: "auto" }} />
                    ) : (
                        <>
                            {hasSearched &&
                                (tabValue === 0 ? (
                                    posts && posts.length > 0 ? (
                                        posts.map((post) => (
                                            <Post
                                                key={post._id}
                                                postData={post}
                                                setPosts={setPosts}
                                            />
                                        ))
                                    ) : (
                                        <Typography
                                            variant="h6"
                                            sx={{ textAlign: "center", marginTop: "1rem" }}
                                        >
                                            No posts found
                                        </Typography>
                                    )
                                ) : tabValue === 1 ? (
                                    users && users.length > 0 ? (
                                        users.map((user) => (
                                            <UserComponent key={user._id} user={user} />
                                        ))
                                    ) : (
                                        <Typography
                                            variant="h6"
                                            sx={{ textAlign: "center", marginTop: "1rem" }}
                                        >
                                            No users found
                                        </Typography>
                                    )
                                ) : null)}
                        </>
                    )}{" "}
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

export default ExplorePage;
