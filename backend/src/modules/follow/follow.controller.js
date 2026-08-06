import {
    checkFollowStatus,
    followUser,
    getFollowCounts,
    getFollowers,
    getFollowing,
    unfollowUser,
} from "./follow.service.js";

export const follow = async (req, res) => {
    try {
        const result = await followUser(req.userId, req.params.id);
        return res.status(200).json({
            message: result.alreadyFollowed ? "Already following" : "Followed successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const unfollow = async (req, res) => {
    try {
        const result = await unfollowUser(req.userId, req.params.id);
        return res.status(200).json({
            message: result.alreadyUnfollowed ? "Already not following" : "Unfollowed successfully",
            data: result,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const followers = async (req, res) => {
    try {
        const data = await getFollowers(req.params.id);
        return res.status(200).json({ message: "Get followers successfully", data });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const following = async (req, res) => {
    try {
        const data = await getFollowing(req.params.id);
        return res.status(200).json({ message: "Get following successfully", data });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const followStatus = async (req, res) => {
    try {
        const data = await checkFollowStatus(req.userId, req.params.id);
        return res.status(200).json({ message: "Check follow status successfully", data });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const followCounts = async (req, res) => {
    try {
        const data = await getFollowCounts(req.params.id);
        return res.status(200).json({ message: "Get follow counts successfully", data });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message });
    }
};
