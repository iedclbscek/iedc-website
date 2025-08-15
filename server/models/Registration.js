import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },

    // Academic Information
    admissionNo: {
      type: String,
      required: [true, "Admission number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: [
          "Computer Science & Engineering",
          "Electronics & Communication Engineering",
          "Electrical & Electronics Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Applied Science",
          "Other",
        ],
        message: "Please select a valid department",
      },
    },
    year: {
      type: String,
      required: [true, "Year of study is required"],
      enum: {
        values: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
        message: "Please select a valid year",
      },
    },
    semester: {
      type: String,
      required: [true, "Current semester is required"],
      enum: {
        values: [
          "1st Semester",
          "2nd Semester",
          "3rd Semester",
          "4th Semester",
          "5th Semester",
          "6th Semester",
          "7th Semester",
          "8th Semester",
        ],
        message: "Please select a valid semester",
      },
    },

    // Interests
    interests: [
      {
        type: String,
        enum: {
          values: [
            "Web Development",
            "Mobile App Development",
            "AI/ML",
            "Data Science",
            "Cybersecurity",
            "IoT",
            "Blockchain",
            "Cloud Computing",
            "UI/UX Design",
            "Digital Marketing",
            "Business Development",
            "Product Management",
            "Robotics",
            "3D Printing",
            "Game Development",
            "DevOps",
            "Other",
          ],
          message: "Please select valid interests",
        },
      },
    ],
    nonTechInterests: {
      type: String,
      trim: true,
      maxlength: [500, "Non-technical interests cannot exceed 500 characters"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },

    // Experience & Motivation
    experience: {
      type: String,
      trim: true,
      maxlength: [1000, "Experience description cannot exceed 1000 characters"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },
    motivation: {
      type: String,
      required: [true, "Motivation is required"],
      trim: true,
      maxlength: [1000, "Motivation cannot exceed 1000 characters"],
    },

    // Online Profiles
    linkedin: {
      type: String,
      trim: true,
      // relaxed during testing
      match: [/^https?:\/\/.+/, "Please enter a valid LinkedIn profile URL"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },
    github: {
      type: String,
      trim: true,
      // relaxed during testing
      match: [/^https?:\/\/.+/, "Please enter a valid GitHub profile URL"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },
    portfolio: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please enter a valid portfolio URL"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },

    // Photo URLs (optional during initial testing)
    profilePhoto: {
      type: String,
      default: null,
      match: [/^https?:\/\/.+/, "Please provide a valid image URL"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },
    idPhoto: {
      type: String,
      default: null,
      match: [/^https?:\/\/.+/, "Please provide a valid image URL"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },

    // Application Status
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Status must be pending, approved, or rejected",
      },
      default: "pending",
    },

    // Admin Notes
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
      set: (value) => (value && value.trim().length > 0 ? value : undefined),
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
registrationSchema.index({ email: 1 });
registrationSchema.index({ admissionNo: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ submittedAt: -1 });

// Virtual for full name
registrationSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
registrationSchema.set("toJSON", { virtuals: true });
registrationSchema.set("toObject", { virtuals: true });

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
