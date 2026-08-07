import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { extractErrorMessage } from "../../services/http.js";
import {
    changeMemberRoleRequest,
    createGroupRequest,
    deleteGroupRequest,
    getGroupByIdRequest,
    getGroupMembersRequest,
    getGroupsRequest,
    getMyGroupsRequest,
    joinGroupRequest,
    kickMemberRequest,
    leaveGroupRequest,
    updateGroupRequest,
    uploadGroupAvatarRequest,
    uploadGroupCoverRequest,
} from "./services/groupService.js";

// Thunks  
export const fetchGroups = createAsyncThunk("group/fetchGroups", async (params, { rejectWithValue }) => {
    try { return await getGroupsRequest(params); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const fetchGroupById = createAsyncThunk("group/fetchGroupById", async (id, { rejectWithValue }) => {
    try { return await getGroupByIdRequest(id); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const createGroup = createAsyncThunk("group/createGroup", async (payload, { rejectWithValue }) => {
    try { return await createGroupRequest(payload); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const updateGroup = createAsyncThunk("group/updateGroup", async ({ id, payload }, { rejectWithValue }) => {
    try { return await updateGroupRequest(id, payload); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const deleteGroup = createAsyncThunk("group/deleteGroup", async (id, { rejectWithValue }) => {
    try { await deleteGroupRequest(id); return id; }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const uploadGroupAvatar = createAsyncThunk("group/uploadAvatar", async ({ id, file }, { rejectWithValue }) => {
    try { return await uploadGroupAvatarRequest(id, file); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const uploadGroupCover = createAsyncThunk("group/uploadCover", async ({ id, file }, { rejectWithValue }) => {
    try { return await uploadGroupCoverRequest(id, file); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const joinGroup = createAsyncThunk("group/joinGroup", async (id, { rejectWithValue }) => {
    try { const res = await joinGroupRequest(id); return { id, ...res.data }; }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const leaveGroup = createAsyncThunk("group/leaveGroup", async (id, { rejectWithValue }) => {
    try { await leaveGroupRequest(id); return id; }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const fetchGroupMembers = createAsyncThunk("group/fetchMembers", async ({ id, params }, { rejectWithValue }) => {
    try { const res = await getGroupMembersRequest(id, params); return { id, ...res }; }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const fetchMyGroups = createAsyncThunk("group/fetchMyGroups", async (_, { rejectWithValue }) => {
    try { return await getMyGroupsRequest(); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const changeMemberRole = createAsyncThunk("group/changeMemberRole", async ({ groupId, userId, role }, { rejectWithValue }) => {
    try { return await changeMemberRoleRequest(groupId, userId, role); }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

export const kickMember = createAsyncThunk("group/kickMember", async ({ groupId, userId }, { rejectWithValue }) => {
    try { await kickMemberRequest(groupId, userId); return { groupId, userId }; }
    catch (e) { return rejectWithValue(extractErrorMessage(e)); }
});

// Slice  
const groupSlice = createSlice({
    name: "group",
    initialState: {
        groups: [],
        meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
        status: "idle",
        // current group detail
        current: null,
        currentStatus: "idle",
        // members of current group
        members: [],
        membersMeta: { page: 1, limit: 20, total: 0, totalPages: 1 },
        // my groups
        myGroups: [],
        myGroupsStatus: "idle",
        error: null,
    },
    reducers: {
        clearGroupError(state) { state.error = null; },
        clearCurrentGroup(state) { state.current = null; state.currentStatus = "idle"; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => { state.status = "loading"; })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.groups = action.payload.data;
                state.meta = action.payload.meta;
                state.status = "succeeded";
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.status = "failed"; state.error = action.payload;
            })
            .addCase(fetchGroupById.pending, (state) => { state.currentStatus = "loading"; })
            .addCase(fetchGroupById.fulfilled, (state, action) => {
                state.current = action.payload.data;
                state.currentStatus = "succeeded";
            })
            .addCase(fetchGroupById.rejected, (state, action) => {
                state.currentStatus = "failed"; state.error = action.payload;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.groups.unshift(action.payload.data);
                state.myGroups.unshift(action.payload.data);
                state.meta.total += 1;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                const updated = action.payload.data;
                const idx = state.groups.findIndex((g) => g.id === updated.id);
                if (idx !== -1) state.groups[idx] = updated;
                if (state.current?.id === updated.id) state.current = updated;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                const id = action.payload;
                state.groups = state.groups.filter((g) => g.id !== id);
                state.myGroups = state.myGroups.filter((g) => g.id !== id);
                if (state.current?.id === id) state.current = null;
            })
            .addCase(uploadGroupAvatar.fulfilled, (state, action) => {
                const updated = action.payload.data;
                if (state.current?.id === updated.id) state.current = updated;
            })
            .addCase(uploadGroupCover.fulfilled, (state, action) => {
                const updated = action.payload.data;
                if (state.current?.id === updated.id) state.current = updated;
            })
            .addCase(joinGroup.fulfilled, (state, action) => {
                const joinedGroupId = action.payload.id;
                if (state.current?.id === action.payload.id) {
                    state.current.myRole = action.payload.role ?? "member";
                    if (!action.payload.alreadyMember) {
                        state.current.membersCount += 1;
                    }
                }

                const alreadyInMyGroups = state.myGroups.some((g) => g.id === joinedGroupId);
                if (!alreadyInMyGroups && state.current?.id === joinedGroupId) {
                    state.myGroups.unshift({ ...state.current, myRole: action.payload.role ?? "member" });
                }
            })
            .addCase(leaveGroup.fulfilled, (state, action) => {
                const id = action.payload;
                state.myGroups = state.myGroups.filter((g) => g.id !== id);
                if (state.current?.id === id) {
                    state.current.myRole = null;
                    state.current.membersCount = Math.max(0, state.current.membersCount - 1);
                }
            })
            .addCase(fetchGroupMembers.fulfilled, (state, action) => {
                state.members = action.payload.data;
                state.membersMeta = action.payload.meta;
            })
            .addCase(fetchMyGroups.pending, (state) => { state.myGroupsStatus = "loading"; })
            .addCase(fetchMyGroups.fulfilled, (state, action) => {
                state.myGroups = action.payload.data;
                state.myGroupsStatus = "succeeded";
            })
            .addCase(kickMember.fulfilled, (state, action) => {
                const { userId } = action.payload;
                state.members = state.members.filter((m) => String(m.userId) !== String(userId));
                if (state.current) state.current.membersCount = Math.max(0, state.current.membersCount - 1);
            });
    },
});

export const { clearGroupError, clearCurrentGroup } = groupSlice.actions;
export default groupSlice.reducer;
