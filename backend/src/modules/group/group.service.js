import mongoose from "mongoose";
import Group from "./group.model.js";
import GroupMember, { GROUP_ROLES } from "./groupMember.model.js";
import User from "../user/user.model.js";

 
const sanitizeGroup = (g, myRole = null) => ({
    id: g._id,
    name: g.name,
    description: g.description,
    avatar: g.avatar,
    cover: g.cover,
    visibility: g.visibility,
    owner: g.owner,
    membersCount: g.membersCount,
    postsCount: g.postsCount,
    tags: g.tags,
    myRole,          // null if not a member
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
});

const ownerPopulation = { path: "owner", select: "username fullName avatar" };

const ensureGroup = async (groupId) => {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        const e = new Error("Group not found"); e.statusCode = 404; throw e;
    }
    const group = await Group.findById(groupId);
    if (!group) { const e = new Error("Group not found"); e.statusCode = 404; throw e; }
    return group;
};

const requireRole = (currentRole, allowedRoles) => {
    if (!currentRole || !allowedRoles.includes(currentRole)) {
        const e = new Error("You do not have permission to perform this action");
        e.statusCode = 403; throw e;
    }
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getMembership = (groupId, userId) =>
    GroupMember.findOne({ group: groupId, user: userId });

 // CRUD  
export const createGroup = async (ownerId, payload) => {
    const group = await Group.create({
        name: payload.name,
        description: payload.description ?? "",
        visibility: payload.visibility ?? "public",
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        owner: ownerId,
    });

    // Owner automatically becomes member with role "owner"
    await GroupMember.create({ group: group._id, user: ownerId, role: "owner" });

    const populated = await Group.findById(group._id).populate(ownerPopulation);
    return sanitizeGroup(populated, "owner");
};

export const getGroups = async ({ page = 1, limit = 12, search, visibility } = {}) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const skip = (currentPage - 1) * pageSize;

    const filter = {};
    if (visibility) filter.visibility = visibility;
    else filter.visibility = "public"; // default to public only

    const searchTerm = String(search || "").trim();
    if (searchTerm) {
        const regex = new RegExp(escapeRegExp(searchTerm), "i");
        filter.$or = [
            { name: regex },
            { description: regex },
            { tags: { $elemMatch: { $regex: regex, $options: "i" } } },
        ];
    }

    const [groups, total] = await Promise.all([
        Group.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate(ownerPopulation),
        Group.countDocuments(filter),
    ]);

    return {
        data: groups.map((g) => sanitizeGroup(g)),
        meta: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
};

export const getGroupById = async (groupId, requesterId = null) => {
    const group = await Group.findById(groupId).populate(ownerPopulation);
    if (!group) { const e = new Error("Group not found"); e.statusCode = 404; throw e; }

    let myRole = null;
    if (requesterId) {
        const membership = await getMembership(groupId, requesterId);
        if (membership && !membership.banned) myRole = membership.role;
    }

    // Private group — only members can see full details
    if (group.visibility === "private" && !myRole) {
        return {
            id: group._id,
            name: group.name,
            description: "This group is private.",
            avatar: group.avatar,
            cover: group.cover,
            visibility: group.visibility,
            membersCount: group.membersCount,
            myRole: null,
        };
    }

    return sanitizeGroup(group, myRole);
};

export const updateGroup = async (groupId, requesterId, payload) => {
    const group = await ensureGroup(groupId);
    const membership = await getMembership(groupId, requesterId);
    requireRole(membership?.role, ["owner", "admin"]);

    const allowed = ["name", "description", "visibility", "tags", "avatar", "cover"];
    const updateData = {};
    for (const field of allowed) {
        if (payload[field] !== undefined) updateData[field] = payload[field];
    }

    if (Object.keys(updateData).length === 0) {
        const e = new Error("No valid fields to update"); e.statusCode = 400; throw e;
    }

    const updated = await Group.findByIdAndUpdate(
        groupId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate(ownerPopulation);

    return sanitizeGroup(updated, membership.role);
};

export const deleteGroup = async (groupId, requesterId) => {
    const group = await ensureGroup(groupId);
    const membership = await getMembership(groupId, requesterId);
    requireRole(membership?.role, ["owner"]);

    await GroupMember.deleteMany({ group: groupId });
    await Group.findByIdAndDelete(groupId);

    return { id: group._id };
};

 // Membership 
export const joinGroup = async (groupId, userId) => {
    const group = await ensureGroup(groupId);

    if (group.visibility === "private") {
        const e = new Error("Cannot join a private group directly"); e.statusCode = 403; throw e;
    }

    const existing = await getMembership(groupId, userId);
    if (existing) {
        if (existing.banned) { const e = new Error("You are banned from this group"); e.statusCode = 403; throw e; }
        return { alreadyMember: true, role: existing.role };
    }

    await GroupMember.create({ group: groupId, user: userId, role: "member" });
    await Group.findByIdAndUpdate(groupId, { $inc: { membersCount: 1 } });

    return { alreadyMember: false, role: "member" };
};

export const leaveGroup = async (groupId, userId) => {
    const group = await ensureGroup(groupId);

    const membership = await getMembership(groupId, userId);
    if (!membership) { const e = new Error("You are not a member of this group"); e.statusCode = 400; throw e; }

    if (String(group.owner) === String(userId)) {
        const e = new Error("Owner cannot leave the group. Transfer ownership first."); e.statusCode = 400; throw e;
    }

    await GroupMember.findByIdAndDelete(membership._id);
    await Group.findByIdAndUpdate(groupId, { $inc: { membersCount: -1 } });

    return { left: true };
};

export const searchUsersForGroup = async (groupId, requesterId, { query = "", limit = 10 } = {}) => {
    await ensureGroup(groupId);

    const requesterMembership = await getMembership(groupId, requesterId);
    requireRole(requesterMembership?.role, ["owner", "admin", "moderator"]);

    const searchTerm = String(query || "").trim();
    if (!searchTerm) {
        return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
    }

    const existingMembers = await GroupMember.find({ group: groupId, banned: false }).select("user");
    const excludedUserIds = existingMembers.map((member) => member.user);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 20);
    const regex = new RegExp(escapeRegExp(searchTerm), "i");

    const [users, total] = await Promise.all([
        User.find({
            _id: { $nin: excludedUserIds },
            $or: [{ username: regex }, { fullName: regex }, { email: regex }],
        })
            .select("username fullName avatar role")
            .limit(pageSize)
            .lean(),
        User.countDocuments({
            _id: { $nin: excludedUserIds },
            $or: [{ username: regex }, { fullName: regex }, { email: regex }],
        }),
    ]);

    return {
        data: users.map((user) => ({
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            role: user.role,
        })),
        meta: { page: 1, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
};

export const addMemberToGroup = async (groupId, requesterId, targetUserId) => {
    await ensureGroup(groupId);

    const requesterMembership = await getMembership(groupId, requesterId);
    requireRole(requesterMembership?.role, ["owner", "admin", "moderator"]);

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        const e = new Error("User not found"); e.statusCode = 404; throw e;
    }

    const existingMembership = await getMembership(groupId, targetUserId);
    if (existingMembership) {
        if (existingMembership.banned) {
            const e = new Error("User is banned from this group"); e.statusCode = 403; throw e;
        }
        return { alreadyMember: true, role: existingMembership.role, userId: targetUserId };
    }

    await GroupMember.create({ group: groupId, user: targetUserId, role: "member" });
    await Group.findByIdAndUpdate(groupId, { $inc: { membersCount: 1 } });

    return { added: true, userId: targetUserId, role: "member" };
};

export const getMembers = async (groupId, { page = 1, limit = 20 } = {}) => {
    await ensureGroup(groupId);

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [members, total] = await Promise.all([
        GroupMember.find({ group: groupId, banned: false })
            .sort({ role: 1, createdAt: 1 })
            .skip(skip)
            .limit(pageSize)
            .populate({ path: "user", select: "username fullName avatar role" }),
        GroupMember.countDocuments({ group: groupId, banned: false }),
    ]);

    return {
        data: members.map((m) => ({
            userId: m.user._id,
            username: m.user.username,
            fullName: m.user.fullName,
            avatar: m.user.avatar,
            role: m.role,
            joinedAt: m.createdAt,
        })),
        meta: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    };
};

export const getMyGroups = async (userId) => {
    const memberships = await GroupMember.find({ user: userId, banned: false })
        .populate({ path: "group", populate: ownerPopulation });

    return memberships
        .filter((m) => m.group)
        .map((m) => sanitizeGroup(m.group, m.role));
};

export const changeMemberRole = async (groupId, requesterId, targetUserId, newRole) => {
    if (!GROUP_ROLES.includes(newRole) || newRole === "owner") {
        const e = new Error("Invalid role"); e.statusCode = 400; throw e;
    }

    const requesterMembership = await getMembership(groupId, requesterId);
    requireRole(requesterMembership?.role, ["owner", "admin"]);

    const targetMembership = await getMembership(groupId, targetUserId);
    if (!targetMembership) { const e = new Error("User is not a member of this group"); e.statusCode = 404; throw e; }

    if (targetMembership.role === "owner") {
        const e = new Error("Cannot change owner role"); e.statusCode = 403; throw e;
    }

    // Admin can only change member/moderator, not other admins
    if (requesterMembership.role === "admin" && targetMembership.role === "admin") {
        const e = new Error("Admins cannot change other admins' roles"); e.statusCode = 403; throw e;
    }

    targetMembership.role = newRole;
    await targetMembership.save();

    return { userId: targetUserId, role: newRole };
};

export const removeMember = async (groupId, requesterId, targetUserId) => {
    const requesterMembership = await getMembership(groupId, requesterId);
    requireRole(requesterMembership?.role, ["owner", "admin", "moderator"]);

    const targetMembership = await getMembership(groupId, targetUserId);
    if (!targetMembership) { const e = new Error("User is not a member of this group"); e.statusCode = 404; throw e; }

    if (targetMembership.role === "owner") {
        const e = new Error("Cannot remove the group owner"); e.statusCode = 403; throw e;
    }

    await GroupMember.findByIdAndDelete(targetMembership._id);
    await Group.findByIdAndUpdate(groupId, { $inc: { membersCount: -1 } });

    return { removed: true, userId: targetUserId };
};
