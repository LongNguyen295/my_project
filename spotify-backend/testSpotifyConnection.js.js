import { getTrackInfo, searchSpotify } from './src/services/spotifyService.js';

async function testSpotifyConnection() {
  try {
    // Kiểm tra bằng cách tìm kiếm bài hát
    const searchResult = await searchSpotify('Bohemian Rhapsody', 'track');
    console.log('Spotify Search Result:', searchResult);

    // Nếu tìm thấy một bài hát, thử lấy thông tin chi tiết của nó
    if (searchResult && searchResult.tracks && searchResult.tracks.items.length > 0) {
      const trackId = searchResult.tracks.items[0].id;
      const trackInfo = await getTrackInfo(trackId);
      console.log('Track Info:', trackInfo);
    } else {
      console.log('No tracks found');
    }
  } catch (error) {
    console.error('Error connecting to Spotify API:', error);
  }
}

testSpotifyConnection();
