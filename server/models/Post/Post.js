const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    authorName: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        default: "",
    },

    imageName: {
        type: String,
        default: "",
    },

    likes: {
        type: Number,
        default: 0,
    },

    likedUsers: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            likedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],

    commentCount: {
        type: Number,
        default: 0,
    },

    date: {
        type: Date,
        default: Date.now,
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    },
});

postSchema.index({ content: "text" });

module.exports = mongoose.model("Post", postSchema);
