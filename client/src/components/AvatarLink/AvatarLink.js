import { Avatar } from "@mui/material";
import { UserContext } from "../../helpers/UserContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const AvatarLink = ({ avatarUrl, username, disableLink }) => {
    const { user } = useContext(UserContext);

    const avatar = (
        <Avatar
            src={avatarUrl ? avatarUrl : ""}
            alt={username ? username : ""}
            sx={{
                transition: "0.3s",
                "&:hover": {
                    opacity: disableLink ? 1 : 0.7, // The image will get 30% dimmer on hover only if link is not disabled
                },
                height: "40px",
                width: "40px",
            }}
        />
    );

    return disableLink ? (
        avatar
    ) : (
        <Link
            to={username ? `/${username}` : `/${user.username}`}
            style={{ textDecoration: "none" }}
        >
            {avatar}
        </Link>
    );
};

export default AvatarLink;
