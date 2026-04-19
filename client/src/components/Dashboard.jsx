import { useState } from 'react';

export default function Dashboard() {
  const [mood, setMood] = useState('');
  const [playlist, setPlaylist] = useState([]);

  const handleGenerate = () => {
    // Placeholder for API call to Gemini/Spotify
    setPlaylist(['Song 1', 'Song 2', 'Song 3']);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Dashboard</h2>
      <div>
        <input 
          type="text" 
          placeholder="Enter your mood (e.g., Happy, Melancholy)" 
          value={mood} 
          onChange={(e) => setMood(e.target.value)} 
        />
        <button onClick={handleGenerate}>Generate Playlist</button>
      </div>

      {playlist.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Generated Tracks:</h3>
          <ul>
            {playlist.map((track, i) => <li key={i}>{track}</li>)}
          </ul>
          <button>Save to Spotify</button>
        </div>
      )}
    </div>
  );
}