const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINART_NAME,
    api_key: process.env.CLOUDINART_API_KEY,
    api_secret: process.env.CLOUDINART_API_SECRET,
});

// Configure Cloudinary storage for multer
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Optional: Specify a folder in your Cloudinary account
        resource_type: (req, file) => {
            return file.mimetype.startsWith('video') ? 'video' : 'image';
        },
        // Optional: You can add more transformations or configurations here
    },
});

// Create the multer middleware using Cloudinary storage
const multerMiddleware = multer({ storage: cloudinaryStorage });

const uploadFileToCloudinary = (file) => {
    // This function is no longer needed if you are using the multerMiddleware with CloudinaryStorage
    // Multer will directly upload to Cloudinary.
    // If you have specific post-upload logic, you can access the Cloudinary result
    // in your route handler after the multer middleware.

    return new Promise((resolve, reject) => {
        const options = {
            resource_type: file.mimetype.startsWith('video') ? 'video' : 'image'
        };

        if (file.mimetype.startsWith('video')) {
            cloudinary.uploader.upload_large(file.path, options, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        } else {
            cloudinary.uploader.upload(file.path, options, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        }
    });
};

module.exports = { multerMiddleware, uploadFileToCloudinary };