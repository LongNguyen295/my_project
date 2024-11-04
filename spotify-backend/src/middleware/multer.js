import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const allowedExtensions = /\.(jpeg|jpg|png|gif|mp3|wav)$/;
    const mimetype = file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/');

    if (allowedExtensions.test(file.originalname.toLowerCase()) && mimetype) {
        callback(null, true);
    } else {
        callback(new Error(`Only the following file types are allowed: jpeg, jpg, png, gif, mp3, wav. You uploaded: ${file.originalname}`));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn file 50MB
    fileFilter: fileFilter,
});

export default upload;
