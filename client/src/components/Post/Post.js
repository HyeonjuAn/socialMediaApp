import { useState, useContext } from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActionArea,
    CardMedia,
    Box,
    Dialog,
} from "@mui/material";
import { UserContext } from "../../helpers/UserContext";
import LikeButton from "../LikeButton/LikeButton";
import DeleteButton from "../DeleteButton/DeleteButton";
import CommentButton from "../CommentButton/CommentButton";
import AvatarLink from "../AvatarLink/AvatarLink";

const Post = ({ postData, setPosts }) => {
    const { user } = useContext(UserContext);
    const [open, setOpen] = useState(false);

    const handleImageClick = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setOpen(false);
    };

    return (
        <CardActionArea
            component="div"
            onClick={() => {
                window.location.href = `/post/${postData._id}`;
            }}
            sx={{
                "&:hover": {
                    backgroundColor: "grey.200",
                },
            }}
        >
            <Card
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderWidth: 1,
                    borderColor: "divider",
                    borderRadius: 0,
                    backgroundImage: "none",
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "80px",
                            gap: 1,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/user/${postData.authorName}`;
                        }}
                    >
                        <AvatarLink
                            username={postData.authorName}
                            disableLink={true}
                            avatarUrl={postData.avatarUrl}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: "1rem",
                                marginLeft: "2px",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            {postData.authorName}
                        </Typography>
                    </Box>
                    <Box sx={{ marginLeft: "52px", marginTop: "1rem" }}>
                        <Typography variant="body1">{postData.content}</Typography>
                        {postData.imageUrl && (
                            <CardMedia
                                component="img"
                                image={postData.imageUrl}
                                alt="post-image"
                                onClick={handleImageClick}
                                sx={{
                                    marginTop: "1rem",
                                    borderRadius: 2,
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: "400px",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                            />
                        )}
                    </Box>
                </CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        gap: 2,
                        marginBottom: 1,
                    }}
                >
                    <CommentButton postData={postData} />
                    <LikeButton postData={postData} />
                    {user && user.username === postData.authorName && (
                        <DeleteButton postData={postData} setPosts={setPosts} />
                    )}
                </Box>
                <Typography variant="caption">
                    {`Created at ${new Date(postData.date).toLocaleString()}`}
                </Typography>
            </Card>

            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <img
                    src={postData.imageUrl}
                    alt="post-image"
                    style={{
                        width: "auto",
                        height: "auto",
                        maxHeight: "90vh",
                        maxWidth: "60vw",
                        display: "block",
                        margin: "0 auto",
                        objectFit: "contain",
                        objectPosition: "center",
                    }}
                />
            </Dialog>
        </CardActionArea>
    );
};

export default Post;
