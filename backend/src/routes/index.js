import { Router } from "express";
import authRoutes from "../modules/auth/auth.route.js";
import commentRoutes from "../modules/comment/comment.route.js";
import commentLikeRoutes from "../modules/commentLikes/commentLike.route.js";
import postLikeRoutes from "../modules/postLikes/postLike.route.js";
import postImageRoutes from "../modules/post/postImage.route.js";
import userRoutes from "../modules/user/user.route.js";
import postRoutes from "../modules/post/post.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/", postImageRoutes);
router.use("/", commentRoutes);
router.use("/", commentLikeRoutes);
router.use("/", postLikeRoutes);

export default router;
