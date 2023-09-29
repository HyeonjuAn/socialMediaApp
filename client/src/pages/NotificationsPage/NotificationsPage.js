import { useContext, useState, useEffect } from "react";
import { deleteNotificationById } from "../../helpers/Api";
import { SocketContext } from "../../helpers/SocketContext";
import { Box } from "@mui/material";
import LeftCol from "../../components/LeftCol/LeftCol";
import Navbar from "../../components/Navbar/Navbar";
import Notification from "../../components/Notification/Notification";

const NotificationsPage = () => {
    const { notifications, setNotifications, setNotificationCount } =
        useContext(SocketContext);
    const [copiedNotifications, setCopiedNotifications] = useState([]);
    // Copy notifications to state for displaying
    useEffect(() => {
        if (notifications.length > 0) {
            setCopiedNotifications([...notifications]);
        }
    }, [notifications]);

    // Clear notifications when the component is unmounted
    useEffect(() => {
        return () => {
            const deleteNotifications = async () => {
                for (const notification of copiedNotifications) {
                    try {
                        await deleteNotificationById(notification._id);
                    } catch (error) {
                        console.error("Failed to delete notification:", error);
                    }
                }
            };

            deleteNotifications().then(() => {
                setNotificationCount(0);
                setNotifications([]);
            });
        };
    }, [copiedNotifications]);
    return (
        <>
            <Navbar />
            <LeftCol />
            <Box
                sx={{
                    width: "40%",
                    minWidth: "400px",
                    height: "100%",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "visible",
                    margin: "0 auto",
                    paddingTop: "64px",
                    marginLeft: "30%",
                    border: 1,
                    borderTop: 0,
                    borderBottom: 0,
                    borderColor: "divider",
                }}
            >
                {copiedNotifications.map((notification) => (
                    <Notification notification={notification} key={notification._id} />
                ))}
            </Box>
            <Box
                sx={{
                    width: "30%",
                    height: "100%",
                    margin: "0 auto",
                    overflow: "auto",
                }}
            ></Box>
        </>
    );
};

export default NotificationsPage;
