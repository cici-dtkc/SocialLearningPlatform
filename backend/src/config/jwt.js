import jwt from "jsonwebtoken";

const getJwtSecret = () => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error("JWT_SECRET is not configured");
	}

	return secret;
};

export const signAccessToken = (payload, options = {}) => {
	return jwt.sign(payload, getJwtSecret(), {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
		...options,
	});
};

export const verifyAccessToken = (token) => {
	return jwt.verify(token, getJwtSecret());
};
