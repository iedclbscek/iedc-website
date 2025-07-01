import express from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import User from "../models/User.js";
import { generateToken } from "../utils/tokenUtils.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import {
  sendInvitationEmail,
  sendPasswordResetEmail,
  generateResetToken,
  hashResetToken,
} from "../utils/emailService.js";

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    error: "Too many authentication attempts",
    message: "Please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const loginValidation = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Please provide a valid username"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const inviteValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("teamRole")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Team role must be at least 2 characters if provided"),
  body("role")
    .isIn([
      "admin",
      "nodal_officer",
      "ceo",
      "lead",
      "co_lead",
      "coordinator",
      "member",
    ])
    .withMessage("Invalid role specified"),
  body("department")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Department must be at least 2 characters if provided"),
  body("year")
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage("Year must be between 1 and 4 if provided"),
  body("phoneNumber")
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid Indian phone number if provided"),
  body("linkedin")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Please provide a valid LinkedIn URL if provided"),
  body("github")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Please provide a valid GitHub URL if provided"),
];

const setPasswordValidation = [
  body("token").isLength({ min: 32 }).withMessage("Invalid reset token"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-z0-9_]+$/)
    .withMessage(
      "Username must be 3-20 characters and contain only lowercase letters, numbers, and underscores"
    ),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please check your input data",
      details: errors.array(),
    });
  }
  next();
};

// @route   POST /api/auth/login
// @desc    Login user with username
// @access  Public
router.post(
  "/login",
  authLimiter,
  loginValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ username: username.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Username or password is incorrect",
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          error: "Account deactivated",
          message:
            "Your account has been deactivated. Please contact an administrator.",
        });
      }

      // Check if user has set password
      if (!user.password) {
        return res.status(401).json({
          error: "Password not set",
          message:
            "Please set your password using the invitation link sent to your email.",
        });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Username or password is incorrect",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          teamRole: user.teamRole,
          department: user.department,
          year: user.year,
          teamYear: user.teamYear,
          profilePicture: user.profilePicture,
          linkedin: user.linkedin,
          github: user.github,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Server error",
        message: "An error occurred during login",
      });
    }
  }
);

// @route   POST /api/auth/invite
// @desc    Invite new team member (admin/nodal_officer only)
// @access  Private
router.post(
  "/invite",
  authenticateToken,
  authorizeRoles("admin", "nodal_officer"),
  inviteValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      console.log("📧 Invite request received with data:", req.body);

      const {
        name,
        email,
        teamRole,
        role,
        department,
        year,
        teamYear = "2025",
        teamYears = [2025], // Default to current year if not provided
        yearlyRoles = [], // Array of {year, role, teamRole} objects
        phoneNumber,
        linkedin,
        github,
        sendEmail = true, // Default to true for backward compatibility
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: "User already exists",
          message: "A user with this email already exists",
        });
      }

      // Generate reset token only if email will be sent
      const resetToken = sendEmail ? generateResetToken() : null;
      const hashedToken = resetToken ? hashResetToken(resetToken) : null;

      // Create user data object with only defined fields
      const userData = {
        name,
        email,
        role: role, // Keep primary role for backward compatibility
        teamYear: teamYears[0]?.toString() || "2025", // Keep first year for backward compatibility
        teamYears: teamYears, // Store all team years
        yearlyRoles:
          yearlyRoles.length > 0
            ? yearlyRoles
            : teamYears.map((year) => ({
                year: year,
                role: role || "member",
                teamRole: teamRole || "",
              })), // Create yearly roles from team years if not provided
        isActive: sendEmail, // Only active if email is sent (current year members)
        isEmailVerified: false,
      };

      // Add password reset fields only if email will be sent
      if (sendEmail) {
        userData.passwordResetToken = hashedToken;
        userData.passwordResetExpires = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ); // 24 hours
      }

      // Add optional fields only if they are provided
      if (teamRole && teamRole.trim()) userData.teamRole = teamRole.trim();
      if (department && department.trim())
        userData.department = department.trim();
      if (year) userData.year = parseInt(year);
      if (phoneNumber && phoneNumber.trim())
        userData.phoneNumber = phoneNumber.trim();
      if (linkedin && linkedin.trim() && linkedin.trim() !== "")
        userData.linkedin = linkedin.trim();
      if (github && github.trim() && github.trim() !== "")
        userData.github = github.trim();

      // Create new user without password
      const user = new User(userData);

      await user.save();

      let emailResult = { success: true };

      // Send invitation email only if requested
      if (sendEmail && resetToken) {
        emailResult = await sendInvitationEmail(email, name, resetToken);

        if (!emailResult.success) {
          console.error("Failed to send invitation email:", emailResult.error);
          // Don't fail the request, just log the error
        }
      }

      res.status(201).json({
        message: sendEmail
          ? "Invitation sent successfully"
          : "Member added successfully (no email sent)",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          teamRole: user.teamRole,
          role: user.role,
          department: user.department,
          year: user.year,
          teamYear: user.teamYear,
          teamYears: user.teamYears,
          isActive: user.isActive,
        },
        emailSent: emailResult.success && sendEmail,
        success: true,
      });
    } catch (error) {
      console.error("Invite error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          error: "Validation error",
          message: "Please check your input data",
          details: Object.values(error.errors).map((err) => err.message),
        });
      }

      res.status(500).json({
        error: "Server error",
        message: "An error occurred while sending invitation",
      });
    }
  }
);

// @route   POST /api/auth/set-password
// @desc    Set password using invitation token
// @access  Public
router.post(
  "/set-password",
  setPasswordValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token, password, username } = req.body;

      // Hash the provided token
      const hashedToken = hashResetToken(token);

      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          error: "Invalid or expired token",
          message: "The invitation link is invalid or has expired",
        });
      }

      // Check if username is already taken
      const existingUsername = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: user._id },
      });

      if (existingUsername) {
        return res.status(400).json({
          error: "Username taken",
          message: "This username is already taken. Please choose another one.",
        });
      }

      // Set password and username
      user.password = password;
      user.username = username.toLowerCase();
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.isEmailVerified = true;

      await user.save();

      // Generate token
      const authToken = generateToken(user._id);

      res.status(200).json({
        message: "Password set successfully",
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          teamRole: user.teamRole,
          department: user.department,
          year: user.year,
          teamYear: user.teamYear,
        },
        token: authToken,
      });
    } catch (error) {
      console.error("Set password error:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          error: "Validation error",
          message: "Please check your input data",
          details: Object.values(error.errors).map((err) => err.message),
        });
      }

      res.status(500).json({
        error: "Server error",
        message: "An error occurred while setting password",
      });
    }
  }
);

// @route   GET /api/auth/validate-invitation/:token
// @desc    Validate invitation token
// @access  Public
router.get("/validate-invitation/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with stored hash
    const hashedToken = hashResetToken(token);

    // Find user with matching password reset token and valid expiry
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired invitation link",
      });
    }

    res.status(200).json({
      success: true,
      message: "Valid invitation token",
    });
  } catch (error) {
    console.error("Validate invitation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while validating invitation",
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      error: "Server error",
      message: "An error occurred while fetching user data",
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Logout successful",
  });
});

export default router;
