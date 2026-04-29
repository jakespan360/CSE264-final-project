import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { getUserPlaylists } from '../services/spotify';

export default function History() {
  const [session, setSession] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    getUserPlaylists()
      .then(setPlaylists)
      .catch(() => setError('Failed to load your playlists.'))
      .finally(() => setLoading(false));
  }, [session]);

  if (!session) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p>Connect your Spotify account on the Dashboard to view your history.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Your Playlists</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : playlists.length === 0 ? (
        <p style={{ color: '#b3b3b3', marginTop: '2rem', textAlign: 'center' }}>
          No playlists saved yet. Generate one on the Dashboard!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '1rem' }}>
          {playlists.map((p) => (
            <div key={p.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              backgroundColor: '#121212',
              border: '1px solid #282828',
              borderRadius: '8px',
            }}>
              <div>
                <div style={{ fontWeight: '600', color: '#fff' }}>{p.playlist_name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                  {new Date(p.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  {' · '}
                  {Array.isArray(p.songs) ? p.songs.length : 0} songs
                </div>
              </div>
              {p.spotify_playlist_url && (
                <a
                  href={p.spotify_playlist_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#1db954',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    marginLeft: '1rem',
                  }}
                >
                  Open in Spotify
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
