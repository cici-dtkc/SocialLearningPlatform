import { validationResult } from "express-validator";
import {
    createPost as createPostService,
    deletePost as deletePostService,
    getPostById as getPostByIdService,
    getPosts as getPostsService,
    updatePost as updatePostService,
} from "./post.service.js";

export const getPosts = async (req, res) => {
    try {
        const result = await getPostsService(req.query);

        return res.status(200).json({
            message: "Get posts successfully",
            ...result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await getPostByIdService(req.params.id);

        return res.status(200).json({
            message: "Get post successfully",
            data: post,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const createPost = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const post = await createPostService(req.userId, req.body);

        return res.status(201).json({
            message: "Create post successfully",
            data: post,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const updatePost = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const post = await updatePostService(req.params.id, req.userId, req.body);

        return res.status(200).json({
            message: "Update post successfully",
            data: post,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const result = await deletePostService(req.params.id, req.userId);

        return res.status(200).json({
            message: "Delete post successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};