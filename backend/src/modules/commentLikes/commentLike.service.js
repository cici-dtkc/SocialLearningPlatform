import mongoose from "mongoose";
import Comment from "../comment/comment.model.js";
import CommentLike from "./commentLike.model.js";

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

export const likeComment = async (commentId, userId) => {
    await ensureCommentExists(commentId);

    const existing = await CommentLike.findOne({ comment: commentId, user: userId });
    if (existing) {
        return { liked: true, alreadyLiked: true };
    }

    await CommentLike.create({ comment: commentId, user: userId });
    await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });

    return { liked: true, alreadyLiked: false };
};

export const unlikeComment = async (commentId, userId) => {
    await ensureCommentExists(commentId);

    const deleted = await CommentLike.findOneAndDelete({ comment: commentId, user: userId });
    if (!deleted) {
        return { liked: false, alreadyUnliked: true };
    }

    await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });

    return { liked: false, alreadyUnliked: false };
};
