import express from 'express';
import { generatePlaylistFromMood } from '../services/geminiServices.js';
import { searchTrack, getSpotifyProfile, createPlaylist, addTracksToPlaylist } from '../services/spotifyServices.js';
import { savePlaylist, getUserPlaylists } from '../services/db/postgres.js';

const router = express.Router();

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

// 1.3 Generate (Gemini + Spotify Search)
router.post('/generate', async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const rawSongs = await generatePlaylistFromMood(req.body.mood);
    
    const enrichedTracks = [];
    for (const song of rawSongs) {
      const trackData = await searchTrack(`${song.title} ${song.artist}`, token);
      if (trackData) enrichedTracks.push({ ...song, uri: trackData.uri, imageUrl: trackData.imageUrl, spotifyUrl: trackData.external_urls.spotify });
    }
    
    res.json({ playlist: enrichedTracks });
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
});

// 1.4 Save Playlist to Spotify + persist to DB
router.post('/save', async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const { name, uris, position } = req.body;

    if (!Array.isArray(uris) || uris.length === 0) {
      return res.status(400).json({ error: 'uris must be a non-empty array' });
    }

    const cleanedUris = uris.filter((u) => typeof u === 'string' && u.startsWith('spotify:'));
    if (cleanedUris.length === 0) {
      return res.status(400).json({ error: 'No valid Spotify URIs provided' });
    }

    const playlist = await createPlaylist(null, name || 'Mood Playlist', token);
    const addResult = await addTracksToPlaylist(playlist.id, cleanedUris, token, position);

    res.status(201).json({
      playlistId: playlist.id,
      url: playlist.external_urls?.spotify,
      ...addResult,
    });
  } catch (error) {
    console.error('[POST /api/playlists/save]', error?.status, error?.message, error?.details);
    res.status(error.status || 500).json({
      error: error.message || 'Failed to save to Spotify',
      details: error.details || null,
    });
  }
});

// 2.3 Get user's playlist history
router.get('/history', async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const user = await getSpotifyProfile(token);
    const playlists = await getUserPlaylists(user.id);

    res.json({ playlists });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch playlist history' });
  }
});

export default router;