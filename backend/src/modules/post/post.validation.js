import { body } from "express-validator";

const visibilityValues = ["public", "private"];

export const createPostValidation = [
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ max: 5000 }).withMessage("Content must be at most 5000 characters"),
    body("images")
        .optional()
        .isArray().withMessage("Images must be an array"),
    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array"),
    body("visibility")
        .optional()
        .isIn(visibilityValues).withMessage("Visibility must be public or private"),
];

export const updatePostValidation = [
    body("content")
        .optional()
        .trim()
        .isLength({ min: 1, max: 5000 }).withMessage("Content must be between 1 and 5000 characters"),
    body("images")
        .optional()
        .isArray().withMessage("Images must be an array"),
    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array"),
    body("visibility")
        .optional()
        .isIn(visibilityValues).withMessage("Visibility must be public or private"),
];