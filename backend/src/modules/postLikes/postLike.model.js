import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

postLikeSchema.index({ user: 1, post: 1 }, { unique: true });

const PostLike = mongoose.model("PostLike", postLikeSchema);

export default PostLike;