import multer from "multer";

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, callback) => {
	if (!file.mimetype.startsWith("image/")) {
		return callback(new Error("Only image files are allowed"), false);
	}

	return callback(null, true);
};

export const uploadAvatar = multer({
	storage,
	fileFilter: imageFileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

export const uploadPostImages = multer({
	storage,
	fileFilter: imageFileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
});
