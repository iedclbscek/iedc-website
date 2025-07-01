import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import User from "../models/User.js";

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

    console.log(`📊 Fetching public team members for year: ${year || "all"}`);

    // Base query - get all non-admin users (temporarily including inactive for debugging)
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

    console.log("📊 MongoDB query:", JSON.stringify(query, null, 2));

    const users = await User.find(query)
      .sort({
        role: 1, // Sort by role priority
        createdAt: -1,
      })
      .select(
        "name teamRole role department year teamYear teamYears yearlyRoles profilePicture linkedin github bio email isActive"
      );

    console.log(`📊 Found ${users.length} team members`);
    if (users.length > 0) {
      console.log('📊 Sample user data:', {
        name: users[0].name,
        role: users[0].role,
        isActive: users[0].isActive,
        teamYears: users[0].teamYears,
        yearlyRoles: users[0].yearlyRoles
      });
    }

    // Filter to only return active users in the response
    const activeUsers = users.filter(user => user.isActive);
    console.log(`📊 Active users: ${activeUsers.length} out of ${users.length}`);

    res.status(200).json({
      success: true,
      users: activeUsers,
      count: activeUsers.length,
      totalFound: users.length,
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
        updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
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

export default router;
