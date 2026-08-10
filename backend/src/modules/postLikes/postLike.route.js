import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getPostLikes, likePost, unlikePost } from "./postLike.controller.js";

const router = Router();

router.get("/posts/:id/likes", getPostLikes);
router.post("/posts/:id/like", requireAuth, likePost);
router.delete("/posts/:id/like", requireAuth, unlikePost);

export default router;