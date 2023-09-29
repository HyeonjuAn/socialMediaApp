const Notification = require("../models/Notification/Notification");

const users = {};

const SocketHandler = (io) => {
    io.on("connection", (socket) => {
        socket.on("login", (userId) => {
            users[userId] = socket.id;
            socket.userId = userId;
            console.log("Current users:", users);
        });

        socket.on("createNotification", async (data) => {
            const { type, postId, toUserId, fromUserId, timestamp } = data;

            // Adjusted data verification
            if (
                !type ||
                !toUserId ||
                !fromUserId ||
                !timestamp ||
                (type !== "follow" && !postId)
            ) {
                return;
            }

            let notification = new Notification({
                type,
                toUserId,
                fromUserId,
                timestamp,
            });

            if (type !== "follow") {
                notification.postId = postId;
            }

            try {
                const savedNotification = await notification.save();
                if (users[toUserId]) {
                    io.to(users[toUserId]).emit("sentNotification", savedNotification);
                }
            } catch (error) {
                console.error("Error saving notification:", error);
            }
        });

        socket.on("deleteServerNotification", async (data) => {
            const { type, postId, toUserId, fromUserId } = data;

            const query = {
                type,
                toUserId,
                fromUserId,
            };

            if (type !== "follow") {
                query.postId = postId;
            }

            try {
                const foundNotification = await Notification.findOne(query);
                if (foundNotification) {
                    io.to(users[toUserId]).emit(
                        "deleteClientNotification",
                        foundNotification
                    );
                    await Notification.deleteOne({ _id: foundNotification._id });
                }
            } catch (error) {
                console.error("Error deleting notification:", error);
            }
        });

        socket.on("disconnect", () => {
            if (socket.userId) {
                delete users[socket.userId];
            }
        });
    });
};
module.exports = SocketHandler;
