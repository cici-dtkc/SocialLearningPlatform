import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractErrorMessage } from "../../services/http.js";
import {
    followUserRequest,
    getFollowCountsRequest,
    getFollowersRequest,
    getFollowingRequest,
    getFollowStatusRequest,
    unfollowUserRequest,
} from "./services/followService.js";

//  Thunks  

export const toggleFollow = createAsyncThunk(
    "user/toggleFollow",
    async ({ targetId, isFollowing }, { rejectWithValue }) => {
        try {
            if (isFollowing) {
                await unfollowUserRequest(targetId);
            } else {
                await followUserRequest(targetId);
            }
            return { targetId, isFollowing: !isFollowing };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const fetchFollowStatus = createAsyncThunk(
    "user/fetchFollowStatus",
    async (targetId, { rejectWithValue }) => {
        try {
            const res = await getFollowStatusRequest(targetId);
            return { targetId, isFollowing: res.data.isFollowing };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const fetchFollowCounts = createAsyncThunk(
    "user/fetchFollowCounts",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await getFollowCountsRequest(userId);
            return { userId, ...res.data };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const fetchFollowers = createAsyncThunk(
    "user/fetchFollowers",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await getFollowersRequest(userId);
            return { userId, list: res.data };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const fetchFollowing = createAsyncThunk(
    "user/fetchFollowing",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await getFollowingRequest(userId);
            return { userId, list: res.data };
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

//   Slice  

const userSlice = createSlice({
    name: "user",
    initialState: {
        followStatus: {},
        counts: {},
        followers: {},
        following: {},
        status: "idle",
        error: null,
    },
    reducers: {
        clearUserError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleFollow.pending, (state, action) => {
                const { targetId, isFollowing } = action.meta.arg;
                state.followStatus[targetId] = !isFollowing;
                if (state.counts[targetId]) {
                    state.counts[targetId].followersCount += isFollowing ? -1 : 1;
                }
            })
            .addCase(toggleFollow.rejected, (state, action) => {
                // revert
                const { targetId, isFollowing } = action.meta.arg;
                state.followStatus[targetId] = isFollowing;
                if (state.counts[targetId]) {
                    state.counts[targetId].followersCount += isFollowing ? 1 : -1;
                }
            })
            .addCase(toggleFollow.fulfilled, (state, action) => {
                const { targetId, isFollowing } = action.payload;
                state.followStatus[targetId] = isFollowing;
            })
            // fetch status
            .addCase(fetchFollowStatus.fulfilled, (state, action) => {
                const { targetId, isFollowing } = action.payload;
                state.followStatus[targetId] = isFollowing;
            })
            // fetch counts
            .addCase(fetchFollowCounts.fulfilled, (state, action) => {
                const { userId, followersCount, followingCount } = action.payload;
                state.counts[userId] = { followersCount, followingCount };
            })
            // fetch followers list
            .addCase(fetchFollowers.fulfilled, (state, action) => {
                const { userId, list } = action.payload;
                state.followers[userId] = list;
            })
            // fetch following list
            .addCase(fetchFollowing.fulfilled, (state, action) => {
                const { userId, list } = action.payload;
                state.following[userId] = list;
            });
    },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
