import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState, useContext } from "react";
import { UserContext } from "../../helpers/UserContext";
import { logoutUser } from "../../helpers/Api";
import AvatarLink from "../AvatarLink/AvatarLink";

const ProfileMenuButton = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { user, setUser } = useContext(UserContext);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose();
        try {
            await logoutUser(setUser);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                    marginRight: 1,
                }}
            >
                <AvatarLink
                    username={user.username}
                    avatarUrl={user.avatarUrl}
                    disableLink={true}
                />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        window.location.href = `/user/${user.username}`;
                    }}
                >
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
};

export default ProfileMenuButton;
