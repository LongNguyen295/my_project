import mongoose from "mongoose";

// Định nghĩa schema cho Song
const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true // URL của ảnh được lưu trên Cloudinary
    },
    file: {
        type: String,
        required: true // URL của file âm thanh được lưu trên Cloudinary
    },
    duration: {
        type: String,
        required: true // Thời lượng của bài hát
    },
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

// Tạo model cho Song
const songModel = mongoose.model("Song", songSchema);

export default songModel;
