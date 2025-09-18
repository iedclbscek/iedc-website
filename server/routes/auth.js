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
  sendEmail,
  testEmailService, // Add this import
} from "../utils/emailService.js";
import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Verification from "../models/Verification.js";

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

// More lenient rate limit for verification emails
const verificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 attempts per 5 minutes
  message: {
    error: "Too many verification attempts",
    message: "Please wait before requesting another code",
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
  body("role")
    .optional()
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
  body("teamRole")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Team role must be at least 2 characters if provided"),
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
  body("yearlyRoles")
    .optional()
    .isArray()
    .withMessage("yearlyRoles must be an array if provided"),
  body("yearlyRoles.*.year")
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage("Year must be between 2020 and 2030"),
  body("yearlyRoles.*.role")
    .optional()
    .isIn([
      "admin",
      "nodal_officer",
      "ceo",
      "lead",
      "co_lead",
      "coordinator",
      "member",
    ])
    .withMessage("Invalid role specified in yearlyRoles"),
  body("teamYears")
    .optional()
    .isArray()
    .withMessage("teamYears must be an array if provided"),
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

// Helper function to send email with timeout and better error handling
const sendEmailSafely = async (emailFunction, ...args) => {
  try {
    console.log("📧 Attempting to send email...");

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Email timeout after 90 seconds")),
        90000
      );
    });

    // Race the email sending against the timeout
    const result = await Promise.race([emailFunction(...args), timeoutPromise]);

    if (result && result.success) {
      console.log("✅ Email sent successfully:", result.messageId || "no-id");
      return {
        success: true,
        messageId: result.messageId,
        service: result.service,
      };
    } else {
      console.error(
        "❌ Email sending failed:",
        result?.error || "Unknown error"
      );
      return { success: false, error: result?.error || "Email service failed" };
    }
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    return { success: false, error: error.message };
  }
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
        console.log(
          "📧 User exists, updating their yearly roles and team years..."
        );

        // Get existing data
        const existingYears = existingUser.teamYears || [];
        const existingYearlyRoles = [...(existingUser.yearlyRoles || [])];

        // Merge team years (always add new years)
        const updatedTeamYears = [...new Set([...existingYears, ...teamYears])];

        // Update or add yearly roles
        yearlyRoles.forEach((newRole) => {
          const existingRoleIndex = existingYearlyRoles.findIndex(
            (yr) => yr.year === newRole.year
          );
          if (existingRoleIndex !== -1) {
            // Update existing yearly role
            console.log(`📧 Updating existing role for year ${newRole.year}`);
            existingYearlyRoles[existingRoleIndex] = {
              ...existingYearlyRoles[existingRoleIndex],
              ...newRole,
            };
          } else {
            // Add new yearly role
            console.log(`📧 Adding new role for year ${newRole.year}`);
            existingYearlyRoles.push(newRole);
          }
        });

        // Update user with new/updated years and roles
        const updateData = {
          teamYears: updatedTeamYears,
          yearlyRoles: existingYearlyRoles,
        };

        // Update name if provided (in case of name changes)
        if (name && name.trim()) {
          updateData.name = name.trim();
        }

        // Update other optional fields if provided
        if (department && department.trim()) {
          updateData.department = department.trim();
        }
        if (phoneNumber && phoneNumber.trim()) {
          updateData.phoneNumber = phoneNumber.trim();
        }
        if (linkedin && linkedin.trim()) {
          updateData.linkedin = linkedin.trim();
        }
        if (github && github.trim()) {
          updateData.github = github.trim();
        }

        // Generate reset token and send email if current year is included and user doesn't have password
        let emailResult = { success: true };
        const shouldSendEmail = sendEmail && !existingUser.password;

        if (shouldSendEmail) {
          const resetToken = generateResetToken();
          const hashedToken = hashResetToken(resetToken);

          updateData.passwordResetToken = hashedToken;
          updateData.passwordResetExpires = new Date(
            Date.now() + 24 * 60 * 60 * 1000
          );
          updateData.isActive = true; // Activate user when sending email

          emailResult = await sendEmailSafely(
            sendInvitationEmail,
            email,
            name,
            resetToken
          );
        }

        // Update the existing user
        const updatedUser = await User.findByIdAndUpdate(
          existingUser._id,
          updateData,
          { new: true, runValidators: true }
        );

        return res.status(200).json({
          message: shouldSendEmail
            ? "Years added to existing member and invitation sent"
            : "Years added to existing member successfully",
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            teamRole: updatedUser.teamRole,
            role: updatedUser.role,
            department: updatedUser.department,
            year: updatedUser.year,
            teamYear: updatedUser.teamYear,
            teamYears: updatedUser.teamYears,
            yearlyRoles: updatedUser.yearlyRoles,
            isActive: updatedUser.isActive,
          },
          emailSent: emailResult.success && shouldSendEmail,
          success: true,
          updated: true, // Flag to indicate this was an update, not a new user
        });
      }

      // Generate reset token only if email will be sent
      const resetToken = sendEmail ? generateResetToken() : null;
      const hashedToken = resetToken ? hashResetToken(resetToken) : null;

      // Create user data object with only defined fields
      const userData = {
        name,
        email,
        role: role || yearlyRoles[0]?.role || "member", // Use first yearly role as primary role, fallback to member
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
        emailResult = await sendEmailSafely(
          sendInvitationEmail,
          email,
          name,
          resetToken
        );

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

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  authLimiter,
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.status(200).json({
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      }

      // Generate reset token
      const resetToken = generateResetToken();
      const hashedToken = hashResetToken(resetToken);

      // Set reset token and expiration (1 hour)
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();

      // Send reset email with improved error handling
      const emailResult = await sendEmailSafely(
        sendPasswordResetEmail,
        user.email,
        user.name,
        resetToken
      );

      if (!emailResult.success) {
        console.error(
          "Failed to send password reset email:",
          emailResult.error
        );

        // Clear reset token if email fails
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.status(500).json({
          success: false,
          message:
            "Failed to send password reset email. Please try again later.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request.",
      });
    }
  }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post(
  "/reset-password",
  authLimiter,
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { token, password } = req.body;

      // Hash the token to compare with stored hash
      const hashedToken = hashResetToken(token);

      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token.",
        });
      }

      // Update password and clear reset token
      user.password = password; // This will be hashed by the pre-save hook
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password has been reset successfully. You can now login with your new password.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while resetting your password.",
      });
    }
  }
);

