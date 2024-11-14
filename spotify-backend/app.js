// src/app.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import trackRouter from './src/routes/trackRoute.js';
import albumRouter from './src/routes/albumRoute.js';
import lyricsRoute from './src/routes/lyricsRoute.js';
import connectCloudinary from './src/config/cloudinary.js';
import connectDB from './src/config/mongodb.js';
import { searchSpotify } from './src/services/spotifyService.js'; // Import hàm searchSpotify
import trackModel from './src/models/trackModel.js'; // Import model trackModel để lưu dữ liệu vào MongoDB

const app = express();
const port = process.env.PORT || 4000;

// Kết nối tới cơ sở dữ liệu và Cloudinary
const startServer = async () => {
    try {
        await connectDB();
        connectCloudinary();

        app.use(express.json());
        app.use(cors());

        // Gắn các route vào ứng dụng
        app.use("/api/track", trackRouter); 
        app.use("/api/album", albumRouter);
        app.use("/api", lyricsRoute); 

        // Định nghĩa route tìm kiếm bài hát trên Spotify và lưu vào MongoDB
        app.get('/api/search', async (req, res) => {
            const { query, type } = req.query;
            try {
                const searchResults = await searchSpotify(query, type || 'track');

                // Lưu kết quả tìm kiếm vào MongoDB
                for (const track of searchResults.tracks.items) {
                    const trackData = {
                        spotifyId: track.id,
                        name: track.name,
                        desc: '',
                        album: track.album.id,
                        image: track.album.images[0]?.url || '',
                        file: '',
                        duration: track.duration_ms,
                        external_urls: track.external_urls,
                        artists: track.artists.map(artist => ({ name: artist.name, spotifyId: artist.id })),
                        spotifyData: track
                    };

                    // Kiểm tra và lưu vào DB nếu chưa tồn tại
                    const existingTrack = await trackModel.findOne({ spotifyId: track.id });
                    if (!existingTrack) {
                        const newTrack = new trackModel(trackData);
                        await newTrack.save();
                    }
                }

                res.status(200).json({ message: 'Search results saved successfully!', tracks: searchResults.tracks.items });
            } catch (error) {
                console.error("Error in search and save:", error);
                res.status(500).json({ error: 'Failed to fetch and save search results' });
            }
        });

        app.get('/', (req, res) => res.send("API is working"));

        app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1); 
    }
};

startServer();

export default app;
