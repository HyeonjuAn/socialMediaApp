const User = require("../models/User/User");
const Post = require("../models/Post/Post");
const mongoose = require("mongoose");

// Image processing
const sharp = require("sharp");
const {
    generateFileName,
    uploadFile,
    deleteFile,
    getObjectSignedUrl,
} = require("../config/s3");

const makePost = async (req, res) => {
    const { username } = req;
    const postingUser = await User.findOne({ username });
    if (!postingUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const { content } = req.body;
    let imageName = "";

    if (req.file) {
        const { file } = req;
        console.dir(req.file, { depth: null });
        imageName = generateFileName();

        const fileBuffer = await sharp(file.buffer)
            .resize({
                width: 1080,
                withoutEnlargement: true,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            })
            .toBuffer();

        await uploadFile(fileBuffer, imageName, file.mimetype);
    }

    const newPost = await Post.create({
        authorId: postingUser._id,
        authorName: postingUser.username,
        content,
        imageName,
    });

    const postObject = newPost.toObject();
    if (newPost.imageName) {
        postObject.imageUrl = await getObjectSignedUrl(newPost.imageName);
    }

    console.log(`New post created: ${postObject}`);

    return res.status(201).json(postObject);
};

const replyToPost = async (req, res) => {
    const { username } = req;
    const { postId } = req.params;

    // Ensure the post being replied to exists and increment comment count
    const parentPost = await Post.findById(postId);
    if (!parentPost) {
        return res.status(404).json({ error: "Post not found" });
    }
    parentPost.commentCount++;
    await parentPost.save();

    const replyingUser = await User.findOne({ username });
    if (!replyingUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const { content } = req.body;
    let imageName = "";

    if (req.file) {
        const { file } = req;
        console.dir(req.file, { depth: null });
        imageName = generateFileName();

        const fileBuffer = await sharp(file.buffer)
            .resize({ height: 1920, width: 1080, fit: "cover" })
            .toBuffer();

        await uploadFile(fileBuffer, imageName, file.mimetype);
    }

    const replyingPost = await Post.create({
        authorId: replyingUser._id,
        authorName: replyingUser.username,
        content,
        imageName,
        referenceId: postId,
    });

    const replyObject = replyingPost.toObject();
    if (replyingPost.imageName) {
        replyObject.imageUrl = await getObjectSignedUrl(replyingPost.imageName);
    }

    return res.status(201).json(replyObject);
};

const likePost = async (req, res) => {
    const { postId } = req.params;
    const { username } = req;
    const currentUser = await User.findOne({ username: username }).exec();
    const favoritedPost = await Post.findById(postId);
    if (!favoritedPost) {
        return res.status(404).json({ error: "Post not found" });
    }

    // Check if user has already liked the post
    const existingLike = favoritedPost.likedUsers.find(
        (like) => like.userId.toString() === currentUser._id.toString()
    );

    if (existingLike) {
        // If user has already liked post, unlike it
        favoritedPost.likedUsers = favoritedPost.likedUsers.filter(
            (like) => like.userId.toString() !== currentUser._id.toString()
        );
        favoritedPost.likes--;
        await favoritedPost.save();
        return res.status(200).json({ liked: false, likes: favoritedPost.likes });
    } else {
        // Otherwise, like it
        favoritedPost.likedUsers.push({
            userId: currentUser._id,
            likedAt: new Date(),
        });
        favoritedPost.likes++;
        await favoritedPost.save();
        return res.status(200).json({ liked: true, likes: favoritedPost.likes });
    }
};

const deleteAssociatedPosts = async (postId) => {
    const comments = await Post.find({ referenceId: postId }).exec();

    for (let comment of comments) {
        await deleteAssociatedPosts(comment._id);
    }

    const currentPost = await Post.findById(postId).exec();
    if (currentPost.imageName) {
        await deleteFile(currentPost.imageName);
    }
    if (currentPost.referenceId) {
        const parentPost = await Post.findById(currentPost.referenceId).exec();
        if (parentPost) {
            parentPost.commentCount--;
            await parentPost.save();
        }
    }

    await Post.findByIdAndDelete(postId);
};

const deletePost = async (req, res) => {
    const { username } = req;
    const { postId } = req.params;
    try {
        const currentPost = await Post.findById(postId).exec();
        if (!currentPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        const postAuthor = await User.findOne({
            username: currentPost.authorName,
        }).exec();

        // Ensure the user making the request is the author of the post.
        if (postAuthor.username !== username) {
            return res
                .status(403)
                .json({ error: "You don't have permission to delete this post" });
        }

        let parentPostId = "";
        if (currentPost.referenceId) {
            parentPostId = currentPost.referenceId;
        }

        await deleteAssociatedPosts(postId);
        return res.status(200).json({ reroute: `/post/${parentPostId}` });
    } catch (error) {
        console.error(error);
    }
};

const getAuthorAvatar = async (userId) => {
    const currentUser = await User.findOne({ _id: userId }).exec();
    if (!currentUser) {
        return "";
    }
    if (!currentUser.avatar) {
        return "";
    }
    const url = await getObjectSignedUrl(currentUser.avatar);
    return url;
};

const getPostById = async (req, res) => {
    const id = req.params.postId;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const postObject = post.toObject();
        if (post.imageName) {
            postObject.imageUrl = await getObjectSignedUrl(post.imageName);
        }
        postObject.avatarUrl = await getAuthorAvatar(post.authorId);

        // Comments handling of post
        const comments = await Post.find({ referenceId: id });
        for (let comment of comments) {
            comment = comment.toObject();
            comment.avatarUrl = await getAuthorAvatar(comment.authorId);
            if (comment.imageName) {
                comment.imageUrl = await getObjectSignedUrl(comment.imageName);
            }
        }

        const parents = [];
        let currentPostId = postObject.referenceId; // Start with the referenceId of the initial post
        while (currentPostId) {
            const parentPost = await Post.findById(currentPostId);
            if (!parentPost) break; // Exit loop if parent post is not found

            let parentPostObj = parentPost.toObject();
            parentPostObj.avatarUrl = await getAuthorAvatar(parentPostObj.authorId);
            if (parentPostObj.imageName) {
                parentPostObj.imageUrl = await getObjectSignedUrl(
                    parentPostObj.imageName
                );
            }
            parents.push(parentPostObj);

            currentPostId = parentPostObj.referenceId; // Move up the hierarchy
        }

        return res.json({ post: postObject, comments, parents });
    } catch (error) {
        console.error(error);
    }
};

const getTrendingPosts = async (req, res) => {
    try {
        const trendingPosts = await Post.aggregate([
            { $match: { referenceId: null } }, // Filter out posts with referenceId
            {
                $project: {
                    _id: 1,
                    authorId: 1,
                    authorName: 1,
                    content: 1,
                    imageName: 1,
                    likes: 1,
                    likedUsers: 1,
                    commentCount: 1,
                    date: 1,
                    trendingScore: {
                        $divide: [
                            { $toDouble: "$likes" },
                            { $multiply: [{ $subtract: [new Date(), "$date"] }, 1000] },
                        ],
                    },
                },
            },
            { $sort: { trendingScore: -1 } },
            { $limit: 10 },
        ]);
        for (let post of trendingPosts) {
            if (post.imageName) {
                post.imageUrl = await getObjectSignedUrl(post.imageName);
            }
            post.avatarUrl = await getAuthorAvatar(post.authorId);
        }
        return res.json(trendingPosts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getNewPosts = async (req, res) => {
    try {
        const posts = await Post.find({ referenceId: null })
            .sort({ date: -1 })
            .limit(10); // Filter out posts with referenceId
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i].toObject();
            if (post.imageName) {
                post.imageUrl = await getObjectSignedUrl(posts[i].imageName);
            }
            post.avatarUrl = await getAuthorAvatar(post.authorId);
            posts[i] = post;
        }
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getTopPosts = async (req, res) => {
    try {
        const posts = await Post.find({ referenceId: null })
            .sort({ likes: -1 })
            .limit(10); // Filter out posts with referenceId
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i].toObject();
            if (post.imageName) {
                post.imageUrl = await getObjectSignedUrl(posts[i].imageName);
            }
            post.avatarUrl = await getAuthorAvatar(post.authorId);
            posts[i] = post;
        }
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getNewPostsByUser = async (req, res) => {
    const { username } = req.params;
    try {
        const posts = await Post.find({
            authorName: username,
            referenceId: null,
        })
            .sort({ date: -1 })
            .limit(10); // Filter out posts with referenceId
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i].toObject();
            if (post.imageName) {
                post.imageUrl = await getObjectSignedUrl(posts[i].imageName);
            }
            post.avatarUrl = await getAuthorAvatar(post.authorId);
            posts[i] = post;
        }
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getTopPostsByUser = async (req, res) => {
    const { username } = req.params;
    try {
        const posts = await Post.find({ authorName: username, referenceId: null })
            .sort({ likes: -1 })
            .limit(10); // Filter out posts with referenceId
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i].toObject();
            if (post.imageName) {
                post.imageUrl = await getObjectSignedUrl(posts[i].imageName);
            }
            post.avatarUrl = await getAuthorAvatar(post.authorId);
            posts[i] = post;
        }
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getRecentlyLikedPostsByUser = async (req, res) => {
    try {
        const { username } = req.params; // Assuming the user ID is passed as a parameter in the URL
        const currentUser = await User.findOne({ username: username }).exec();

        // Find posts that the user has liked, and sort them by the time they were liked
        const posts = await Post.aggregate([
            {
                $unwind: "$likedUsers",
            },
            {
                $match: {
                    "likedUsers.userId": new mongoose.Types.ObjectId(currentUser._id),
                },
            },
            {
                $sort: { "likedUsers.likedAt": -1 },
            },
            {
                $limit: 10,
            },
        ]);

        // Additional code to populate image URLs or other fields, if needed
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i];
            if (post.imageName) {
                post.imageUrl = await getObjectSignedUrl(post.imageName);
            }
            post.avatarUrl = await getAuthorAvatar(post.authorId);
            posts[i] = post;
        }

        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getCommentsByUser = async (req, res) => {
    try {
        const { username } = req.params;
        const posts = await Post.find({
            authorName: username,
            referenceId: { $ne: null },
        });
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const searchPosts = async (req, res) => {
    try {
        const { query } = req.params;
        const posts = await Post.find({
            content: new RegExp(query, "i"),
        });
        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i].toObject();
            if (post.imageName) {
                post.imageUrl = await getObjectSignedUrl(posts[i].imageName);
            }
            post.avatarUrl = await getAuthorAvatar(post.authorId);
            posts[i] = post;
        }
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    makePost,
    replyToPost,
    getTrendingPosts,
    getTopPosts,
    getNewPosts,
    getPostById,
    getRecentlyLikedPostsByUser,
    getNewPostsByUser,
    getTopPostsByUser,
    getCommentsByUser,
    deletePost,
    likePost,
    searchPosts,
};
