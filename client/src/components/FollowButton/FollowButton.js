import { Button } from "@mui/material";
import { isUserFollowing, followUserById } from "../../helpers/Api";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../helpers/UserContext";
import { SocketContext } from "../../helpers/SocketContext";

const FollowButton = ({ userData }) => {
    const [following, setFollowing] = useState(false);
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const id = userData.id;

    useEffect(() => {
        if (!user || user.id === userData.id) return;

        const checkIfUserIsFollowing = async () => {
            const data = await isUserFollowing(id);
            if (data.redirect) {
                window.location.href = `${data.redirect}`;
                return;
            }
            setFollowing(data.following);
        };
        checkIfUserIsFollowing();
    }, [user]);

    const handleFollowButtonClick = async (event) => {
        event.stopPropagation();
        try {
            const data = await followUserById(id);
            if (data.redirect) {
                window.location.href = `${data.redirect}`;
                return;
            }
            setFollowing(data.following);
            const notificationType = data.following
                ? "createNotification"
                : "deleteServerNotification";
            socket.emit(notificationType, {
                type: "follow",
                toUserId: id,
                fromUserId: user.id,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            sx={{
                width: "100%",
            }}
        >
            <Button
                variant="contained"
                color={following ? "error" : "primary"}
                onClick={handleFollowButtonClick}
                sx={{
                    borderRadius: 25,
                    padding: "0 16px", // Set padding as specified
                    textTransform: "capitalize",
                    fontSize: "0.875rem",
                    width: "fit-content", // Adjust width to fit content
                    minWidth: "36px", // Set the minimum width
                    minHeight: "36px", // Set the minimum height
                }}
            >
                {following ? "Unfollow" : "Follow"}
            </Button>
        </div>
    );
};

export default FollowButton;
