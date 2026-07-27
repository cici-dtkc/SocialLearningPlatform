import { uploadBufferAsImage } from "../../config/cloudinary.js";

export const uploadPostImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one image file is required",
            });
        }

        const uploadPromises = req.files.map((file) =>
            uploadBufferAsImage(file, "social-learning-platform/posts")
        );

        const uploadResults = await Promise.all(uploadPromises);

        return res.status(200).json({
            message: "Upload post images successfully",
            data: uploadResults.map((result) => ({
                url: result.secure_url,
                publicId: result.public_id,
            })),
        });
    } catch (error) {
        console.error("[uploadPostImages] error:", error?.message);
        console.error("[uploadPostImages] http_code:", error?.http_code);
        console.error("[uploadPostImages] name:", error?.name);
        return res.status(error.statusCode || error.http_code || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};