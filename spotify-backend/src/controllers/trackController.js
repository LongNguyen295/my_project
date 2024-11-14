import { v2 as cloudinary } from 'cloudinary';
import trackModel from '../models/trackModel.js';
import { getTrackInfo } from '../services/spotifyService.js';

const addTrack = async (req, res) => {
    try {
        const { spotifyTrackId } = req.body;
        const audioFile = req.files?.audio ? req.files.audio[0] : null;
        const imageFile = req.files?.image ? req.files.image[0] : null;

        // Lấy thông tin chi tiết từ Spotify
        const spotifyTrackData = await getTrackInfo(spotifyTrackId);

        // Tìm album hoặc tạo mới album nếu chưa tồn tại
        let albumId = null;
        if (spotifyTrackData?.album?.id) {
            let album = await albumModel.findOne({ spotifyId: spotifyTrackData.album.id });
            if (!album) {
                album = new albumModel({
                    spotifyId: spotifyTrackData.album.id,
                    name: spotifyTrackData.album.name,
                    release_date: spotifyTrackData.album.release_date,
                    total_tracks: spotifyTrackData.album.total_tracks,
                    external_urls: spotifyTrackData.album.external_urls.spotify,
                    spotifyData: spotifyTrackData.album
                });
                await album.save();
            }
            albumId = album._id;
        }

        // Upload audio lên Cloudinary (nếu có)
        let audioUploadResult = null;
        if (audioFile) {
            audioUploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: "video" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(audioFile.buffer);
            });
        }

        // Upload image lên Cloudinary (nếu có)
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

        // Dữ liệu để lưu track vào MongoDB
        const trackData = {
            spotifyId: spotifyTrackData.id,
            name: spotifyTrackData.name,
            album: albumId,
            duration: spotifyTrackData.duration_ms / 1000,
            artists: spotifyTrackData.artists.map(artist => artist.name),
            image: imageFile ? imageUploadResult?.secure_url : image, // Sử dụng URL từ body nếu không có file
            file: audioFile ? audioUploadResult?.secure_url : audio, // Sử dụng URL từ body nếu không có file
            external_urls: spotifyTrackData.external_urls.spotify,
            spotifyData: spotifyTrackData
        };

        const track = new trackModel(trackData);
        await track.save();

        res.json({ success: true, message: "Track added", track });
    } catch (error) {
        console.error("Error in addTrack:", error);
        res.status(500).json({ success: false, message: "An error occurred while adding the track" });
    }
};

// Hàm lấy danh sách track
const listTracks = async (req, res) => {
    try {
        const tracks = await trackModel.find();
        res.json(tracks);
    } catch (error) {
        console.error("Error in listTracks:", error);
        res.status(500).json({ success: false, message: "Failed to fetch tracks" });
    }
};

// Hàm xóa track
const removeTrack = async (req, res) => {
    const { trackId } = req.body;
    try {
        await trackModel.findByIdAndDelete(trackId);
        res.json({ success: true, message: "Track Removed" });
    } catch (error) {
        console.error("Error in removeTrack:", error);
        res.status(500).json({ success: false, message: "Failed to remove track" });
    }
};

// Hàm lấy thông tin track từ Spotify
const getSpotifyTrack = async (req, res) => {
    const { trackId } = req.params;
    try {
        const trackInfo = await getTrackInfo(trackId);
        res.json(trackInfo);
    } catch (error) {
        console.error("Error fetching track info:", error);
        res.status(500).json({ error: 'Failed to fetch track information' });
    }
};

export { addTrack, listTracks, removeTrack, getSpotifyTrack };
