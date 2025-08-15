import express from "express";
import upload from "../middleware/upload.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

const router = express.Router();

// POST /api/upload/images - Upload images to Cloudinary
router.post(
  "/images",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "idPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Upload route hit");
      console.log("Request body:", req.body);
      console.log("Request files:", req.files);

      const files = req.files;
      const uploadResults = {};

      // Upload profile photo if provided
      if (files.profilePhoto && files.profilePhoto[0]) {
        const profilePhoto = files.profilePhoto[0];
        const result = await uploadToCloudinary(
          profilePhoto.buffer,
          "iedc/profile-photos",
          profilePhoto.originalname
        );
        uploadResults.profilePhoto = result;
      }

      // Upload ID photo if provided
      if (files.idPhoto && files.idPhoto[0]) {
        const idPhoto = files.idPhoto[0];
        const result = await uploadToCloudinary(
          idPhoto.buffer,
          "iedc/id-photos",
          idPhoto.originalname
        );
        uploadResults.idPhoto = result;
      }

      res.json({
        success: true,
        message: "Images uploaded successfully",
        data: uploadResults,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to upload images",
      });
    }
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  console.log("Multer error:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size too large. Maximum size is 5MB.",
    });
  }
  if (error.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      message: "Too many files. Maximum is 2 files.",
    });
  }

  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed!",
    });
  }

  res.status(500).json({
    success: false,
    message: "Upload failed",
    error: error.message,
  });
});

export default router;
