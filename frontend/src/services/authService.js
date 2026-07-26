import apiClient from "./http.js";

// Note: Authorization headers are automatically added by axios interceptor
// in axiosInstance.js, so we don't need to manually add them here

export const getCurrentUserRequest = async () => {
	const response = await apiClient.get("/users/me");
	return response.data;
};

export const loginRequest = async (payload) => {
	const response = await apiClient.post("/auth/login", payload);
	return response.data;
};

export const registerRequest = async (payload) => {
	const response = await apiClient.post("/auth/register", payload);
	return response.data;
};

export const logoutRequest = async () => {
	const response = await apiClient.post("/auth/logout");
	return response.data;
};

export const updateMeRequest = async (payload) => {
	const response = await apiClient.put("/users/me", payload);
	return response.data;
};

export const updateAvatarRequest = async (file) => {
	const formData = new FormData();
	formData.append("avatar", file);

	const response = await apiClient.put("/users/avatar", formData);
	return response.data;
};