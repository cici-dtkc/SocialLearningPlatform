import mongoose from "mongoose";
import Follow from "./follow.model.js";
import User from "../user/user.model.js";

const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    fullName: user.fullName,
    avatar: user.avatar,
    role: user.role,
});

const ensureUserExists = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

// Follow  
export const followUser = async (followerId, followingId) => {
    if (String(followerId) === String(followingId)) {
        const error = new Error("You cannot follow yourself");
        error.statusCode = 400;
        throw error;
    }

    await ensureUserExists(followingId);

    const existing = await Follow.findOne({ follower: followerId, following: followingId });
    if (existing) {
        return { followed: true, alreadyFollowed: true };
    }

    await Follow.create({ follower: followerId, following: followingId });
    return { followed: true, alreadyFollowed: false };
};

 // Unfollow  
export const unfollowUser = async (followerId, followingId) => {
    await ensureUserExists(followingId);

    const deleted = await Follow.findOneAndDelete({ follower: followerId, following: followingId });
    if (!deleted) {
        return { followed: false, alreadyUnfollowed: true };
    }
    return { followed: false, alreadyUnfollowed: false };
};

 //Get followers of a user  
export const getFollowers = async (userId) => {
    await ensureUserExists(userId);

    const follows = await Follow.find({ following: userId })
        .populate("follower", "username fullName avatar role")
        .sort({ createdAt: -1 });

    return follows.map((f) => sanitizeUser(f.follower));
};

// Get users that userId follows 
export const getFollowing = async (userId) => {
    await ensureUserExists(userId);

    const follows = await Follow.find({ follower: userId })
        .populate("following", "username fullName avatar role")
        .sort({ createdAt: -1 });

    return follows.map((f) => sanitizeUser(f.following));
};

// Check follow status between two users 
export const checkFollowStatus = async (followerId, followingId) => {
    const exists = await Follow.exists({ follower: followerId, following: followingId });
    return { isFollowing: !!exists };
};

 // Get follower/following counts  
export const getFollowCounts = async (userId) => {
    await ensureUserExists(userId);

    const [followersCount, followingCount] = await Promise.all([
        Follow.countDocuments({ following: userId }),
        Follow.countDocuments({ follower: userId }),
    ]);

    return { followersCount, followingCount };
};
