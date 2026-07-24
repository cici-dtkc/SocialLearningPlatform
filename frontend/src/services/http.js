import axiosInstance from "./axiosInstance.js";

export const extractErrorMessage = (error) => {
	const responseMessage = error?.response?.data?.message;
	if (responseMessage) return responseMessage;

	const validationErrors = error?.response?.data?.errors;
	if (Array.isArray(validationErrors) && validationErrors.length > 0) {
		return validationErrors
			.map((entry) => entry?.msg || entry?.message)
			.filter(Boolean)
			.join(". ");
	}

	return error?.message || "Something went wrong";
};

export default axiosInstance;