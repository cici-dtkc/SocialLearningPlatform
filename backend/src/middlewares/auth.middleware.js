import User from "../modules/user/user.model.js";
import { verifyAccessToken } from "../config/jwt.js";

const getTokenFromRequest = (req) => {
	const authorizationHeader = req.headers.authorization;

	if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
		return authorizationHeader.split(" ")[1];
	}

	return req.cookies?.accessToken || null;
};

export const requireAuth = async (req, res, next) => {
	try {
		const token = getTokenFromRequest(req);

		if (!token) {
			return res.status(401).json({
				message: "Authentication required",
			});
		}

		const decoded = verifyAccessToken(token);
		const userId = decoded.userId;

		if (!userId) {
			return res.status(401).json({
				message: "Invalid token",
			});
		}

		const user = await User.findById(userId).select("-password");

		if (!user) {
			return res.status(401).json({
				message: "User not found",
			});
		}

		req.user = user;
		req.userId = user._id;

		return next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid or expired token",
		});
	}
};

export const optionalAuth = async (req, _res, next) => {
	try {
		const token = getTokenFromRequest(req);

		if (!token) return next();

		const decoded = verifyAccessToken(token);
		const userId = decoded.userId;
		if (!userId) return next();

		const user = await User.findById(userId).select("-password");
		if (!user) return next();

		req.user = user;
		req.userId = user._id;
		return next();
	} catch {
		return next();
	}
};
