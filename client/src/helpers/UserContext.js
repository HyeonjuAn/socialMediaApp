import { useState, useEffect, createContext, useContext } from "react";
import { SocketContext } from "./SocketContext";
import { getAllNotificationsByUser } from "./Api";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const { socket, setNotifications, setNotificationCount } =
        useContext(SocketContext);
    const [user, setUser] = useState(null);

    const getUserNotificationsOnLogin = async () => {
        try {
            const data = await getAllNotificationsByUser();
            setNotifications(data);
            setNotificationCount(data.length);
        } catch (error) {
            console.error(error);
        }
    };

    // TODO: Set user expiration time equal to that of the JWT

    useEffect(() => {
        const foundUser = localStorage.getItem("currentUser");
        if (foundUser) {
            const currentUser = JSON.parse(foundUser);
            if (currentUser.expirationTime < Date.now()) {
                localStorage.removeItem("currentUser");
                setUser(null);
            } else {
                setUser(currentUser);
                socket.emit("login", currentUser.id);
                (async () => {
                    await getUserNotificationsOnLogin();
                })();
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            socket.emit("login", user.id);
            (async () => {
                await getUserNotificationsOnLogin(); // Fetch notifications after emitting the login event
            })();
        } else {
            localStorage.removeItem("currentUser");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };

// User object fields example
// avatarUrl: "https://smapp-demo-bucket.s3.us-east-2.amazonaws.com/1b0acf15c552577e3fc2ecf2ebe0f85a010aa0df3e79c0a8c13b640479e573cc?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAR56JOZDK6SDNJUMG%2F20230918%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20230918T194850Z&X-Amz-Expires=60&X-Amz-Signature=a1b8098748e13329639b8248d2311c74a5bdfca5017cf5a4d0b1083373e451cd&X-Amz-SignedHeaders=host&x-id=GetObject"
// expirationTime: 1695070130904
// id: "64d8416cdb6e63a8a794e0e2"
// roles: Object { User: 2001 }
// username: "test"
