import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is missing" });
        }

        // Upload image to Cloudinary using a promise
        const imageUpload = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(imageFile.buffer); // End the stream with the image buffer
        });

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url, // Use the secure URL of the uploaded image
        };

        const album = new albumModel(albumData);
        await album.save(); // Save the album to MongoDB

        res.json({ success: true, message: "Album added", album }); // Respond with success message
    } catch (error) {
        console.error("Error in addAlbum:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "An error occurred while adding the album" });
        }
    }
};

const listAlbums = async (req, res) => {
    try {
        const allAlbums = await albumModel.find({}); // Retrieve all albums from MongoDB
        res.json({ success: true, albums: allAlbums }); // Respond with the list of albums
    } catch (error) {
        console.error("Error in listAlbums:", error);
        res.status(500).json({ success: false, message: "An error occurred while listing albums" });
    }
};

const removeAlbum = async (req, res) => {
    try {
        const album = await albumModel.findById(req.body.id);

        if (!album) {
            return res.status(404).json({ success: false, message: "Album not found" });
        }

        // Remove the album from the database
        await albumModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Album removed" });
    } catch (error) {
        console.error("Error in removeAlbum:", error);
        res.status(500).json({ success: false, message: "An error occurred while removing the album" });
    }
};

export { addAlbum, listAlbums, removeAlbum };
