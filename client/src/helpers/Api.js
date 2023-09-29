import axios from "axios";

//TODO: Test all api routes
export const loginUser = async (email, password, setText, setUser) => {
    try {
        const { data } = await axios.post(
            "http://localhost:3500/api/login",
            { email, password },
            { withCredentials: true }
        );
        if (data.redirect) {
            setUser(data.currentUser);
            window.location.href = `${data.redirect}`;
        }
    } catch (error) {
        setText(error.response.data.message);
    }
};

export const registerUser = async (formData, setText) => {
    try {
        const { data } = await axios.post(
            "http://localhost:3500/api/register",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );
        if (data.redirect) {
            window.location.href = `${data.redirect}`;
        }
    } catch (error) {
        setText(error?.response?.data?.message);
    }
};

export const deleteUser = async () => {
    try {
        const { data } = await axios.delete(
            "http://localhost:3500/api/user/delete",
            { withCredentials: true }
        );
        if (data.redirect) {
            window.location.href = `${data.redirect}`;
        }
    } catch (error) {
        console.error(error);
    }
};

export const logoutUser = async (setUser) => {
    try {
        const { data } = await axios.post("http://localhost:3500/api/logout", {
            withCredentials: true,
        });
        if (data.redirect) {
            setUser(null);
            window.location.href = `${data.redirect}`;
        }
    } catch (error) {
        console.error(error);
    }
};

export const getUserByUsername = async (username) => {
    try {
        const { data } = await axios.get(
            `http://localhost:3500/api/user/${username}`,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getTrendingPosts = async () => {
    try {
        const { data } = await axios.get(
            "http://localhost:3500/api/posts/trending",
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getTopPosts = async () => {
    try {
        const { data } = await axios.get("http://localhost:3500/api/posts/top", {
            withCredentials: true,
        });
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getNewPosts = async () => {
    try {
        const { data } = await axios.get("http://localhost:3500/api/posts/new", {
            withCredentials: true,
        });
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getNewPostsByUser = async (username) => {
    try {
        const { data } = await axios.get(
            `http://localhost:3500/api/user/${username}/posts/new`,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getTopPostsByUser = async (username) => {
    try {
        const { data } = await axios.get(
            `http://localhost:3500/api/user/${username}/posts/top`,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getRecentlyLikedPostsByUser = async (username) => {
    try {
        const { data } = await axios.get(
            `http://localhost:3500/api/user/${username}/posts/liked`,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getCommentsByUser = async (username) => {
    try {
        const { data } = await axios.get(
            `http://localhost:3500/api/user/${username}/posts/replies`,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getPostById = async (postId) => {
    try {
        const response = await axios.get(
            `http://localhost:3500/api/posts/id/${postId}`
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const makePost = async (formData) => {
    try {
        const response = await axios.post(
            "http://localhost:3500/api/makepost",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const replyToPost = async (formData, postId) => {
    try {
        const response = await axios.post(
            `http://localhost:3500/api/posts/reply/${postId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const deletePost = async (postData) => {
    try {
        const response = await axios.delete(
            `http://localhost:3500/api/posts/id/${postData._id}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const likePost = async (postId) => {
    try {
        const response = await axios.post(
            `http://localhost:3500/api/posts/${postId}/like`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const searchPosts = async (query) => {
    try {
        const response = await axios.get(
            `http://localhost:3500/api/posts/search/${query}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const searchUsers = async (query) => {
    try {
        const response = await axios.get(
            `http://localhost:3500/api/user/search/${query}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const getAllNotificationsByUser = async () => {
    try {
        const response = await axios.get(
            `http://localhost:3500/api/notifications`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const deleteNotificationById = async (notificationId) => {
    try {
        const response = await axios.delete(
            `http://localhost:3500/api/notifications/${notificationId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const followUserById = async (userId) => {
    try {
        const response = await axios.post(
            `http://localhost:3500/api/user/${userId}/follow`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

export const isUserFollowing = async (userId) => {
    try {
        const response = await axios.get(
            `http://localhost:3500/api/user/${userId}/isfollowing`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
};

//TODO: implement this
// export const savePost = async (postId) => {
//     try {
//         const response = await axios.post(
//             `http://localhost
