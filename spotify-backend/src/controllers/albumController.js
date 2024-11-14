import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';
import { getSpotifyAccessToken } from '../services/spotifyService.js';
import axios from 'axios';

// Hàm để lấy thông tin album từ Spotify API
const getSpotifyAlbumInfo = async (albumId) => {
    const token = await getSpotifyAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Hàm thêm album, có thể lấy thêm dữ liệu từ Spotify
const addAlbum = async (req, res) => {
    try {
        const { spotifyAlbumId } = req.body;
        const imageFile = req.file;

        // Lấy thông tin chi tiết từ Spotify
        const spotifyAlbumData = await getSpotifyAlbumInfo(spotifyAlbumId);

        // Upload ảnh lên Cloudinary nếu có
        let imageUploadResult = null;
        if (imageFile) {
            imageUploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(imageFile.buffer);
            });
        }

        // Dữ liệu để lưu album vào MongoDB
        const albumData = {
            spotifyId: spotifyAlbumData.id,
            name: spotifyAlbumData.name,
            release_date: spotifyAlbumData.release_date,
            artists: spotifyAlbumData.artists.map(artist => artist.name),
            total_tracks: spotifyAlbumData.total_tracks,
            external_urls: spotifyAlbumData.external_urls.spotify,
            image: imageUploadResult?.secure_url,
            spotifyData: spotifyAlbumData
        };

        const album = new albumModel(albumData);
        await album.save();

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
        const albums = await albumModel.find(); // Lấy tất cả album từ cơ sở dữ liệu
        res.json(albums);
    } catch (error) {
        console.error("Error in listAlbums:", error);
        res.status(500).json({ success: false, message: "Failed to fetch albums" });
    }
};

// Hàm xóa album dựa trên albumId từ URL params
const removeAlbum = async (req, res) => {
    const { albumId } = req.params; // ID album được truyền từ URL
    try {
        const deletedAlbum = await albumModel.findByIdAndDelete(albumId);
        if (deletedAlbum) {
            res.json({ success: true, message: "Album removed" });
        } else {
            res.status(404).json({ success: false, message: "Album not found" });
        }
    } catch (error) {
        console.error("Error in removeAlbum:", error);
        res.status(500).json({ success: false, message: "Failed to remove album" });
    }
};

export { addAlbum, listAlbums, removeAlbum };
