import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { uploadPostImages as uploadPostImagesMiddleware } from "../../middlewares/upload.middleware.js";
import { uploadPostImages } from "./postImage.controller.js";

const router = Router();

router.post("/posts/images", requireAuth, uploadPostImagesMiddleware.array("images", 10), uploadPostImages);

export default router;