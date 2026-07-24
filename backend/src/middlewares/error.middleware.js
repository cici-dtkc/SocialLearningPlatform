export const notFoundHandler = (req, res, next) => {
	return res.status(404).json({
		message: "Route not found",
	});
};

export const errorHandler = (error, req, res, next) => {
	if (error?.message === "Only image files are allowed") {
		return res.status(400).json({
			message: error.message,
		});
	}

	if (error?.name === "MulterError") {
		return res.status(400).json({
			message: error.message,
		});
	}

	return res.status(error.statusCode || 500).json({
		message: error.message || "Internal Server Error",
	});
};
