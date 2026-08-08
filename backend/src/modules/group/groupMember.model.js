import mongoose from "mongoose";

export const GROUP_ROLES = ["owner", "admin", "moderator", "member"];

const groupMemberSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: GROUP_ROLES,
            default: "member",
        },
        banned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// A user can only have one membership record per group
groupMemberSchema.index({ group: 1, user: 1 }, { unique: true });
groupMemberSchema.index({ user: 1, group: 1 });

export default mongoose.model("GroupMember", groupMemberSchema);
