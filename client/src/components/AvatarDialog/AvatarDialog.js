import { Dialog, Avatar } from "@mui/material";
import { useState } from "react";

const AvatarDialog = ({ avatarUrl, username }) => {
    const [open, setOpen] = useState(false);

    const handleAvatarClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Avatar
                src={avatarUrl ? avatarUrl : ""}
                alt={username ? username : ""}
                onClick={handleAvatarClick}
                sx={{
                    height: "100px",
                    width: "100px",
                    "&:hover": {
                        cursor: "pointer",
                        opacity: 0.7,
                    },
                }}
            />

            <Dialog open={open} onClose={handleClose}>
                <img
                    src={avatarUrl ? avatarUrl : ""}
                    alt={username ? username : ""}
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
        </>
    );
};

export default AvatarDialog;
