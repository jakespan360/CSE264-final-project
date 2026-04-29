import { useState, useEffect } from 'react';
import { getPlaylistHistory } from '../services/spotify';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password');
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    getPlaylistHistory()
      .then(setPlaylists)
      .catch(() => setFetchError('Failed to load playlists'))
      .finally(() => setLoading(false));
  }, [authed]);

  if (!authed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          <button type="submit">Login</button>
          {loginError && <p style={{ color: 'red', textAlign: 'center', margin: 0 }}>{loginError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Admin Panel</h2>
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : playlists.length === 0 ? (
        <p style={{ color: '#b3b3b3', marginTop: '2rem', textAlign: 'center' }}>No playlists yet</p>
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
                  {' · '}
                  {p.spotify_user_id}
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
