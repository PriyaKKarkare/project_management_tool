const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
	try {
		// 1. Get token from cookie
		const token = req.cookies.token;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Not authenticated",
			});
		}

		// 2. Verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET
		);

		// 3. Find user
		const user = await User.findById(decoded.userId).select(
			"-password"
		);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		// 4. Store user in request
		req.user = user;

		// 5. Continue
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};

const authorize = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Not authenticated",
			});
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "You do not have permission to perform this action",
			});
		}

		next();
	};
};
module.exports = {
	protect,
	authorize,
};