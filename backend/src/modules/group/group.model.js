import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        cover: {
            type: String,
            default: "",
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        membersCount: {
            type: Number,
            default: 1, // owner counts as first member
        },
        postsCount: {
            type: Number,
            default: 0,
        },
        tags: [{ type: String, trim: true }],
    },
    { timestamps: true }
);

groupSchema.index({ name: "text", description: "text" });
groupSchema.index({ visibility: 1, createdAt: -1 });

export default mongoose.model("Group", groupSchema);
