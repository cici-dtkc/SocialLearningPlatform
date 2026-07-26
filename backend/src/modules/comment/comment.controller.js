import { validationResult } from "express-validator";
import {
    createComment as createCommentService,
    deleteComment as deleteCommentService,
    getCommentsByPost as getCommentsByPostService,
    updateComment as updateCommentService,
} from "./comment.service.js";

export const getCommentsByPost = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const comments = await getCommentsByPostService(req.params.postId);

        return res.status(200).json({
            message: "Get comments successfully",
            data: comments,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const createComment = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const comment = await createCommentService(req.userId, req.body);

        return res.status(201).json({
            message: "Create comment successfully",
            data: comment,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const updateComment = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const comment = await updateCommentService(req.params.id, req.userId, req.body.content);

        return res.status(200).json({
            message: "Update comment successfully",
            data: comment,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const deleteComment = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const result = await deleteCommentService(req.params.id, req.userId);

        return res.status(200).json({
            message: "Delete comment successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};