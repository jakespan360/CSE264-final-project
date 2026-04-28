import express from 'express';
import { generatePlaylistFromMood } from '../services/geminiServices.js';
import { searchTrack, createPlaylist, addTracksToPlaylist } from '../services/spotifyServices.js';
import { savePlaylist, getAllPlaylists } from '../services/db/postgres.js';

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

    const results = await Promise.all(
      rawSongs.map((song) => searchTrack(`${song.title} ${song.artist}`, token))
    );
    const enrichedTracks = rawSongs
      .map((song, i) => {
        const trackData = results[i];
        if (!trackData) return null;
        return { ...song, uri: trackData.uri, imageUrl: trackData.imageUrl, spotifyUrl: trackData.external_urls.spotify };
      })
      .filter(Boolean);

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

    const { name, uris, tracks } = req.body;

    if (!Array.isArray(uris) || uris.length === 0) {
      return res.status(400).json({ error: 'uris must be a non-empty array' });
    }

    const cleanedUris = uris.filter((u) => typeof u === 'string' && u.startsWith('spotify:'));
    if (cleanedUris.length === 0) {
      return res.status(400).json({ error: 'No valid Spotify URIs provided' });
    }

    const playlist = await createPlaylist(null, name || 'Mood Playlist', token);
    const addResult = await addTracksToPlaylist(playlist.id, cleanedUris, token);

    savePlaylist({
      playlistName: name || 'Mood Playlist',
      spotifyPlaylistUrl: playlist.external_urls?.spotify || '',
      songs: tracks || [],
    }).catch((err) => console.error('[DB savePlaylist]', err.message));

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

// 2.3 Get all playlist history (admin)
router.get('/history', async (_req, res) => {
  try {
    const playlists = await getAllPlaylists();
    res.json({ playlists });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch playlist history' });
  }
});

export default router;
