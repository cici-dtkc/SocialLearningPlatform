import { body } from "express-validator";

export const registerValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_.-]+$/).withMessage("Username can only contain letters, numbers, dots, underscores, and hyphens"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("fullName")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Full name must be at most 100 characters"),
];

export const loginValidation = [
    body("identifier")
        .trim()
        .notEmpty().withMessage("Email or username is required"),
    body("password")
        .notEmpty().withMessage("Password is required"),
];