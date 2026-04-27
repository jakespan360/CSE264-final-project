export default function PlayListDisplay({ tracks }) {
    // Return nothing if no tracks are provided
    if (!tracks || tracks.length === 0) return null;

    return (
    <div className="playlist-container" style={{
      marginTop: '2rem',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '400px', 
      overflowY: 'auto',
      borderRadius: '12px',
      border: '1px solid #333',
      backgroundColor: '#121212',
      padding: '8px'
    }}>
      {tracks.map((track, i) => (
        <div key={track.id || i} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          borderBottom: '1px solid #282828',
          gap: '16px'
        }}>
          {/* THE IMAGE UPDATE */}
          <img 
            src={track.imageUrl || 'https://via.placeholder.com/50'} 
            alt={track.title}
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '4px',
              objectFit: 'cover', // Keeps the album art from distorting
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
          />
          
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis' 
            }}>
              {track.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>
              {track.artist}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}