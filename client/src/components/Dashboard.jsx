import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { generatePlaylist } from '../services/spotify';
import PlayListDisplay from './PlaylistDisplay';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [mood, setMood] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedUrl, setSavedUrl] = useState('');

  // Listen for Supabase auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes: 'user-read-email user-read-private playlist-modify-public playlist-modify-private',
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsGenerating(true);
    setError('');
    setPlaylist([]);
    setSavedUrl('');
    setSaveError('');

    try {
      const generated = await generatePlaylist(mood);
      setPlaylist(generated);
    } catch (err) {
      setError('Could not generate playlist. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const uris = playlist.map((t) => t.uri).filter(Boolean);
    if (!uris.length) return;

    setIsSaving(true);
    setSaveError('');
    setSavedUrl('');

    try {
      const name = playlistName.trim() || `${mood} playlist`;
      const url = await savePlaylist(name, uris);
      setSavedUrl(url);
    } catch (err) {
      setSaveError('Could not save playlist. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Playlist Generator</h2>

      {/* Spotify Connection Area - Centered above generator */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        {!session ? (
          <>
            <p style={{ marginBottom: '1rem' }}>You need to connect your Spotify account to generate and save playlists.</p>
            <button onClick={handleLogin}>Connect Spotify</button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '8px 16px', fontSize: '0.9rem' }}>
            Disconnect Spotify
          </button>
        )}
      </div>

      {/* Generator Area - Only shows when connected */}
      {session && (
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <p style={{ textAlign: 'center' }}>Describe your mood and get songs.</p>

          <form onSubmit={handleGenerate} className="form-group" style={{ alignItems: 'center' }}>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., chill night drive"
              disabled={isGenerating}
              style={{ textAlign: 'center' }}
            />
            {/* Generate Button centered below input */}
            <button type="submit" disabled={isGenerating || !mood.trim()} style={{ marginTop: '0.5rem', alignItems: 'center' }}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </form>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          {playlist.length > 0 && (
            <PlayListDisplay tracks={playlist} />
          )}
        </div>
      )}
    </div>
  );
}