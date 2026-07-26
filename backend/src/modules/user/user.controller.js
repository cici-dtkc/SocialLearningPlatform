import { validationResult } from "express-validator";
import { getMe as getMeService, updateAvatar as updateAvatarService, updateMe as updateMeService } from "./user.service.js";

export const getMe = async (req, res) => {
    try {
        const user = await getMeService(req.userId);

        return res.status(200).json({
            message: "Get current user successfully",
            data: user,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const updateMe = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const user = await updateMeService(req.userId, req.body);

        return res.status(200).json({
            message: "Update current user successfully",
            data: user,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const user = await updateAvatarService(req.userId, req.file);

        return res.status(200).json({
            message: "Update avatar successfully",
            data: user,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};