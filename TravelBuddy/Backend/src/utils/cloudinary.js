import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary = async (localFilePath, options = {}) => {
  try {
    if (!localFilePath) {
      console.error('No file path provided');
      return null;
    }

    console.log('Attempting to upload file:', localFilePath);

    // Check if file exists
    try {
      await fs.access(localFilePath);
    } catch (error) {
      console.error('File does not exist:', localFilePath);
      return null;
    }

    // Default upload options
    const defaultOptions = {
      resource_type: 'auto',
      folder: 'chat-groups', // Organize uploads in folders
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'faces' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    };

    // Merge with custom options
    const uploadOptions = { ...defaultOptions, ...options };

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

    console.log('File uploaded successfully to Cloudinary:', response.secure_url);

    // Remove the locally saved temporary file
    try {
      await fs.unlink(localFilePath);
      console.log('Local temporary file removed:', localFilePath);
    } catch (unlinkError) {
      console.warn('Warning: Could not remove temporary file:', unlinkError.message);
    }

    return response;

  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);

    // Attempt to remove the locally saved temporary file in case of error
    try {
      await fs.access(localFilePath);
      await fs.unlink(localFilePath);
      console.log('Local temporary file cleaned up after error:', localFilePath);
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError.message);
    }

    return null;
  }
};

// Helper function for deleting files from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.error('No public ID provided for deletion');
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log('File deleted from Cloudinary:', result);
    return result;

  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return null;
  }
};

// Helper function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  try {
    if (!url || !url.includes('cloudinary.com')) {
      return null;
    }

    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];

    // Include folder path if exists
    const folderIndex = parts.indexOf('chat-groups');
    if (folderIndex !== -1) {
      return `chat-groups/${publicId}`;
    }

    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

export default uploadOnCloudinary;