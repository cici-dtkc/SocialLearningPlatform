import { likeComment as likeCommentService, unlikeComment as unlikeCommentService } from "./commentLike.service.js";

export const likeComment = async (req, res) => {
    try {
        const result = await likeCommentService(req.params.id, req.userId);
        return res.status(200).json({
            message: result.alreadyLiked ? "Comment already liked" : "Like comment successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const unlikeComment = async (req, res) => {
    try {
        const result = await unlikeCommentService(req.params.id, req.userId);
        return res.status(200).json({
            message: result.alreadyUnliked ? "Comment already unliked" : "Unlike comment successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};
