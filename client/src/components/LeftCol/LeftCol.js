import { useContext } from "react";
import { UserContext } from "../../helpers/UserContext";
import { SocketContext } from "../../helpers/SocketContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Profile Icon
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const LeftCol = () => {
    const { user } = useContext(UserContext);
    const { notificationCount } = useContext(SocketContext);
    const theme = useTheme();
    const matches = useMediaQuery("(min-width:930px)");

    const buttonContent = (IconComponent, text) => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <IconComponent />
            {matches && <Box ml={2}>{text}</Box>}
        </Box>
    );

    return (
        <Box
            sx={{
                width: "30%",
                height: "100%",
                marginTop: "82px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // justifyContent: "center",
                gap: "20px",
                position: "fixed",
            }}
        >
            <Button
                variant="contained"
                sx={{
                    borderRadius: "50px",
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    width: "66%",
                    height: "60px",
                }}
                onClick={() => {
                    window.location.href = "/";
                }}
            >
                {buttonContent(HomeIcon, "Home")}
            </Button>
            {user && (
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: "50px",
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        width: "66%",
                        height: "60px",
                    }}
                    onClick={() => {
                        window.location.href = `/user/${user.username}`;
                    }}
                >
                    {buttonContent(AccountCircleIcon, "Profile")}
                </Button>
            )}
            <Button
                variant="contained"
                sx={{
                    borderRadius: "50px",
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    width: "66%",
                    height: "60px",
                }}
                onClick={() => {
                    window.location.href = "/explore";
                }}
            >
                {buttonContent(ExploreIcon, "Explore")}
            </Button>
            {user && (
                <>
                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: "50px",
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            width: "66%",
                            height: "60px",
                        }}
                        onClick={() => {
                            window.location.href = "/notifications";
                        }}
                    >
                        {buttonContent(NotificationsIcon, "Notifications")}
                        {notificationCount > 0 && (
                            // TODO: Edit later
                            <Box
                                sx={{
                                    backgroundColor: theme.palette.error.main,
                                    color: theme.palette.text.primary,
                                    borderRadius: "50px",
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "absolute",
                                    right: "10px",
                                }}
                            >
                                {notificationCount}
                            </Box>
                        )}
                    </Button>
                </>
            )}
        </Box>
    );
};

export default LeftCol;
