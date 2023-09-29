import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getPostById, deletePost } from "../../helpers/Api";
import { SocketContext } from "../../helpers/SocketContext";
import { UserContext } from "../../helpers/UserContext";
import { useContext } from "react";

const DeleteButton = ({ postData, setPosts }) => {
    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserContext);

    const handleDelete = async (event) => {
        event.stopPropagation();
        try {
            const data = await deletePost(postData);
            if (data.redirect) {
                window.location.href = `${data.redirect}`;
                return;
            }
            if (setPosts) {
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post._id !== postData._id)
                );
            }
            console.log(postData);
            if (postData.referenceId) {
                console.log("deleteServerNotification emitted");
                const parentPost = await getPostById(postData.referenceId);
                socket.emit("deleteServerNotification", {
                    type: "comment",
                    postId: parentPost.post._id,
                    toUserId: parentPost.post.authorId,
                    fromUserId: user.id,
                });
            }
            if (data.reroute) {
                window.location.href = `${data.reroute}`;
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <IconButton aria-label="delete post" onClick={handleDelete} sx={{ mr: 1 }}>
            <DeleteIcon />
        </IconButton>
    );
};

export default DeleteButton;
