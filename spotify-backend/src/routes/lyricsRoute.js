// src/routes/lyricsRoute.js
import express from 'express';
import { getTrackAndLyrics } from '../controllers/lyricsController.js';

const router = express.Router();

// Định nghĩa route với trackId là tham số
router.get('/track/:trackId', getTrackAndLyrics);

export default router;
