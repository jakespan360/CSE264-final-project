import express from 'express';
import { generatePlaylistFromMood } from '../services/aiServices.js';

const router = express.Router();

// AI test route
// mood for url query ex. http://localhost:3000/test/ai?mood=happy%20upbeat%20summer%20vibes
router.get('/ai', async (req, res) => {
  const mood = req.query.mood || 'happy';

  try {
    const playlist = await generatePlaylistFromMood(mood);
    res.json({ mood, playlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate playlist' });
  }
});

export default router;
