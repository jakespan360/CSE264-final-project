import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function savePlaylist({ spotifyUserId, playlistName, spotifyPlaylistId, spotifyPlaylistUrl, mood, songs }) {
  const { rows } = await pool.query(
    `INSERT INTO playlists (spotify_user_id, playlist_name, spotify_playlist_id, spotify_playlist_url, mood, songs)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [spotifyUserId, playlistName, spotifyPlaylistId, spotifyPlaylistUrl, mood, JSON.stringify(songs)]
  );
  return rows[0];
}

export async function getUserPlaylists(spotifyUserId) {
  const { rows } = await pool.query(
    `SELECT * FROM playlists WHERE spotify_user_id = $1 ORDER BY created_at DESC`,
    [spotifyUserId]
  );
  return rows;
}
