// Import các thư viện cần thiết
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Tải các biến môi trường từ file .env

// Hàm tìm kiếm bài hát trên Genius để lấy URL lời bài hát
export async function getLyricsUrl(trackName, artistName) {
    const accessToken = process.env.GENIUS_ACCESS_TOKEN;

    try {
        const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(trackName)} ${encodeURIComponent(artistName)}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching lyrics URL:", errorData);
            throw new Error("Failed to fetch lyrics URL");
        }

        const data = await response.json();
        if (data.response.hits.length > 0) {
            // Lấy URL của bài hát đầu tiên trong kết quả tìm kiếm
            return data.response.hits[0].result.url;
        } else {
            console.log("No lyrics found for this song.");
            return null;
        }
    } catch (error) {
        console.error("Error in getLyricsUrl:", error);
        throw error;
    }
}
