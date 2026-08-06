import apiClient from "../../../services/http.js";

export const getPostsRequest = async ({ page = 1, limit = 10, authorId } = {}) => {
	const params = { page, limit };
	if (authorId) params.authorId = authorId;
	const response = await apiClient.get("/posts", { params });
	return response.data;
};

export const getPostByIdRequest = async (id) => {
	const response = await apiClient.get(`/posts/${id}`);
	return response.data;
};

export const createPostRequest = async (payload) => {
	const response = await apiClient.post("/posts", payload);
	return response.data;
};

export const updatePostRequest = async (id, payload) => {
	const response = await apiClient.put(`/posts/${id}`, payload);
	return response.data;
};

export const deletePostRequest = async (id) => {
	const response = await apiClient.delete(`/posts/${id}`);
	return response.data;
};

export const uploadPostImagesRequest = async (files) => {
	const formData = new FormData();
	files.forEach((file) => formData.append("images", file));
	const response = await apiClient.post("/posts/images", formData);
	return response.data;
};

// Comments
export const getCommentsRequest = async (postId) => {
	const response = await apiClient.get(`/posts/${postId}/comments`);
	return response.data;
};

export const createCommentRequest = async (payload) => {
	const response = await apiClient.post("/comments", payload);
	return response.data;
};

export const updateCommentRequest = async (id, content) => {
	const response = await apiClient.put(`/comments/${id}`, { content });
	return response.data;
};

export const deleteCommentRequest = async (id) => {
	const response = await apiClient.delete(`/comments/${id}`);
	return response.data;
};

// Likes
export const likePostRequest = async (id) => {
	const response = await apiClient.post(`/posts/${id}/like`);
	return response.data;
};

export const unlikePostRequest = async (id) => {
	const response = await apiClient.delete(`/posts/${id}/like`);
	return response.data;
};

// Comment likes
export const likeCommentRequest = async (id) => {
	const response = await apiClient.post(`/comments/${id}/like`);
	return response.data;
};

export const unlikeCommentRequest = async (id) => {
	const response = await apiClient.delete(`/comments/${id}/like`);
	return response.data;
};
