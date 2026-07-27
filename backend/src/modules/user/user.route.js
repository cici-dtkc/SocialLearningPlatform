import { Router } from "express";
import { getMe, updateAvatar, updateMe } from "./user.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { updateMeValidation } from "./user.validation.js";
import { uploadAvatar } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMeValidation, updateMe);

router.put("/avatar", requireAuth, (req, res, next) => {
    uploadAvatar.single("avatar")(req, res, (err) => {
        if (err) return next(err);
        next();
    });
}, updateAvatar);

export default router;