import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { generatePlaylist, saveGeneratedPlaylist } from '../services/spotify';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [mood, setMood] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
        queryParams: { show_dialog: 'true' },
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
    if (!playlist.length) return;
    setIsSaving(true);
    setError('');
    setSaveMessage('');

    try {
      const result = await saveGeneratedPlaylist(`Mood Playlist - ${mood}`, playlist);
      setSaveMessage(`Saved! Open: ${result.url}`);
    } catch (err) {
      setError(err.message || 'Could not save playlist.');
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
            <button type="submit" disabled={isGenerating || !mood.trim()} style={{ marginTop: '0.5rem',alignItems: 'center'  }}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </form>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          {playlist.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <ul>
                {playlist.map((track, i) => (
                  <li key={`${track.title}-${track.artist}-${i}`}>
                    <strong>{track.title}</strong> by {track.artist}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save to Spotify'}
                </button>
                {saveMessage && (
                  <p style={{ marginTop: '0.75rem', wordBreak: 'break-word' }}>{saveMessage}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}