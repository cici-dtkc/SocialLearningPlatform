import { validationResult } from "express-validator";
import { login as loginUser, register as registerUser } from "./auth.service.js";

const buildAuthCookieOptions = () => ({
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const register = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            message: "Register successfully",
            data: user,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const login = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationErrors.array(),
        });
    }

    try {
        const result = await loginUser(req.body);

        res.cookie("accessToken", result.accessToken, buildAuthCookieOptions());

        return res.status(200).json({
            message: "Login successfully",
            data: result.user,
            accessToken: result.accessToken,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("accessToken", buildAuthCookieOptions());

    return res.status(200).json({
        message: "Logout successfully",
    });
};