import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadBufferAsImage = async (file, folder) => {
	const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

	return cloudinary.uploader.upload(base64Image, {
		folder,
	});
};
