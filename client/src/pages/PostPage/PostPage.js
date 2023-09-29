import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../helpers/UserContext";
import { useParams } from "react-router-dom";
import { getPostById, replyToPost } from "../../helpers/Api";
import Navbar from "../../components/Navbar/Navbar";
import CreatePost from "../../components/CreatePost/CreatePost";
import Comment from "../../components/Comment/Comment";
import LeftCol from "../../components/LeftCol/LeftCol";
import Post from "../../components/Post/Post";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Box } from "@mui/material";

const PostPage = () => {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const [postData, setPostData] = useState({});
    const [comments, setComments] = useState([]);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getPostById(id);
                setPostData(data.post);
                setComments(data.comments);
                setParents(data.parents);
                console.log(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
    }, [id]);

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
                    {parents &&
                        [...parents]
                            .reverse()
                            .map((parent) => (
                                <Comment key={parent._id} commentData={parent} />
                            ))}

                    <Post postData={postData} />
                    {user && (
                        <CreatePost
                            apiCall={replyToPost}
                            callback={setComments}
                            parentPost={postData}
                        />
                    )}

                    {comments &&
                        comments.map((comment) => (
                            <Comment key={comment._id} commentData={comment} />
                        ))}
                </Box>
                <Box
                    sx={{
                        width: "33.33%",
                        margin: "0 auto",
                        overflow: "auto",
                    }}
                ></Box>
            </Box>
        </>
    );
};

export default PostPage;
