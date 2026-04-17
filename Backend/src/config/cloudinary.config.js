const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a buffer directly to Cloudinary (returns secure_url)
const uploadBufferToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "resumes",
        resource_type: "raw", // Required for PDFs and DOCX
        access_mode: "public", // Ensure URL is publicly accessible
        public_id: `resume_${Date.now()}_${originalname.replace(/[^a-zA-Z0-9]/g, "_")}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

module.exports = { cloudinary, uploadBufferToCloudinary };
