// mongodb.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        // Sử dụng sự kiện để theo dõi trạng thái kết nối
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connection established successfully.");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB connection disconnected.");
        });

        // Kết nối tới MongoDB Atlas
        await mongoose.connect(process.env.MONGODB_URI_SRV, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

// Xử lý kết nối ngắt khi thoát ứng dụng
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
});

export default connectDB;
