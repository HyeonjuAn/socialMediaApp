const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    roles: {
        User: {
            type: Number,
            default: 2001,
        },
        Editor: Number,
        Admin: Number,
    },

    avatar: {
        type: String,
        default: "",
    },

    bio: {
        type: String,
        default: "",
    },

    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    followersCount: {
        type: Number,
        default: 0,
    },

    followingCount: {
        type: Number,
        default: 0,
    },

    dateJoined: {
        type: Date,
        default: Date.now,
    },
});

userSchema.index({ username: "text" });

module.exports = mongoose.model("User", userSchema);
