import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        fullName: {
            type: String,
            trim: true,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["student", "mentor", "admin"],
            default: "student",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;