import { Router } from "express";
import { getMe, getUserById, getUsers, updateAvatar, updateMe } from "./user.controller.js";
import { myGroups } from "../group/group.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { updateMeValidation } from "./user.validation.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/me",        requireAuth, getMe);
router.get("/me/groups", requireAuth, myGroups);
router.get("/",          getUsers);
router.get("/:id",       getUserById);
router.put("/me",        requireAuth, updateMeValidation, updateMe);
router.put("/avatar",    requireAuth, (req, res, next) => {
    uploadAvatarMiddleware.single("avatar")(req, res, (err) => {
        if (err) return next(err);
        next();
    });
}, updateAvatar);

export default router;
