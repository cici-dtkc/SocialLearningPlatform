import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
    createComment,
    deleteComment,
    getCommentsByPost,
    updateComment,
} from "./comment.controller.js";
import {
    commentIdValidation,
    createCommentValidation,
    postIdValidation,
    updateCommentValidation,
} from "./comment.validation.js";

const router = Router();

router.get("/posts/:postId/comments", postIdValidation, getCommentsByPost);
router.post("/comments", requireAuth, createCommentValidation, createComment);
router.put("/comments/:id", requireAuth, updateCommentValidation, updateComment);
router.delete("/comments/:id", requireAuth, commentIdValidation, deleteComment);

export default router;