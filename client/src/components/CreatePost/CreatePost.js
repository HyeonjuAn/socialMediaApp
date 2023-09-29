import { useContext, useRef, useState } from "react";
import { Button, IconButton, TextField, Box } from "@mui/material";
import AvatarLink from "../AvatarLink/AvatarLink";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImagePreview from "../ImagePreview/ImagePreview";
import { SocketContext } from "../../helpers/SocketContext";
import { UserContext } from "../../helpers/UserContext";

const CreatePost = ({ callback, apiCall, parentPost }) => {
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const submitButtonRef = useRef(null);
    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const [content, setContent] = useState("");
    const [isFocused, setIsFocused] = useState(false); // Track focus state

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        formData.append("content", content);

        let data;
        if (parentPost) {
            data = await apiCall(formData, parentPost._id);
            if (user.id !== parentPost.authorId) {
                socket.emit("createNotification", {
                    type: "comment",
                    postId: parentPost._id,
                    toUserId: parentPost.authorId,
                    fromUserId: user.id,
                    timestamp: Date.now(),
                });
            }
        } else {
            data = await apiCall(formData);
        }

        callback((prevPosts) => [data, ...prevPosts]);
        setFile(null);
        setImage(null);
        setContent("");
        if (data.redirect) {
            setIsFocused(false);
            window.location.href = data.redirect;
            return;
        } else {
            setIsFocused(false);
            return;
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <Box
            sx={{
                width: "100%",
                border: 1,
                borderTop: 0,
                borderColor: "divider",
                p: 2,
                bgcolor: (theme) => theme.palette.background.default,
            }}
        >
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <AvatarLink avatarUrl={user.avatarUrl} username={user.username} />
                    <TextField
                        fullWidth
                        multiline
                        minRows={isFocused ? 3 : 1} // Dynamic size based on focus
                        maxRows={Infinity}
                        inputProps={{ maxLength: 250 }}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="What's happening?"
                        required
                        variant="standard"
                        sx={{
                            flexGrow: 1,
                            ml: 2,
                            backgroundColor: "transparent",
                            "& .MuiInput-underline:before": {
                                borderBottom: "1px solid rgba(0, 0, 0, 0.42)", // default underline
                                opacity: 0,
                                transform: "scaleX(0)",
                                transition: "opacity 200ms, transform 200ms",
                            },
                            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                                opacity: 1,
                                transform: "scaleX(1)",
                            },
                            "& .MuiInput-underline:after": {
                                opacity: isFocused ? 1 : 0,
                                transform: isFocused ? "scaleX(1)" : "scaleX(0)",
                                transition: "opacity 200ms, transform 200ms",
                            },
                        }}
                        onFocus={() => setIsFocused(true)} // Set focus state to true
                        onBlur={(e) => {
                            if (e.relatedTarget !== submitButtonRef.current) {
                                setIsFocused(false);
                            }
                        }}
                    />
                </Box>
                <input
                    id="image-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                {image && (
                    <ImagePreview
                        image={image}
                        clearImage={() => {
                            setFile(null);
                            setImage(null);
                        }}
                    />
                )}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2,
                    }}
                >
                    <label htmlFor="image-upload">
                        <IconButton color="primary" component="span">
                            <AddPhotoAlternateIcon />
                        </IconButton>
                    </label>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        ref={submitButtonRef}
                    >
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreatePost;
