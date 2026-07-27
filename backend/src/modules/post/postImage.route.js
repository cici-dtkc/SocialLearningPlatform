import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { uploadPostImages as uploadPostImagesMiddleware } from "../../middlewares/upload.middleware.js";
import { uploadPostImages } from "./postImage.controller.js";

const router = Router();

router.post("/posts/images", requireAuth, (req, res, next) => {
    uploadPostImagesMiddleware.array("images", 10)(req, res, (err) => {
        if (err) return next(err);
        next();
    });
}, uploadPostImages);

export default router;