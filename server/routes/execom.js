import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Registration from "../models/Registration.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { getUserRoadmapData } from "../utils/roadmapService.js";

const router = express.Router();

// Middleware to verify execom role and current team year
const verifyExecomAccess = (req, res, next) => {
  const currentYear = new Date().getFullYear();

  if (req.user.role !== "execom" || !req.user.teamYears.includes(currentYear)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Execom access required for current year.",
    });
  }
  next();
};

// GET /api/execom/profile - Get execom user profile
router.get(
  "/profile",
  authenticateToken,
  verifyExecomAccess,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select(
        "-password -passwordResetToken -passwordResetExpires"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Get additional registration data if available
      const registration = await Registration.findOne({
        membershipId: user.username,
      });

      res.json({
        success: true,
        data: {
          user,
          registration: registration || null,
        },
      });
    } catch (error) {
      console.error("Get execom profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// PUT /api/execom/profile - Update execom user profile
router.put(
  "/profile",
  authenticateToken,
  verifyExecomAccess,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("bio")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("linkedin")
      .optional()
      .trim()
      .matches(/^https?:\/\/.+/)
      .withMessage("LinkedIn must be a valid URL"),
    body("github")
      .optional()
      .trim()
      .matches(/^https?:\/\/.+/)
      .withMessage("GitHub must be a valid URL"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, bio, linkedin, github } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (linkedin !== undefined) updateData.linkedin = linkedin;
      if (github !== undefined) updateData.github = github;

      const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password -passwordResetToken -passwordResetExpires");

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Update execom profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// PUT /api/execom/password - Change password
router.put(
  "/password",
  authenticateToken,
  verifyExecomAccess,
  [
    body("currentPassword")
      .isLength({ min: 1 })
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// GET /api/execom/dashboard-stats - Get dashboard statistics for execom
router.get(
  "/dashboard-stats",
  authenticateToken,
  verifyExecomAccess,
  async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();

      // Get basic stats that execom members might need
      const totalMembers = await User.countDocuments({ isActive: true });
      const totalExecom = await User.countDocuments({
        role: "execom",
        teamYears: currentYear,
        isActive: true,
      });
      const totalRegistrations = await Registration.countDocuments();
      const pendingRegistrations = await Registration.countDocuments({
        status: "pending",
      });

      res.json({
        success: true,
        data: {
          totalMembers,
          totalExecom,
          totalRegistrations,
          pendingRegistrations,
          currentYear,
        },
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// GET /api/execom/roadmap - Get personalized roadmap for user
router.get("/roadmap", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get registration data for year of joining
    const registration = await Registration.findOne({
      membershipId: user.username,
    });

    const roadmapData = getUserRoadmapData({
      ...user.toObject(),
      registration: registration ? registration.toObject() : null,
    });

    res.json({
      success: true,
      data: roadmapData,
    });
  } catch (error) {
    console.error("Get roadmap error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
