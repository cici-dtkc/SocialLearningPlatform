import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import multer from "multer";
import {
    changeRole,
    create,
    detail,
    join,
    kickMember,
    leave,
    list,
    members,
    myGroups,
    remove,
    update,
    uploadAvatar,
    uploadCover,
} from "./group.controller.js";
import {
    changeRoleValidation,
    createGroupValidation,
    updateGroupValidation,
} from "./group.validation.js";

const router = Router();

 
const imageUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed"), false);
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

const wrapMulter = (field) => (req, res, next) => {
    imageUpload.single(field)(req, res, (err) => {
        if (err) return next(err);
        next();
    });
};

// Group CRUD  
router.get("/",           list);
router.post("/",          requireAuth, createGroupValidation, create);
router.get("/:id",        detail);
router.put("/:id",        requireAuth, updateGroupValidation, update);
router.delete("/:id",     requireAuth, remove);

// Image uploads 
router.put("/:id/avatar", requireAuth, wrapMulter("avatar"), uploadAvatar);
router.put("/:id/cover",  requireAuth, wrapMulter("cover"),  uploadCover);

// Membership  
router.post("/:id/join",   requireAuth, join);
router.delete("/:id/leave", requireAuth, leave);
router.get("/:id/members",  members);

// Member management 
router.put("/:groupId/members/:userId/role",  requireAuth, changeRoleValidation, changeRole);
router.delete("/:groupId/members/:userId",    requireAuth, kickMember);

export default router;
