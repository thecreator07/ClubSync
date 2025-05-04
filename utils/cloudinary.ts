import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload avatar to Cloudinary
const uploadOnCloudinary = async (localfilePath: string) => {
  try {
    if (!localfilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",  // Auto determines the type of file (image, video, etc.)
    });

    // Remove the local file after uploading
    fs.unlinkSync(localfilePath);

    // Return Cloudinary response (URL, etc.)
    return response;
  } catch (error) {
    fs.unlinkSync(localfilePath);  // Remove the file if upload fails
    console.error("Upload operation failed", error);
    return null;
  }
};

// Delete avatar from Cloudinary
const deleteFromCloudinary= async (oldAvatarUrl: string) => {
  try {
    if (!oldAvatarUrl) return null;

    // Extract public ID from the Cloudinary URL
    const avatarArray = oldAvatarUrl.split("/");
    const publicId = avatarArray[avatarArray.length - 1].split(".")[0];

    // Delete the avatar using its public ID
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",  // Specify that it's an image
    });

    console.log("Old avatar deleted:", response.result);
  } catch (error) {
    console.error("Old avatar deletion failed", error);
    return null;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
