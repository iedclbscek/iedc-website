// Example: Modified user upload route using Cloudinary
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for memory storage (not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Upload profile picture to Cloudinary
router.put(
  "/upload-profile-picture",
  authenticateToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "iedc/profiles", // Organize files in folders
              public_id: `profile_${req.user.id}_${Date.now()}`, // Unique filename
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

      // Update user profile with new image URL
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          profilePicture: result.secure_url, // Cloudinary HTTPS URL
          profilePicturePublicId: result.public_id, // Store for deletion later
        },
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Profile picture uploaded successfully",
        user,
        imageUrl: result.secure_url,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading profile picture",
        error: error.message,
      });
    }
  }
);

export default router;
