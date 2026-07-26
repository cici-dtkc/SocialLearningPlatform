import { body, param } from "express-validator";

export const createCommentValidation = [
    body("postId")
        .notEmpty().withMessage("Post ID is required")
        .isMongoId().withMessage("Post ID is invalid"),
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ max: 3000 }).withMessage("Content must be at most 3000 characters"),
    body("parentComment")
        .optional({ nullable: true })
        .isMongoId().withMessage("Parent comment is invalid"),
];

export const updateCommentValidation = [
    param("id")
        .isMongoId().withMessage("Comment ID is invalid"),
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ max: 3000 }).withMessage("Content must be at most 3000 characters"),
];

export const commentIdValidation = [
    param("id")
        .isMongoId().withMessage("Comment ID is invalid"),
];

export const postIdValidation = [
    param("postId")
        .isMongoId().withMessage("Post ID is invalid"),
];