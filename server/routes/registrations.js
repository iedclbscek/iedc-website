import express from "express";
import { body, validationResult } from "express-validator";
import Registration from "../models/Registration.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import { sendMembershipIdEmail } from "../utils/emailService.js";

const router = express.Router();

// Validation middleware for registration
const validateRegistration = [
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be less than 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be less than 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("phone")
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
  body("admissionNo")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage("Admission number must not be empty if provided"),
  body("referralCode")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "Referral code is required and must be less than 50 characters"
    ),
  body("department")
    .isIn([
      "Computer Science and Engineering",
      "Computer Science and Business Systems",
      "Computer Science and Engineering(AI & Data Science)",
      "Electrical and Electronics Engineering",
      "Electronics and Communication Engineering",
      "Information Technology",
      "Mechanical Engineering",
      "Civil Engineering",
    ])
    .withMessage("Valid department is required"),
  body("yearOfJoining")
    .isIn(["2022", "2023", "2024", "2025"])
    .withMessage("Valid year of joining is required"),
  body("semester")
    .isIn([
      "1st Semester",
      "2nd Semester",
      "3rd Semester",
      "4th Semester",
      "5th Semester",
      "6th Semester",
      "7th Semester",
      "8th Semester",
    ])
    .withMessage("Valid semester is required"),
  body("interests").isArray().withMessage("Interests must be an array"),
  body("motivation")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage(
      "Motivation is required and must be less than 1000 characters"
    ),
  // Temporarily optional while testing without uploads
  body("profilePhoto")
    .optional()
    .isURL()
    .withMessage("Valid profile photo URL is required"),
  body("idPhoto")
    .optional()
    .isURL()
    .withMessage("Valid ID photo URL is required"),
];

// POST /api/registrations - Submit new registration
router.post("/", validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Check if email already exists
    const existingEmail = await Registration.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if admission number already exists (only if provided)
    if (req.body.admissionNo) {
      const existingAdmission = await Registration.findOne({
        admissionNo: req.body.admissionNo,
      });
      if (existingAdmission) {
        return res.status(400).json({
          success: false,
          message: "Admission number already registered",
        });
      }
    }

    // Remove empty or null admissionNo to avoid duplicate key error
    if (req.body.admissionNo === "" || req.body.admissionNo == null) {
      delete req.body.admissionNo;
    }
    // Create new registration
    const registration = new Registration(req.body);
    await registration.save();

    // Send membership ID email
    try {
      await sendMembershipIdEmail(
        registration.email,
        `${registration.firstName} ${registration.lastName}`,
        registration.membershipId
      );
    } catch (emailError) {
      console.error("Failed to send membership ID email:", emailError);
      // Do not fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: "Registration submitted successfully",
      data: {
        id: registration._id,
        membershipId: registration.membershipId,
        status: registration.status,
        submittedAt: registration.submittedAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((e) => ({
          msg: e.message,
          path: e.path,
        })),
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/registrations - Get all registrations (admin only)
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status, department, search } = req.query;

      // Build query
      let query = {};

      if (status) query.status = status;
      if (department) query.department = department;
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { admissionNo: { $regex: search, $options: "i" } },
        ];
      }

      const registrations = await Registration.find(query)
        .sort({ submittedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select("-__v");

      const total = await Registration.countDocuments(query);

      res.json({
        success: true,
        data: registrations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get registrations error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// GET /api/registrations/:id - Get specific registration (admin only)
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const registration = await Registration.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      res.json({
        success: true,
        data: registration,
      });
    } catch (error) {
      console.error("Get registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// PUT /api/registrations/:id/status - Update registration status (admin only)
router.put(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin"),
  [
    body("status")
      .isIn(["pending", "approved", "rejected"])
      .withMessage("Valid status is required"),
    body("adminNotes")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Admin notes must be less than 1000 characters"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { status, adminNotes } = req.body;

      const registration = await Registration.findByIdAndUpdate(
        req.params.id,
        {
          status,
          adminNotes,
          reviewedAt: new Date(),
          reviewedBy: req.user._id,
        },
        { new: true, runValidators: true }
      );

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      res.json({
        success: true,
        message: "Registration status updated successfully",
        data: registration,
      });
    } catch (error) {
      console.error("Update registration status error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// DELETE /api/registrations/:id - Delete registration (admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const registration = await Registration.findByIdAndDelete(req.params.id);
      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      res.json({
        success: true,
        message: "Registration deleted successfully",
      });
    } catch (error) {
      console.error("Delete registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

export default router;


