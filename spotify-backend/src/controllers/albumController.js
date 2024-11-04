import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

// Hàm thêm album mới
const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body;
        const imageFile = req.file;

        // Kiểm tra nếu file ảnh không tồn tại trong yêu cầu
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is missing" });
        }

        // Upload ảnh lên Cloudinary sử dụng promise
        const imageUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(imageFile.buffer); // Kết thúc stream với buffer của ảnh
        });

        // Dữ liệu album cần lưu vào MongoDB
        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url, // Sử dụng URL bảo mật từ Cloudinary
        };

        // Tạo và lưu album vào MongoDB
        const album = new albumModel(albumData);
        await album.save(); // Lưu album vào cơ sở dữ liệu

        // Trả về phản hồi thành công
        res.json({ success: true, message: "Album added", album });
    } catch (error) {
        console.error("Error in addAlbum:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "An error occurred while adding the album" });
        }
    }
};

// Hàm lấy danh sách album
const listAlbums = async (req, res) => {
    try {
        const allAlbums = await albumModel.find({}); // Truy vấn tất cả album từ MongoDB
        res.json({ success: true, albums: allAlbums }); // Trả về danh sách album
    } catch (error) {
        console.error("Error in listAlbums:", error);
        res.status(500).json({ success: false, message: "An error occurred while listing albums" });
    }
};

// Hàm xóa album
const removeAlbum = async (req, res) => {
    try {
        // Tìm album theo id được gửi trong body
        const album = await albumModel.findById(req.body.id);

        // Kiểm tra nếu album không tồn tại
        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found" });
        }

        // Xóa album khỏi cơ sở dữ liệu
        await albumModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Album removed" });
    } catch (error) {
        console.error("Error in removeAlbum:", error);
        res.status(500).json({ success: false, message: "An error occurred while removing the album" });
    }
};

export { addAlbum, listAlbums, removeAlbum };
