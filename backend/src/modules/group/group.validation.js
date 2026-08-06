import { body, param } from "express-validator";
import { GROUP_ROLES } from "./groupMember.model.js";

export const createGroupValidation = [
    body("name")
        .trim().notEmpty().withMessage("Group name is required")
        .isLength({ max: 100 }).withMessage("Group name must be at most 100 characters"),
    body("description")
        .optional().trim()
        .isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters"),
    body("visibility")
        .optional()
        .isIn(["public", "private"]).withMessage("Visibility must be public or private"),
    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array"),
];

export const updateGroupValidation = [
    body("name")
        .optional().trim()
        .isLength({ min: 1, max: 100 }).withMessage("Group name must be between 1 and 100 characters"),
    body("description")
        .optional().trim()
        .isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters"),
    body("visibility")
        .optional()
        .isIn(["public", "private"]).withMessage("Visibility must be public or private"),
    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array"),
];

export const changeRoleValidation = [
    param("groupId").isMongoId().withMessage("Invalid group ID"),
    param("userId").isMongoId().withMessage("Invalid user ID"),
    body("role")
        .notEmpty().withMessage("Role is required")
        .isIn(GROUP_ROLES.filter((r) => r !== "owner"))
        .withMessage(`Role must be one of: ${GROUP_ROLES.filter((r) => r !== "owner").join(", ")}`),
];
