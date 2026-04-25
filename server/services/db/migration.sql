CREATE TABLE IF NOT EXISTS playlists (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_user_id  TEXT NOT NULL,
  playlist_name    TEXT NOT NULL,
  spotify_playlist_id  TEXT NOT NULL,
  spotify_playlist_url TEXT NOT NULL,
  mood             TEXT NOT NULL,
  songs            JSONB NOT NULL DEFAULT '[]',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_playlists_spotify_user_id ON playlists (spotify_user_id);
