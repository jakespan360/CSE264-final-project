import express from 'express';
import { generatePlaylistFromMood } from '../services/aiServices.js';
import { searchTrack, getSpotifyProfile, createPlaylist, addTracksToPlaylist } from '../services/spotifyServices.js';
import { savePlaylist, getUserPlaylists, getAllPlaylists } from '../services/db/postgres.js';

const router = express.Router();

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

// Generate (AI + Spotify Search)
router.post('/generate', async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const { mood } = req.body;
    if (!mood || !mood.trim()) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    console.log('[Generate] Processing mood:', mood);
    const rawSongs = await generatePlaylistFromMood(mood);
    console.log('[Generate] Got songs:', rawSongs.length);

    const results = await Promise.all(
      rawSongs.map((song) => searchTrack(`${song.title} ${song.artist}`, token))
    );
    const enrichedTracks = results
      .map((trackData) => {
        if (!trackData) return null;
        return {
          title: trackData.title,
          artist: trackData.artist,
          uri: trackData.uri,
          imageUrl: trackData.imageUrl,
          spotifyUrl: trackData.external_urls.spotify,
        };
      })
      .filter(Boolean);

    console.log('[Generate] Enriched tracks:', enrichedTracks.length);
    res.json({ playlist: enrichedTracks });
  } catch (error) {
    console.error('[POST /api/playlists/generate]', error);
    res.status(500).json({ 
      error: error.message || 'Generation failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Save playlist to Spotify + persist to DB
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

    const [user, playlist] = await Promise.all([
      getSpotifyProfile(token),
      createPlaylist(null, name || 'Mood Playlist', token),
    ]);
    const addResult = await addTracksToPlaylist(playlist.id, cleanedUris, token);

    savePlaylist({
      spotifyUserId: user.id,
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

// Get current user's playlists
router.get('/mine', async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const user = await getSpotifyProfile(token);
    const playlists = await getUserPlaylists(user.id);
    res.json({ playlists });
  } catch (error) {
    console.error('Mine error:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Get all playlists (admin)
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
