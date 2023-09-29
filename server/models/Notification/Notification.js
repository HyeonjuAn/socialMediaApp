const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ["like", "comment", "follow"],
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Notification", notificationSchema);
