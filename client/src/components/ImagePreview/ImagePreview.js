import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";

const ImagePreview = ({ image, clearImage }) => (
    <Box sx={{ position: "relative", width: "100%" }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
                component="img"
                sx={{
                    marginTop: 2,
                    borderRadius: 4,
                    maxWidth: "100%", // Limit the width to the parent width
                    maxHeight: 300, // Set maximum height
                    height: "auto", // Maintain aspect ratio
                    width: "auto", // Maintain aspect ratio
                }}
                src={image}
            />
            <IconButton
                sx={{
                    position: "absolute",
                    top: 0, // Align to the top
                    right: -15, // Align to the right
                    background: "rgba(255, 255, 255, 0.8)",
                    color: "black",
                    "&:hover": {
                        background: (theme) => theme.palette.error.main,
                    },
                }}
                onClick={clearImage}
            >
                <CloseIcon />
            </IconButton>
        </Box>
    </Box>
);

export default ImagePreview;
