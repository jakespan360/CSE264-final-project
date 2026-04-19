import express from 'express';
import { generatePlaylistFromMood } from '../services/geminiServices.js';

const router = express.Router();

//GEMINI TESTING ROUTE
//This will be accessible at /test/gemini
//mood for url query ex. http://localhost:3000/test/gemini?mood=happy%20upbeat%20summer%20vibes
//this give "happy upbeat summer vibes" as a request 
router.get('/gemini', async (req, res) => {
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