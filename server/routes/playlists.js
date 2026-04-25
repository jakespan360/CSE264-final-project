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
      if (trackData) enrichedTracks.push({ ...song, uri: trackData.uri, spotifyUrl: trackData.external_urls.spotify });
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

    const { name, mood, tracks, uris } = req.body;

    const user = await getSpotifyProfile(token);
    const playlist = await createPlaylist(user.id, name || 'Mood Playlist', token);
    await addTracksToPlaylist(playlist.id, uris, token);

    await savePlaylist({
      spotifyUserId: user.id,
      playlistName: name || 'Mood Playlist',
      spotifyPlaylistId: playlist.id,
      spotifyPlaylistUrl: playlist.external_urls.spotify,
      mood: mood || '',
      songs: tracks || [],
    });

    res.json({ url: playlist.external_urls.spotify });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: 'Failed to save to Spotify' });
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