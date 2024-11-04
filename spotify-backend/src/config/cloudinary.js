// cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log('Cloudinary connected');
    } catch (error) {
        console.error('Cloudinary connection error:', error);
    }
};

export default connectCloudinary;
