import cloudinary from "../config/cloudinary.js";

/**
 * Upload an image to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - The folder path in Cloudinary (e.g., 'iedc/profile-photos', 'iedc/id-photos')
 * @param {string} originalName - Original filename for reference
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadToCloudinary = async (fileBuffer, folder, originalName) => {
  try {
    // Convert buffer to base64 string
    const base64String = `data:image/jpeg;base64,${fileBuffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      public_id: `${Date.now()}_${originalName.replace(/\.[^/.]+$/, "")}`,
      resource_type: "image",
      transformation: [
        { quality: "auto:good" }, // Optimize quality
        { fetch_format: "auto" }, // Auto-format (WebP if supported)
      ],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new Error("Failed to delete image.");
  }
};

/**
 * Get optimized URL for an image
 * @param {string} publicId - The public ID of the image
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: "auto:good",
    fetch_format: "auto",
    ...options,
  };

  return cloudinary.url(publicId, defaultOptions);
};
