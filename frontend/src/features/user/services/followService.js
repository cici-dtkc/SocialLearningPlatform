import apiClient from "../../../services/http.js";

export const followUserRequest = (id) =>
    apiClient.post(`/users/${id}/follow`).then((r) => r.data);

export const unfollowUserRequest = (id) =>
    apiClient.delete(`/users/${id}/follow`).then((r) => r.data);

export const getFollowStatusRequest = (id) =>
    apiClient.get(`/users/${id}/follow/status`).then((r) => r.data);

export const getFollowersRequest = (id) =>
    apiClient.get(`/users/${id}/followers`).then((r) => r.data);

export const getFollowingRequest = (id) =>
    apiClient.get(`/users/${id}/following`).then((r) => r.data);

export const getFollowCountsRequest = (id) =>
    apiClient.get(`/users/${id}/follow/counts`).then((r) => r.data);

export const getUserByIdRequest = (id) =>
    apiClient.get(`/users/${id}`).then((r) => r.data);
