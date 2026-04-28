import { useState, useEffect } from 'react';
import { getPlaylistHistory } from '../services/spotify';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

const thStyle = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '2px solid #333',
  color: '#b3b3b3',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
};
const tdStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #282828',
  verticalAlign: 'top',
  color: '#fff',
};

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
    <div>
      <h2>Admin Panel</h2>
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Playlist Name</th>
              <th style={thStyle}>Spotify Playlist</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {playlists.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No playlists yet
                </td>
              </tr>
            ) : (
              playlists.map((p) => (
                <tr key={p.id}>
                  <td style={{ ...tdStyle, fontSize: '0.75rem', color: '#666' }}>{p.id}</td>
                  <td style={{ ...tdStyle, color: '#b3b3b3' }}>{p.playlist_name}</td>
                  <td style={tdStyle}>
                    {p.spotify_playlist_url ? (
                      <a href={p.spotify_playlist_url} target="_blank" rel="noreferrer" style={{ color: '#1db954' }}>
                        Open in Spotify
                      </a>
                    ) : '—'}
                  </td>
                  <td style={{ ...tdStyle, color: '#b3b3b3' }}>{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
