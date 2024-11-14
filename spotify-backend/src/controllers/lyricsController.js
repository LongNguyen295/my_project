// src/controllers/lyricsController.js
import { getTrackInfo } from '../services/spotifyService.js';
import { getLyricsUrl } from '../services/geniusService.js';

export const getTrackAndLyrics = async (req, res) => {
    try {
        const { trackId } = req.params;
        
        // Lấy thông tin bài hát từ Spotify
        const trackInfo = await getTrackInfo(trackId);
        const trackName = trackInfo.name;
        const artistName = trackInfo.artists[0].name;

        // Lấy URL lời bài hát từ Genius
        const lyricsUrl = await getLyricsUrl(trackName, artistName);

        res.status(200).json({
            trackInfo,
            lyricsUrl: lyricsUrl || "Lời bài hát không tìm thấy"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
