import mongoose from "mongoose";
import Comment from "./comment.model.js";
import Post from "../post/post.model.js";

const sanitizeComment = (comment) => ({
    id: comment._id,
    post: comment.post,
    author: comment.author,
    parentComment: comment.parentComment,
    content: comment.content,
    likesCount: comment.likesCount,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
});

const commentPopulation = [
    {
        path: "author",
        select: "username fullName avatar role",
    },
    {
        path: "parentComment",
        select: "author content createdAt",
        populate: {
            path: "author",
            select: "username fullName avatar role",
        },
    },
];

const ensurePostExists = async (postId) => {
    const post = await Post.findById(postId);

    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    return post;
};

const ensureCommentExists = async (commentId) => {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        const error = new Error("Comment not found");
        error.statusCode = 404;
        throw error;
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        const error = new Error("Comment not found");
        error.statusCode = 404;
        throw error;
    }

    return comment;
};

export const getCommentsByPost = async (postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    await ensurePostExists(postId);

    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: 1 })
        .populate(commentPopulation);

    return comments.map(sanitizeComment);
};

export const createComment = async (authorId, payload) => {
    await ensurePostExists(payload.postId);

    let parentComment = null;

    if (payload.parentComment) {
        parentComment = await ensureCommentExists(payload.parentComment);

        if (parentComment.post.toString() !== payload.postId.toString()) {
            const error = new Error("Parent comment must belong to the same post");
            error.statusCode = 400;
            throw error;
        }
    }

    const createdComment = await Comment.create({
        post: payload.postId,
        author: authorId,
        parentComment: parentComment ? parentComment._id : null,
        content: payload.content,
    });

    await Post.findByIdAndUpdate(payload.postId, {
        $inc: { commentsCount: 1 },
    });

    const populatedComment = await Comment.findById(createdComment._id).populate(commentPopulation);

    return sanitizeComment(populatedComment || createdComment);
};

export const updateComment = async (commentId, authorId, content) => {
    const comment = await ensureCommentExists(commentId);

    if (comment.author.toString() !== authorId.toString()) {
        const error = new Error("You are not allowed to update this comment");
        error.statusCode = 403;
        throw error;
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content } },
        { new: true, runValidators: true }
    ).populate(commentPopulation);

    return sanitizeComment(updatedComment);
};

export const deleteComment = async (commentId, authorId) => {
    const comment = await ensureCommentExists(commentId);

    if (comment.author.toString() !== authorId.toString()) {
        const error = new Error("You are not allowed to delete this comment");
        error.statusCode = 403;
        throw error;
    }

    const deletedChildrenCount = await Comment.countDocuments({ parentComment: comment._id });

    await Comment.deleteMany({ parentComment: comment._id });
    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -(deletedChildrenCount + 1) },
    });

    return {
        id: comment._id,
    };
};