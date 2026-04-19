import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { generatePlaylistFromMood } from './services/geminiServices.js';

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Mood Playlist Generator API is running!');
});

//GEMINI TESTING ROUTE - delete after done testing
app.get('/test/gemini', async (req, res) => {
  //mood for url query ex. http://localhost:3000/test/gemini?mood=happy%20upbeat%20summer%20vibes
  //this give "happy upbeat summer vibes" as a request 
  const mood = req.query.mood; 
  
  try {
    const playlist = await generatePlaylistFromMood(mood);
    res.json({ mood, playlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate playlist' });
  }
});

app.listen(app.get('port'), () => {
  console.log(`Server is running at http://localhost:${app.get('port')}`);
});