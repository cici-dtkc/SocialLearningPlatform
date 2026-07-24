import bcrypt from "bcrypt";
import User from "../user/user.model.js";
import { signAccessToken } from "../../config/jwt.js";

const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const register = async ({ username, email, password, fullName }) => {
    const existingUser = await User.findOne({
        $or: [
            { username },
            { email },
        ],
    });

    if (existingUser) {
        const error = new Error("Username or email already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName,
    });

    return sanitizeUser(createdUser);
};

export const login = async ({ identifier, password }) => {
    const user = await User.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier },
        ],
    }).select("+password");

    if (!user) {
        const error = new Error("Invalid email/username or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const error = new Error("Invalid email/username or password");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = signAccessToken({ userId: user._id });

    return {
        accessToken,
        user: sanitizeUser(user),
    };
};