import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { likeComment, unlikeComment } from "./commentLike.controller.js";

const router = Router();

router.post("/comments/:id/like", requireAuth, likeComment);
router.delete("/comments/:id/like", requireAuth, unlikeComment);

export default router;
