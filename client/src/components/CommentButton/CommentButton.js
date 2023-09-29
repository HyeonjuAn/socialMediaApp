import { IconButton, Typography } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { useState, useEffect } from "react";

const CommentButton = ({ postData }) => {
    const [numberOfComments, setNumberOfComments] = useState(0);

    useEffect(() => {
        if (postData) {
            setNumberOfComments(postData.commentCount);
        }
    }, [postData]);

    const handleCommentButtonClick = (event) => {
        event.stopPropagation();
        window.location.href = `/post/${postData._id}`;
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
                aria-label="comment post"
                sx={{ mr: 1 }}
                onClick={handleCommentButtonClick}
            >
                <CommentIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2">{numberOfComments}</Typography>
        </div>
    );
};

export default CommentButton;
