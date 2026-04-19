import { useState } from 'react';

export default function Dashboard() {
  const [mood, setMood] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsGenerating(true);

    // Simulate an API call to Gemini and Spotify
    setTimeout(() => {
      setPlaylist([
        { id: 1, title: 'Cruel Summer', artist: 'Taylor Swift' },
        { id: 2, title: 'Good Days', artist: 'SZA' },
        { id: 3, title: 'Levitating', artist: 'Dua Lipa' },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div>
      <h2>Playlist Generator</h2>
      <p>Enter how you are feeling, or describe the vibe you want for your playlist.</p>
      
      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="e.g., Late night drive, Happy, Melancholy..." 
          value={mood} 
          onChange={(e) => setMood(e.target.value)} 
          style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
          disabled={isGenerating}
        />
        <button 
          type="submit" 
          disabled={isGenerating || !mood.trim()}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {playlist.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>Generated Tracks</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {playlist.map((track) => (
              <li key={track.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <strong>{track.title}</strong> - {track.artist}
              </li>
            ))}
          </ul>
          
          <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#1DB954', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save Playlist to Spotify
          </button>
        </div>
      )}
    </div>
  );
}