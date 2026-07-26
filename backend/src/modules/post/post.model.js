import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      }
    ],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    images: [
      {
        type: String,
      }
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);