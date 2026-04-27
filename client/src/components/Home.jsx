import { Link } from 'react-router-dom';
import PlaylistDisplay from './PlaylistDisplay';
import { HOME_EXAMPLE_TRACKS } from '../data/examplePlaylist';

export default function Home() {
  const cardStyle = {
    backgroundColor: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'left',
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '4rem', textAlign: 'center', fontStyle: 'italic' }}>Moodify</h1>
      <p style={{ marginBottom: '1.5rem' }}>
        Turn a mood into a Spotify-ready playlist in seconds. Connect your Spotify, describe how you feel,
        and generate a curated playlist you can save directly to your account.
      </p>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '0.5rem' }}>How it works</h3>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
            <li>Connect your Spotify account</li>
            <li>Enter a mood or vibe (ex: “chill night drive”)</li>
            <li>Generate a 15-song playlist</li>
            <li>Save it to your Spotify in one click</li>
          </ol>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: '0.5rem' }}>What you get</h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
            <li>Fast AI-powered recommendations</li>
            <li>Spotify track matching </li>
            <li>Direct save to your own Spotify playlists</li>
          </ul>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginBottom: '0.75rem' }}>Example generated playlist</h3>
        <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>Mood: "Vibing”</h4>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PlaylistDisplay tracks={HOME_EXAMPLE_TRACKS} />
        </div>
        <p style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          Example preview of a generated mood playlist.
        </p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{ display: 'block', margin: '0 auto' }}>Get Started</button>
        </Link>
      </div>
    </div>
  );
}