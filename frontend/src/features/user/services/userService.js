import apiClient from "../../../services/http.js";

export const getUsersRequest = async ({ page = 1, limit = 10, search } = {}) => {
	const params = { page, limit };
	if (search) params.search = search;
	const response = await apiClient.get("/users", { params });
	return response.data;
};
