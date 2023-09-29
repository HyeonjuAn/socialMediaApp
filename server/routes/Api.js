const express = require("express");
const router = express.Router();
const {
    getAllNotificationsByUser,
    deleteNotificationById,
} = require("../controllers/notificationController");
const {
    userRegistration,
    userLogin,
    getUserByUsername,
    userLogout,
    userDelete,
    searchUsers,
    followUser,
    isFollowingUser,
} = require("../controllers/userController");
const { filterText } = require("../middleware/filterText");
const { filterImages } = require("../middleware/filterImages");
const { verifyJWT } = require("../middleware/verifyJWT");
const {
    getTopPosts,
    getTrendingPosts,
    getNewPosts,
    getNewPostsByUser,
    getTopPostsByUser,
    getRecentlyLikedPostsByUser,
    getCommentsByUser,
    makePost,
    likePost,
    deletePost,
    getPostById,
    replyToPost,
    searchPosts,
} = require("../controllers/postController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
    .route("/makepost")
    // .post(upload.single("image"), verifyJWT, filterImages, filterText, makePost);
    .post(upload.single("image"), verifyJWT, makePost); // No longer have access to API Calls

router.route("/login").post(userLogin);

router
    .route("/register")
    // .post(upload.single("image"), filterImages, userRegistration);
    .post(upload.single("image"), userRegistration); // No longer have access to API Calls

router.route("/logout").post(userLogout);

// Redo user routes
router.route("/user/delete").delete(verifyJWT, userDelete);

router.route("/user/:username/posts/top").get(getTopPostsByUser);

router.route("/user/:username/posts/new").get(getNewPostsByUser);

router.route("/user/:username/posts/liked").get(getRecentlyLikedPostsByUser);

router.route("/user/:username/posts/replies").get(getCommentsByUser);

router.route("/user/:username").get(getUserByUsername);

router.route("/user/:id/follow").post(verifyJWT, followUser);

router.route("/user/:id/isfollowing").get(verifyJWT, isFollowingUser);

router.route("/user/search/:query").get(searchUsers);

router.route("/posts/top").get(getTopPosts);

router.route("/posts/new").get(getNewPosts);

router.route("/posts/trending").get(getTrendingPosts);

router.route("/posts/:postId/like").post(verifyJWT, likePost);

router
    .route("/posts/id/:postId")
    .get(getPostById)
    .delete(verifyJWT, deletePost);

router
    .route("/posts/reply/:postId")
    // .post(
    //     upload.single("image"),
    //     verifyJWT,
    //     filterImages,
    //     filterText,
    //     replyToPost
    // );
    .post(upload.single("image"), verifyJWT, replyToPost); // No longer have access to API Calls

router.route("/posts/search/:query").get(searchPosts);

// router.route('/')
//   .get((req, res) => {
//     res.send(req.headers['user-agent']);
//     console.log(req.headers['user-agent']);
//   })

// router.route('/logout')
//   .post(logoutController);

router.route("/notifications").get(verifyJWT, getAllNotificationsByUser);

router.route("/notifications/:id").delete(verifyJWT, deleteNotificationById);

module.exports = router;
