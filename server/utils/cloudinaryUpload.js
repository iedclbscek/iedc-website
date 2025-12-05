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
    // Check if Cloudinary credentials are set
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === "placeholder" ||
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY === "placeholder"
    ) {
      console.warn("⚠️ Cloudinary credentials not set. Using mock URL.");
      return {
        url: "https://placehold.co/600x400?text=Payment+Proof",
        public_id: `mock_${Date.now()}`,
        format: "jpg",
        size: 1024,
      };
    }

    // Convert buffer to base64 string
    const base64String = `data:image/jpeg;base64,${fileBuffer.toString(
      "base64"
    )}`;

    // Ensure Cloudinary is configured with latest env vars (fixes hoisting issues)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Sanitize public_id: remove spaces and special chars, keep alphanumeric, underscores, and hyphens
    const sanitizedName = originalName
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9-_]/g, "_"); // Replace non-alphanumeric chars with underscore

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      public_id: `${Date.now()}_${sanitizedName}`,
      resource_type: "image",
      // Remove transformation from upload call to avoid signature issues with some SDK versions
      // We can apply transformations when displaying the image instead
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
