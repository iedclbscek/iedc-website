import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but unique non-null values
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      ],
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
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: [
        "admin",
        "nodal_officer",
        "ceo",
        "lead",
        "co_lead",
        "coordinator",
        "member",
      ],
      default: "member",
    },
    // Year-specific roles for multi-year members
    yearlyRoles: [
      {
        year: {
          type: Number,
          required: true,
        },
        role: {
          type: String,
          enum: [
            "admin",
            "nodal_officer",
            "ceo",
            "lead",
            "co_lead",
            "coordinator",
            "member",
          ],
          required: true,
        },
        teamRole: {
          type: String,
          trim: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    // Global order for team display (fallback)
    displayOrder: {
      type: Number,
      default: 0,
    },
    teamRole: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: [1, "Year must be between 1 and 4"],
      max: [4, "Year must be between 1 and 4"],
    },
    teamYear: {
      type: String,
      default: "2025",
    },
    teamYears: {
      type: [Number],
      default: function () {
        return [new Date().getFullYear()];
      },
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Team member must be associated with at least one year",
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          // Allow empty strings or valid URLs
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "LinkedIn must be a valid URL if provided",
      },
    },
    github: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          // Allow empty strings or valid URLs
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "GitHub must be a valid URL if provided",
      },
    },
    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's been modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
