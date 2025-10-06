import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/profiles/"));
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only image files"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin/moderator only)
// @access  Private
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "moderator"),
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        department,
        year,
        search,
      } = req.query;

      // Build query
      const query = {};

      if (role) query.role = role;
      if (department) query.department = new RegExp(department, "i");
      if (year) query.year = parseInt(year);
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ];
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        select: "-password",
      };

      const users = await User.find(query)
        .sort(options.sort)
        .limit(options.limit * 1)
        .skip((options.page - 1) * options.limit)
        .select(options.select);

      const total = await User.countDocuments(query);

      res.status(200).json({
        users,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        error: "Server error",
        message: "An error occurred while fetching users",
      });
    }
  }
);

// @route   GET /api/users/team
// @desc    Get all team members (admin/nodal_officer only)
// @access  Private
router.get(
  "/team",
  authenticateToken,
  authorizeRoles("admin", "nodal_officer"),
  async (req, res) => {
    try {
      const users = await User.find({})
        .sort({ createdAt: -1 })
        .select("-password -passwordResetToken -passwordResetExpires");

      res.status(200).json({
        success: true,
        users,
        count: users.length,
      });
    } catch (error) {
      console.error("Get team members error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching team members",
      });
    }
  }
);

// @route   GET /api/users/public-team
// @desc    Get public team members (no auth required)
// @access  Public
router.get("/public-team", async (req, res) => {
  try {
    const { year } = req.query; // Optional year filter

    // Base query - get all non-admin users
    let query = {
      role: { $ne: "admin" }, // Exclude admin users from public display
    };

    // Add year filter if provided
    if (year) {
      const yearInt = parseInt(year);
      query.$or = [
        { teamYears: yearInt }, // Include users with the specific year in teamYears
        { teamYear: year.toString() }, // Backward compatibility with single teamYear
        { "yearlyRoles.year": yearInt }, // Include users with yearly roles for the specific year
      ];
    }

    const users = await User.find(query).select(
      "name teamRole role department year teamYear teamYears yearlyRoles yearlyDisplayOrders profilePicture linkedin github bio email isActive displayOrder"
    );

    // Sort users by year-specific order if available, fallback to global order
    const sortedUsers = users.sort((a, b) => {
      // If a specific year is provided and both users have year-specific orders, use those
      if (year) {
        const aYearOrder = a.yearlyDisplayOrders?.get(year.toString());
        const bYearOrder = b.yearlyDisplayOrders?.get(year.toString());

        if (aYearOrder !== undefined && bYearOrder !== undefined) {
          return aYearOrder - bYearOrder;
        }

        // If only one user has a year-specific order, prioritize that user
        if (aYearOrder !== undefined) return -1;
        if (bYearOrder !== undefined) return 1;
      }

      // Fallback to global display order
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });

    // Return all users (both active and inactive) for public team display
    // This allows viewing historical team data
    res.status(200).json({
      success: true,
      users: sortedUsers, // Return the sorted users
      count: sortedUsers.length,
      year: year ? parseInt(year) : null,
    });
  } catch (error) {
    console.error("Get public team members error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching team members",
      error: error.message,
    });
  }
});

