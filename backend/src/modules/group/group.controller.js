import { validationResult } from "express-validator";
import { uploadBufferAsImage } from "../../config/cloudinary.js";
import {
    changeMemberRole,
    createGroup,
    deleteGroup,
    getGroupById,
    getGroups,
    getMembers,
    getMyGroups,
    joinGroup,
    leaveGroup,
    removeMember,
    updateGroup,
} from "./group.service.js";

const validate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Validation failed", errors: errors.array() });
        return false;
    }
    return true;
};

 // CRUD 
export const create = async (req, res) => {
    if (!validate(req, res)) return;
    try {
        const group = await createGroup(req.userId, req.body);
        return res.status(201).json({ message: "Group created successfully", data: group });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const list = async (req, res) => {
    try {
        const result = await getGroups(req.query);
        return res.status(200).json({ message: "Get groups successfully", ...result });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const detail = async (req, res) => {
    try {
        const group = await getGroupById(req.params.id, req.userId ?? null);
        return res.status(200).json({ message: "Get group successfully", data: group });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const update = async (req, res) => {
    if (!validate(req, res)) return;
    try {
        const group = await updateGroup(req.params.id, req.userId, req.body);
        return res.status(200).json({ message: "Group updated successfully", data: group });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const remove = async (req, res) => {
    try {
        const result = await deleteGroup(req.params.id, req.userId);
        return res.status(200).json({ message: "Group deleted successfully", data: result });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

 // Image uploads  
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Image file is required" });
        const result = await uploadBufferAsImage(req.file, "social-learning-platform/groups/avatars");
        // Persist to group doc
        const group = await updateGroup(req.params.id, req.userId, { avatar: result.secure_url });
        return res.status(200).json({ message: "Avatar uploaded successfully", data: group });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const uploadCover = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Image file is required" });
        const result = await uploadBufferAsImage(req.file, "social-learning-platform/groups/covers");
        const group = await updateGroup(req.params.id, req.userId, { cover: result.secure_url });
        return res.status(200).json({ message: "Cover uploaded successfully", data: group });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

 // Memberships
export const join = async (req, res) => {
    try {
        const result = await joinGroup(req.params.id, req.userId);
        return res.status(200).json({
            message: result.alreadyMember ? "Already a member" : "Joined group successfully",
            data: result,
        });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const leave = async (req, res) => {
    try {
        const result = await leaveGroup(req.params.id, req.userId);
        return res.status(200).json({ message: "Left group successfully", data: result });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const members = async (req, res) => {
    try {
        const result = await getMembers(req.params.id, req.query);
        return res.status(200).json({ message: "Get members successfully", ...result });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const myGroups = async (req, res) => {
    try {
        const groups = await getMyGroups(req.userId);
        return res.status(200).json({ message: "Get my groups successfully", data: groups });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const changeRole = async (req, res) => {
    if (!validate(req, res)) return;
    try {
        const result = await changeMemberRole(req.params.groupId, req.userId, req.params.userId, req.body.role);
        return res.status(200).json({ message: "Role updated successfully", data: result });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};

export const kickMember = async (req, res) => {
    try {
        const result = await removeMember(req.params.groupId, req.userId, req.params.userId);
        return res.status(200).json({ message: "Member removed successfully", data: result });
    } catch (e) {
        return res.status(e.statusCode || 500).json({ message: e.message });
    }
};
