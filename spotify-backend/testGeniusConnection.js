import { getLyricsUrl } from './src/services/geniusService.js';

async function testGeniusConnection() {
  try {
    // Tìm kiếm URL lời bài hát của "Bohemian Rhapsody"
    const lyricsUrl = await getLyricsUrl('Bohemian Rhapsody', 'Queen');
    if (lyricsUrl) {
      console.log('Genius Lyrics URL:', lyricsUrl);
    } else {
      console.log('No lyrics found');
    }
  } catch (error) {
    console.error('Error connecting to Genius API:', error);
  }
}

testGeniusConnection();
