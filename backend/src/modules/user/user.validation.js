import { body } from "express-validator";

export const updateMeValidation = [
    body("username")
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_.-]+$/).withMessage("Username can only contain letters, numbers, dots, underscores, and hyphens"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Email is invalid")
        .normalizeEmail(),
    body("fullName")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Full name must be at most 100 characters"),
];