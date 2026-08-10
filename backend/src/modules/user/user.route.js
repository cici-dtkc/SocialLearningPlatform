import { Router } from "express";
import { getMe, getUserById, getUsers, updateAvatar, updateMe } from "./user.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { updateMeValidation } from "./user.validation.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../../middlewares/upload.middleware.js";
import { getMyGroups } from "../group/group.service.js";

const router = Router();

// Static routes first
router.get("/me", requireAuth, getMe);

router.get("/me/groups", requireAuth, async (req, res) => {
    try {
        const groups = await getMyGroups(req.userId);
        return res.status(200).json({ message: "Get my groups successfully", data: groups });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
});
router.put("/me", requireAuth, updateMeValidation, updateMe);

router.put("/avatar", requireAuth, (req, res, next) => {
    uploadAvatarMiddleware.single("avatar")(req, res, (err) => {
        if (err) return next(err);
        next();
    });
}, updateAvatar);
router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;
