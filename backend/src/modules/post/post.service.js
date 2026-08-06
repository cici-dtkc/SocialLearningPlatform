import mongoose from "mongoose";
import Post from "./post.model.js";

const sanitizePost = (post) => ({
    id: post._id,
    author: post.author,
    content: post.content,
    images: post.images,
    tags: post.tags,
    visibility: post.visibility,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
});

const buildAuthorPopulation = () => ({
    path: "author",
    select: "username fullName avatar role",
});

export const getPosts = async ({ page = 1, limit = 10, authorId } = {}) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (currentPage - 1) * pageSize;

    const filter = {};
    if (authorId && mongoose.Types.ObjectId.isValid(authorId)) {
        filter.author = authorId;
    }

    const [posts, total] = await Promise.all([
        Post.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate(buildAuthorPopulation()),
        Post.countDocuments(filter),
    ]);

    return {
        data: posts.map(sanitizePost),
        meta: {
            page: currentPage,
            limit: pageSize,
            total,
            totalPages: Math.ceil(total / pageSize) || 1,
        },
    };
};

export const getPostById = async (postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    const post = await Post.findById(postId).populate(buildAuthorPopulation());

    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    return sanitizePost(post);
};

export const createPost = async (authorId, payload) => {
    const createdPost = await Post.create({
        author: authorId,
        content: payload.content,
        images: Array.isArray(payload.images) ? payload.images : [],
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        visibility: payload.visibility || "public",
    });

    const populatedPost = await Post.findById(createdPost._id).populate(buildAuthorPopulation());

    return sanitizePost(populatedPost || createdPost);
};

export const updatePost = async (postId, authorId, payload) => {
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

    if (post.author.toString() !== authorId.toString()) {
        const error = new Error("You are not allowed to update this post");
        error.statusCode = 403;
        throw error;
    }

    const updateData = {};

    if (payload.content !== undefined) {
        updateData.content = payload.content;
    }

    if (payload.images !== undefined) {
        updateData.images = payload.images;
    }

    if (payload.tags !== undefined) {
        updateData.tags = payload.tags;
    }

    if (payload.visibility !== undefined) {
        updateData.visibility = payload.visibility;
    }

    if (Object.keys(updateData).length === 0) {
        const error = new Error("No valid fields to update");
        error.statusCode = 400;
        throw error;
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate(buildAuthorPopulation());

    return sanitizePost(updatedPost);
};

export const deletePost = async (postId, authorId) => {
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

    if (post.author.toString() !== authorId.toString()) {
        const error = new Error("You are not allowed to delete this post");
        error.statusCode = 403;
        throw error;
    }

    await Post.findByIdAndDelete(postId);

    return {
        id: post._id,
    };
};