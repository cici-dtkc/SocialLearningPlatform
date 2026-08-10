import mongoose from "mongoose";
import User from "./user.model.js";
import cloudinary from "../../config/cloudinary.js";

const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const getUsers = async ({ page = 1, limit = 10, search } = {}) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const skip = (currentPage - 1) * pageSize;

    const filter = {};
    const searchTerm = String(search || "").trim();
    if (searchTerm) {
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = [{ username: regex }, { fullName: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).select("username fullName avatar role createdAt"),
        User.countDocuments(filter),
    ]);

    return {
        data: users.map(sanitizeUser),
        meta: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
};

export const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return sanitizeUser(user);
};

export const getUserById = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return sanitizeUser(user);
};

export const updateMe = async (userId, payload) => {
    const allowedFields = ["username", "email", "fullName"];
    const updateData = {};

    for (const field of allowedFields) {
        if (payload[field] !== undefined) {
            updateData[field] = payload[field];
        }
    }

    if (Object.keys(updateData).length === 0) {
        const error = new Error("No valid fields to update");
        error.statusCode = 400;
        throw error;
    }

    const uniqueQueryParts = [];

    if (updateData.username) {
        uniqueQueryParts.push({ username: updateData.username });
    }

    if (updateData.email) {
        uniqueQueryParts.push({ email: updateData.email });
    }

    if (uniqueQueryParts.length > 0) {
        const duplicateUser = await User.findOne({
            _id: { $ne: userId },
            $or: uniqueQueryParts,
        });

        if (duplicateUser) {
            const error = new Error("Username or email already exists");
            error.statusCode = 409;
            throw error;
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return sanitizeUser(updatedUser);
};

export const updateAvatar = async (userId, file) => {
    if (!file) {
        const error = new Error("Avatar file is required");
        error.statusCode = 400;
        throw error;
    }

    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
        folder: "social-learning-platform/avatars",
    });

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { avatar: uploadResult.secure_url } },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return sanitizeUser(updatedUser);
};