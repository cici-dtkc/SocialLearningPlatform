import { getPostLikes as getPostLikesService, likePost as likePostService, unlikePost as unlikePostService } from "./postLike.service.js";

export const getPostLikes = async (req, res) => {
    try {
        const result = await getPostLikesService(req.params.id);

        return res.status(200).json({
            message: "Get post likes successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const likePost = async (req, res) => {
    try {
        const result = await likePostService(req.params.id, req.userId);

        return res.status(200).json({
            message: result.alreadyLiked ? "Post already liked" : "Like post successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const unlikePost = async (req, res) => {
    try {
        const result = await unlikePostService(req.params.id, req.userId);

        return res.status(200).json({
            message: result.alreadyUnliked ? "Post already unliked" : "Unlike post successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};