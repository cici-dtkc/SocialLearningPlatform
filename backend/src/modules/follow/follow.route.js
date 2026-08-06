import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
    follow,
    followCounts,
    followers,
    following,
    followStatus,
    unfollow,
} from "./follow.controller.js";

const router = Router();

// Follow / Unfollow
router.post("/users/:id/follow", requireAuth, follow);
router.delete("/users/:id/follow", requireAuth, unfollow);

// Check if current user follows :id
router.get("/users/:id/follow/status", requireAuth, followStatus);

// Get followers / following lists
router.get("/users/:id/followers", followers);
router.get("/users/:id/following", following);

// Get counts
router.get("/users/:id/follow/counts", followCounts);

export default router;