// Email verification endpoints with improved error handling
router.post("/send-verification", verificationLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if email already exists in registrations
    const existingRegistration = await Registration.findOne({
      email: email.toLowerCase(),
    });
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Store verification code with expiration (10 minutes)
    const verificationData = {
      email: email.toLowerCase(),
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
    };

    // Remove existing verification for this email
    await Verification.deleteOne({ email: email.toLowerCase() });

    // Save new verification
    await Verification.create(verificationData);

    // Send verification email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">IEDC LBSCEK</h1>
          <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Verify Your Email Address</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with IEDC LBSCEK! To complete your registration, 
            please enter the verification code below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: white; padding: 20px; border-radius: 10px; border: 2px solid #667eea; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${verificationCode}</span>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, 
            please ignore this email.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 14px;">
              Best regards,<br>
              IEDC LBSCEK Team
            </p>
          </div>
        </div>
      </div>
    `;

    // Send verification email with improved error handling
    const emailResult = await sendEmailSafely(sendEmail, {
      to: email,
      subject: "IEDC LBSCEK - Email Verification Code",
      html: emailContent,
    });

    if (emailResult.success) {
      res.json({
        success: true,
        message: "Verification code sent successfully",
      });
    } else {
      // Still return success to user since verification code is stored
      res.json({
        success: true,
        message:
          "Verification code generated. Email delivery may be delayed - please try again if you don't receive it.",
        warning: "Email service temporarily unavailable",
      });
    }
  } catch (error) {
    console.error("Error in send-verification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process verification request",
    });
  }
});

// Test email endpoint (for debugging production email issues)
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for testing",
      });
    }

    console.log(`🧪 Testing email service to: ${email}`);

    const testResult = await sendEmailSafely(sendEmail, {
      to: email,
      subject: "IEDC LBSCEK - Email Service Test",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #e74c3c;">Email Test Successful!</h1>
          <p>If you receive this email, the email service is working properly.</p>
          <p>Test timestamp: ${new Date().toISOString()}</p>
          <p>Environment: ${process.env.NODE_ENV || "development"}</p>
        </div>
      `,
    });

    res.json({
      success: testResult.success,
      message: testResult.success
        ? "Test email sent successfully"
        : "Test email failed",
      details: {
        service: testResult.service,
        messageId: testResult.messageId,
        error: testResult.error,
      },
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.status(500).json({
      success: false,
      message: "Test email failed",
      error: error.message,
    });
  }
});

// Enhanced email service status endpoint
router.get("/email-service-status", async (req, res) => {
  try {
    console.log("🔍 Checking email service status...");

    // Test all available email services
    const serviceStatus = await testEmailService();

    // Determine overall status
    const hasWorkingService = Object.values(serviceStatus).some(Boolean);

    res.json({
      success: true,
      message: hasWorkingService
        ? "Email services available"
        : "No email services available",
      services: serviceStatus,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Email service status check failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check email service status",
      error: error.message,
    });
  }
});

// Verify email endpoint
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const verification = await Verification.findOne({
      email: email.toLowerCase(),
    });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "Verification code not found or expired",
      });
    }

    // Check if expired
    if (verification.isExpired()) {
      await Verification.deleteOne({ _id: verification._id });
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    // Check attempts
    if (verification.maxAttemptsReached()) {
      await Verification.deleteOne({ _id: verification._id });
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new code",
      });
    }

    // Verify code
    if (verification.code !== code) {
      // Increment attempts
      await verification.incrementAttempts();

      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
        attemptsLeft: Math.max(0, 3 - (verification.attempts + 1)),
      });
    }

    // Code is valid - delete verification record
    await Verification.deleteOne({ _id: verification._id });

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
});

export default router;