// @route   PATCH /api/users/update-order
// @desc    Update team members display order (admin/nodal_officer only)
// @access  Private
router.patch(
  "/update-order",
  authenticateToken,
  authorizeRoles("admin", "nodal_officer"),
  async (req, res) => {
    try {
      const { updates, year } = req.body; // Array of {userId, displayOrder} and optional year

      if (!Array.isArray(updates)) {
        return res.status(400).json({
          success: false,
          message: "Updates must be an array",
        });
      }

      // Update each user's display order (either global or year-specific)
      const updatePromises = updates.map(async ({ userId, displayOrder }) => {
        const user = await User.findById(userId);
        if (!user) return null;

        if (year) {
          // Update year-specific display order using the Map
          const yearlyOrders = user.yearlyDisplayOrders || new Map();
          yearlyOrders.set(year.toString(), displayOrder);

          return User.findByIdAndUpdate(
            userId,
            { yearlyDisplayOrders: yearlyOrders },
            { new: true }
          );
        } else {
          // Update global display order (fallback)
          return User.findByIdAndUpdate(
            userId,
            { displayOrder },
            { new: true }
          );
        }
      });

      await Promise.all(updatePromises);

      res.status(200).json({
        success: true,
        message: year
          ? `Team member order for year ${year} updated successfully`
          : "Team member order updated successfully",
      });
    } catch (error) {
      console.error("Update team order error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating team order",
      });
    }
  }
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin/moderator
    if (
      req.user._id.toString() !== id &&
      !["admin", "moderator"].includes(req.user.role)
    ) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only view your own profile",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The requested user does not exist",
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Server error",
      message: "An error occurred while fetching user data",
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put(
  "/profile",
  authenticateToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const {
        name,
        teamRole,
        department,
        year,
        phoneNumber,
        linkedin,
        github,
        bio,
      } = req.body;

      // Build update object with only provided fields
      const updateData = {};

      if (name && name.trim()) updateData.name = name.trim();
      if (teamRole !== undefined) updateData.teamRole = teamRole.trim();
      if (department !== undefined) updateData.department = department.trim();
      if (year !== undefined) updateData.year = parseInt(year);
      if (phoneNumber !== undefined)
        updateData.phoneNumber = phoneNumber.trim();
      if (linkedin !== undefined) updateData.linkedin = linkedin.trim();
      if (github !== undefined) updateData.github = github.trim();
      if (bio !== undefined) updateData.bio = bio.trim();

      // Handle profile picture upload
      if (req.file) {
        updateData.profilePicture = `uploads/profiles/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password -passwordResetToken -passwordResetExpires");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Update profile error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          details: Object.values(error.errors).map((err) => err.message),
        });
      }

      res.status(500).json({
        success: false,
        message: "An error occurred while updating profile",
      });
    }
  }
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only update your own profile",
      });
    }

    // Remove sensitive fields that shouldn't be updated via this route
    delete updates.password;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Only admins can update role and isActive status
    if (req.user.role !== "admin") {
      delete updates.role;
      delete updates.isActive;
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "The requested user does not exist",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        message: "Please check your input data",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "An error occurred while updating user data",
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (req.user._id.toString() === id) {
        return res.status(400).json({
          error: "Cannot delete own account",
          message: "You cannot delete your own account",
        });
      }

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "The requested user does not exist",
        });
      }

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        error: "Server error",
        message: "An error occurred while deleting user",
      });
    }
  }
);

// @route   PATCH /api/users/:id/status
// @desc    Update user status (admin/nodal_officer only)
// @access  Private
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin", "nodal_officer"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      // Prevent admin/nodal_officer from deactivating themselves
      if (req.user._id.toString() === id && !isActive) {
        return res.status(400).json({
          success: false,
          message: "You cannot deactivate your own account",
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        { isActive },
        { new: true, runValidators: true }
      ).select("-password -passwordResetToken -passwordResetExpires");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        user,
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating user status",
      });
    }
  }
);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching profile",
    });
  }
});

// @route   PUT /api/users/:id/admin-edit
// @desc    Admin edit any user's profile (admin only)
// @access  Private
router.put(
  "/:id/admin-edit",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        role,
        teamRole,
        department,
        year,
        phoneNumber,
        linkedin,
        github,
        bio,
        teamYears,
        yearlyRoles,
        isActive,
      } = req.body;

      // Build update object
      const updateData = {};

      if (name && name.trim()) updateData.name = name.trim();
      if (email && email.trim()) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({
          email: email.trim().toLowerCase(),
          _id: { $ne: id },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email is already taken by another user",
          });
        }
        updateData.email = email.trim().toLowerCase();
      }
      if (role) updateData.role = role;
      if (teamRole !== undefined) updateData.teamRole = teamRole.trim();
      if (department !== undefined) updateData.department = department.trim();
      if (year !== undefined && year !== null && year !== "") {
        const parsedYear = parseInt(year);
        if (!isNaN(parsedYear)) {
          updateData.year = parsedYear;
        }
      }
      if (phoneNumber !== undefined)
        updateData.phoneNumber = phoneNumber.trim();
      if (linkedin !== undefined) updateData.linkedin = linkedin.trim();
      if (github !== undefined) updateData.github = github.trim();
      if (bio !== undefined) updateData.bio = bio.trim();
      if (isActive !== undefined) updateData.isActive = isActive;

      // Handle team years and yearly roles
      if (teamYears) {
        try {
          const parsedTeamYears = Array.isArray(teamYears)
            ? teamYears
            : JSON.parse(teamYears);
          updateData.teamYears = parsedTeamYears.map((year) => parseInt(year));
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Invalid team years format",
          });
        }
      }

      if (yearlyRoles) {
        try {
          const parsedYearlyRoles = Array.isArray(yearlyRoles)
            ? yearlyRoles
            : JSON.parse(yearlyRoles);
          updateData.yearlyRoles = parsedYearlyRoles;
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Invalid yearly roles format",
          });
        }
      }

      // Handle profile picture upload
      if (req.file) {
        updateData.profilePicture = `uploads/profiles/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password -passwordResetToken -passwordResetExpires");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Admin edit user error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          details: Object.values(error.errors).map((err) => err.message),
        });
      }

      res.status(500).json({
        success: false,
        message: "An error occurred while updating user profile",
      });
    }
  }
);

// @route   POST /api/users/:id/reset-password-admin
// @desc    Admin reset any user's password (admin only)
// @access  Private
router.post(
  "/:id/reset-password-admin",
  authenticateToken,
  authorizeRoles("admin"),
  [
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          details: errors.array().map((err) => err.msg),
        });
      }

      const { id } = req.params;
      const { newPassword } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update password (will be hashed by pre-save hook)
      user.password = newPassword;
      // Clear any existing reset tokens
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: `Password for ${user.name} has been reset successfully`,
      });
    } catch (error) {
      console.error("Admin reset password error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while resetting the password",
      });
    }
  }
);

// @route   PUT /api/users/:id/display-order
// @desc    Update user display order for specific team year (admin only)
// @access  Private
router.put(
  "/:id/display-order",
  authenticateToken,
  authorizeRoles("admin"),
  [
    body("displayOrder")
      .isInt({ min: 0 })
      .withMessage("Display order must be a non-negative integer"),
    body("teamYear")
      .optional()
      .isString()
      .withMessage("Team year must be a string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          details: errors.array().map((err) => err.msg),
        });
      }

      const { id } = req.params;
      const { displayOrder, teamYear } = req.body;
      const currentYear = teamYear || new Date().getFullYear().toString();

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update global display order
      user.displayOrder = displayOrder;

      // Update yearly display order
      user.yearlyDisplayOrders.set(currentYear, displayOrder);

      // If updating yearly roles, also update the order there
      const yearlyRole = user.yearlyRoles.find(
        (yr) => yr.year === parseInt(currentYear)
      );
      if (yearlyRole) {
        yearlyRole.order = displayOrder;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: `Display order for ${user.name} updated successfully`,
        data: {
          user: {
            id: user._id,
            name: user.name,
            displayOrder: user.displayOrder,
            yearlyDisplayOrders: Object.fromEntries(user.yearlyDisplayOrders),
          },
        },
      });
    } catch (error) {
      console.error("Update display order error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating display order",
      });
    }
  }
);

export default router;
