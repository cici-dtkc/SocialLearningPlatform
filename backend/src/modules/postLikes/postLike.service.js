import mongoose from "mongoose";
import Post from "../post/post.model.js";
import PostLike from "./postLike.model.js";

const ensurePostExists = async (postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    const post = await Post.findById(postId);

    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    return post;
};

export const getPostLikes = async (postId) => {
    await ensurePostExists(postId);

    const likes = await PostLike.find({ post: postId })
        .populate({
            path: "user",
            select: "id username fullName avatar",
        })
        .sort({ createdAt: -1 });

    return {
        postId,
        count: likes.length,
        users: likes.map((like) => ({
            id: like.user?._id ?? like.user?.id,
            username: like.user?.username,
            fullName: like.user?.fullName,
            avatar: like.user?.avatar,
        })),
    };
};

export const likePost = async (postId, userId) => {
    await ensurePostExists(postId);

    const existingLike = await PostLike.findOne({
        post: postId,
        user: userId,
    });

    if (existingLike) {
        return {
            liked: true,
            alreadyLiked: true,
        };
    }

    await PostLike.create({
        post: postId,
        user: userId,
    });

    await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 },
    });

    return {
        liked: true,
        alreadyLiked: false,
    };
};

export const unlikePost = async (postId, userId) => {
    await ensurePostExists(postId);

    const deletedLike = await PostLike.findOneAndDelete({
        post: postId,
        user: userId,
    });

    if (!deletedLike) {
        return {
            liked: false,
            alreadyUnliked: true,
        };
    }

    await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
    });

    return {
        liked: false,
        alreadyUnliked: false,
    };
};