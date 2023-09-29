import { useState, useEffect, createContext } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const socket = io("http://localhost:3500");

    useEffect(() => {
        const handleSentNotification = (notification) => {
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                notification,
            ]);
            setNotificationCount((prevCount) => prevCount + 1);
        };

        const handleDeleteClientNotification = (notification) => {
            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (prevNotification) => prevNotification._id !== notification._id
                )
            );
            setNotificationCount((prevCount) => prevCount - 1);
            console.log(notifications);
        };

        socket.on("deleteClientNotification", handleDeleteClientNotification);

        socket.on("sentNotification", handleSentNotification);

        // Cleanup
        return () => {
            socket.off("sentNotification", handleSentNotification);
            socket.off("deleteClientNotification", handleDeleteClientNotification);
        };
    }, []);

    return (
        <SocketContext.Provider
            value={{
                notifications,
                setNotifications,
                notificationCount,
                setNotificationCount,
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
