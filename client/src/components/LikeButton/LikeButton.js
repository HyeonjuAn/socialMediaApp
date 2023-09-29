import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { UserContext } from "../../helpers/UserContext";
import { useState, useEffect, useContext } from "react";
import { likePost } from "../../helpers/Api";
import { SocketContext } from "../../helpers/SocketContext";

const LikeButton = ({ postData }) => {
    const [liked, setLiked] = useState(false);
    const [numberOfLikes, setNumberOfLikes] = useState(postData.likes);
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);

    // User's liked post array is not updated on client side
    // so whenever a user likes a post, we need to update the
    // user's liked post array on the client side
    useEffect(() => {
        if (user === null) return;
        if (postData.likedUsers?.length > 0) {
            if (postData.likedUsers.some((someUser) => someUser.userId === user.id)) {
                setLiked(true);
            }
        } else {
            setLiked(false);
        }
    }, [user]);

    const handleLikeButtonClick = async (event) => {
        event.stopPropagation();
        try {
            const data = await likePost(postData._id);
            if (data.redirect) {
                window.location.href = `${data.redirect}`;
                return;
            }
            setNumberOfLikes(data.likes);
            if (data.liked) {
                setLiked(true);
                if (user.id === postData.authorId) return;
                socket.emit("createNotification", {
                    type: "like",
                    postId: postData._id,
                    toUserId: postData.authorId,
                    fromUserId: user.id,
                    timestamp: Date.now(),
                });
            } else {
                setLiked(false);
                socket.emit("deleteServerNotification", {
                    type: "like",
                    postId: postData._id,
                    toUserId: postData.authorId,
                    fromUserId: user.id,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
                aria-label="like post"
                onClick={handleLikeButtonClick}
                sx={{ color: liked ? "error.main" : "text.primary" }}
            >
                {liked ? (
                    <FavoriteIcon fontSize="small" />
                ) : (
                    <FavoriteBorderIcon fontSize="small" />
                )}
            </IconButton>
            <Typography variant="body2">{numberOfLikes}</Typography>
        </div>
    );
};

export default LikeButton;
