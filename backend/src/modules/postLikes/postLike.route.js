import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { likePost, unlikePost } from "./postLike.controller.js";

const router = Router();

router.post("/posts/:id/like", requireAuth, likePost);
router.delete("/posts/:id/like", requireAuth, unlikePost);

export default router;