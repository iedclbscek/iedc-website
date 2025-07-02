import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for memory storage (for Cloudinary)
const storage = multer.memoryStorage();

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
      "name teamRole role department year teamYear teamYears yearlyRoles profilePicture linkedin github bio email isActive displayOrder yearlyDisplayOrders"
    );

    // Sort users based on year-specific ordering if year is provided
    let sortedUsers;
    if (year) {
      sortedUsers = users.sort((a, b) => {
        // Get year-specific order, fallback to global displayOrder
        const aOrder =
          a.yearlyDisplayOrders?.get(year.toString()) ?? a.displayOrder ?? 0;
        const bOrder =
          b.yearlyDisplayOrders?.get(year.toString()) ?? b.displayOrder ?? 0;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        // Secondary sort by role priority
        const rolePriority = {
          admin: 0,
          nodal_officer: 1,
          ceo: 2,
          lead: 3,
          co_lead: 4,
          coordinator: 5,
          member: 6,
        };

        const aRolePriority = rolePriority[a.role] ?? 6;
        const bRolePriority = rolePriority[b.role] ?? 6;

        if (aRolePriority !== bRolePriority) {
          return aRolePriority - bRolePriority;
        }

        // Tertiary sort by creation date
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      sortedUsers = users.sort((a, b) => {
        // Use global displayOrder for all years view
        const aOrder = a.displayOrder ?? 0;
        const bOrder = b.displayOrder ?? 0;

        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }

        // Secondary sort by role priority
        const rolePriority = {
          admin: 0,
          nodal_officer: 1,
          ceo: 2,
          lead: 3,
          co_lead: 4,
          coordinator: 5,
          member: 6,
        };

        const aRolePriority = rolePriority[a.role] ?? 6;
        const bRolePriority = rolePriority[b.role] ?? 6;

        if (aRolePriority !== bRolePriority) {
          return aRolePriority - bRolePriority;
        }

        // Tertiary sort by creation date
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    // Return all users (both active and inactive) for public team display
    // This allows viewing historical team data
    res.status(200).json({
      success: true,
      users: sortedUsers, // Return sorted users
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

      if (year) {
        // Update year-specific ordering
        const updatePromises = updates.map(async ({ userId, displayOrder }) => {
          const user = await User.findById(userId);
          if (user) {
            // Initialize yearlyDisplayOrders if it doesn't exist
            if (!user.yearlyDisplayOrders) {
              user.yearlyDisplayOrders = new Map();
            }
            user.yearlyDisplayOrders.set(year.toString(), displayOrder);
            return user.save();
          }
        });

        await Promise.all(updatePromises);

        res.status(200).json({
          success: true,
          message: `Team member order updated successfully for year ${year}`,
        });
      } else {
        // Update global display order (fallback)
        const updatePromises = updates.map(({ userId, displayOrder }) =>
          User.findByIdAndUpdate(userId, { displayOrder }, { new: true })
        );

        await Promise.all(updatePromises);

        res.status(200).json({
          success: true,
          message: "Team member order updated successfully",
        });
      }
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
      const { name, department, phoneNumber, linkedin, github, bio } = req.body;

      // Build update object with only provided fields
      const updateData = {};

      if (name && name.trim()) updateData.name = name.trim();
      if (department !== undefined) updateData.department = department.trim();
      if (phoneNumber !== undefined)
        updateData.phoneNumber = phoneNumber.trim();
      if (linkedin !== undefined) updateData.linkedin = linkedin.trim();
      if (github !== undefined) updateData.github = github.trim();
      if (bio !== undefined) updateData.bio = bio.trim();

      // Handle profile picture upload to Cloudinary
      if (req.file) {
        try {
          // Upload to Cloudinary
          const uploadPromise = new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: "auto",
                  folder: "iedc/profiles", // Organize files in folders
                  public_id: `profile_${req.user._id}_${Date.now()}`, // Unique filename
                  transformation: [
                    { width: 400, height: 400, crop: "fill" }, // Auto-resize/crop
                    { quality: "auto" }, // Auto-optimize quality
                    { format: "webp" }, // Convert to WebP for better compression
                  ],
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              )
              .end(req.file.buffer);
          });

          const result = await uploadPromise;

          // Get current user to check if they have an existing image to delete
          const currentUser = await User.findById(req.user._id);

          // If user has an existing image in Cloudinary, delete it to avoid accumulating unused images
          if (currentUser && currentUser.profilePicturePublicId) {
            try {
              await cloudinary.uploader.destroy(
                currentUser.profilePicturePublicId
              );
              console.log(
                `Deleted old profile image: ${currentUser.profilePicturePublicId}`
              );
            } catch (deleteError) {
              console.error("Error deleting old profile image:", deleteError);
              // Continue even if deletion fails
            }
          }

          // Update with new Cloudinary URL and public ID
          updateData.profilePicture = result.secure_url;
          updateData.profilePicturePublicId = result.public_id;
        } catch (cloudinaryError) {
          console.error("Cloudinary upload error:", cloudinaryError);
          return res.status(500).json({
            success: false,
            message: "Error uploading profile picture to cloud storage",
          });
        }
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
        updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
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

export default router;
