import {
    Box,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
} from "@mui/material";

const Comment = ({ commentData }) => {
    const handleCommentClick = () => {
        window.location.href = `/post/${commentData._id}`;
    };

    return (
        <CardActionArea
            component="div"
            onClick={handleCommentClick}
            sx={{
                "&:hover": { backgroundColor: "grey.200" },
            }}
        >
            <Card
                sx={{
                    bgcolor: "background.default",
                    borderBottom: 1,
                    borderWidth: 1,
                    borderColor: "divider",
                    borderRadius: 0,
                    padding: 1,
                    backgroundImage: "none",
                }}
            >
                <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                        {commentData.authorName}
                    </Typography>
                    <Typography variant="body2">{commentData.content}</Typography>
                    {commentData.imageUrl && (
                        <CardMedia
                            component="img"
                            image={commentData.imageUrl}
                            alt="comment-image"
                            sx={{
                                marginTop: 1,
                                borderRadius: 2,
                                width: "100%",
                                maxWidth: "450px",
                                height: "auto",
                                maxHeight: "350px",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    )}
                </CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        px: 2,
                        pb: 1,
                    }}
                >
                    <Typography variant="caption">
                        {new Date(commentData.date).toLocaleString()}
                    </Typography>
                </Box>
            </Card>
        </CardActionArea>
    );
};

export default Comment;
