import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: "Access token required",
        message: "Please provide a valid authentication token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid token",
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: "Account deactivated",
        message:
          "Your account has been deactivated. Please contact an administrator.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Please provide a valid authentication token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        message: "Your session has expired. Please login again.",
      });
    }

    console.error("Authentication error:", error);
    res.status(500).json({
      error: "Server error",
      message: "An error occurred during authentication",
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please login to access this resource",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};
