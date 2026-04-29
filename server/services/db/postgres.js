import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function savePlaylist({ spotifyUserId, playlistName, spotifyPlaylistUrl, songs }) {
  const { rows } = await pool.query(
    `INSERT INTO playlists (spotify_user_id, playlist_name, spotify_playlist_url, songs)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [spotifyUserId, playlistName, spotifyPlaylistUrl, JSON.stringify(songs)]
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

export async function getAllPlaylists() {
  const { rows } = await pool.query(
    `SELECT * FROM playlists ORDER BY created_at DESC`
  );
  return rows;
}
