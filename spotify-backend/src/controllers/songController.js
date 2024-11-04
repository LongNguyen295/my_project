import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;
        const audioFile = req.files?.audio ? req.files.audio[0] : null;
        const imageFile = req.files?.image ? req.files.image[0] : null;

        if (!audioFile || !imageFile) {
            return res.status(400).json({ success: false, message: "Audio or image file is missing" });
        }

        // Function to handle Cloudinary upload and return secure URL
        const uploadToCloudinary = (fileBuffer, resourceType) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: resourceType },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(fileBuffer);
            });
        };

        // Upload audio and image
        const audioUploadResult = await uploadToCloudinary(audioFile.buffer, "video");
        const imageUploadResult = await uploadToCloudinary(imageFile.buffer, "image");

        // Calculate duration
        const duration = audioUploadResult.duration
            ? `${Math.floor(audioUploadResult.duration / 60)}:${Math.floor(audioUploadResult.duration % 60)}`
            : "0:00";

        // Prepare song data
        const songData = {
            name,
            desc,
            album,
            image: imageUploadResult.secure_url,
            file: audioUploadResult.secure_url,
            duration
        };

        // Save to MongoDB
        const song = new songModel(songData);
        await song.save();

        res.json({ success: true, message: "Song Added" });
    } catch (error) {
        console.error("Error in addSong:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the song" });
    }
};

const listSong = async (req, res) => {
    try {
        // Populate để lấy thông tin album
        const allSongs = await songModel.find({}).populate('album');
        res.json({ success: true, songs: allSongs });
    } catch (error) {
        console.error("Error in listSong:", error);
        res.status(500).json({ success: false, message: "An error occurred while listing songs" });
    }
};

const removeSong = async (req, res) => {
    try {
        const song = await songModel.findById(req.body.id);

        if (!song) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        // Delete files from Cloudinary
        if (song.file) await cloudinary.uploader.destroy(song.file, { resource_type: "video" });
        if (song.image) await cloudinary.uploader.destroy(song.image, { resource_type: "image" });

        await songModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Song removed" });
    } catch (error) {
        console.error("Error in removeSong:", error);
        res.status(500).json({ success: false, message: "An error occurred while removing the song" });
    }
};

export { addSong, listSong, removeSong };
