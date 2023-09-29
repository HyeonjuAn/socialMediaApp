const Notification = require("../models/Notification/Notification");
const User = require("../models/User/User");

const getAllNotificationsByUser = async (req, res) => {
    const { username } = req;
    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const notifications = await Notification.find({ toUserId: foundUser._id });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteNotificationById = async (req, res) => {
    const { id } = req.params;

    // From verifyJWT
    const { username } = req;
    // Check user accessing this notification is the same as the user who owns the notification
    // Check if notification exists
    // Delete notification
    try {
        const foundNotification = Notification.findById(id).exec();
        const foundUser = User.findOne({ username }).exec();

        if (!foundNotification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (foundNotification.fromUserId !== foundUser._id) {
            return res
                .status(403)
                .json({ message: "User not authorized to delete this notification" });
        }
        await Notification.findByIdAndDelete(id);
        return res.status(200);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllNotificationsByUser,
    deleteNotificationById,
};
