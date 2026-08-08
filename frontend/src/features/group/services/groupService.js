import apiClient from "../../../services/http.js";

 // CRUD  
export const getGroupsRequest = ({ page = 1, limit = 12, search, visibility } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (visibility) params.visibility = visibility;
    return apiClient.get("/groups", { params }).then((r) => r.data);
};

export const getGroupByIdRequest = (id) =>
    apiClient.get(`/groups/${id}`).then((r) => r.data);

export const createGroupRequest = (payload) =>
    apiClient.post("/groups", payload).then((r) => r.data);

export const updateGroupRequest = (id, payload) =>
    apiClient.put(`/groups/${id}`, payload).then((r) => r.data);

export const deleteGroupRequest = (id) =>
    apiClient.delete(`/groups/${id}`).then((r) => r.data);

 // Image uploads  
export const uploadGroupAvatarRequest = (id, file) => {
    const form = new FormData();
    form.append("avatar", file);
    return apiClient.put(`/groups/${id}/avatar`, form).then((r) => r.data);
};

export const uploadGroupCoverRequest = (id, file) => {
    const form = new FormData();
    form.append("cover", file);
    return apiClient.put(`/groups/${id}/cover`, form).then((r) => r.data);
};

// Membership  
export const joinGroupRequest = (id) =>
    apiClient.post(`/groups/${id}/join`).then((r) => r.data);

export const leaveGroupRequest = (id) =>
    apiClient.delete(`/groups/${id}/leave`).then((r) => r.data);

export const getGroupMembersRequest = (id, { page = 1, limit = 20 } = {}) =>
    apiClient.get(`/groups/${id}/members`, { params: { page, limit } }).then((r) => r.data);

export const searchGroupUsersRequest = (id, { query = "", limit = 10 } = {}) =>
    apiClient.get(`/groups/${id}/search-users`, { params: { query, limit } }).then((r) => r.data);

export const addGroupMemberRequest = (id, userId) =>
    apiClient.post(`/groups/${id}/members`, { userId }).then((r) => r.data);

export const getMyGroupsRequest = () =>
    apiClient.get("/users/me/groups").then((r) => r.data);

// Member management 
export const changeMemberRoleRequest = (groupId, userId, role) =>
    apiClient.put(`/groups/${groupId}/members/${userId}/role`, { role }).then((r) => r.data);

export const kickMemberRequest = (groupId, userId) =>
    apiClient.delete(`/groups/${groupId}/members/${userId}`).then((r) => r.data);
