import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
    createPost,
    deletePost,
    getPostById,
    getPosts,
    updatePost,
} from "./post.controller.js";
import { createPostValidation, updatePostValidation } from "./post.validation.js";
import { getPostLikes } from "../postLikes/postLike.controller.js";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.get("/:id/likes", getPostLikes);
router.post("/", requireAuth, createPostValidation, createPost);
router.put("/:id", requireAuth, updatePostValidation, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;