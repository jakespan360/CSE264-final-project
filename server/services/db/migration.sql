CREATE TABLE IF NOT EXISTS playlists (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_name        TEXT NOT NULL,
  spotify_playlist_url TEXT NOT NULL,
  songs                JSONB NOT NULL DEFAULT '[]',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
