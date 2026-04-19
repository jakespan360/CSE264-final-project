import { Link } from 'react-router-dom';

export default function Navigation() {
  const pillStyleButton = {
    padding: '10px 20px',
    borderRadius: '50px',
    backgroundColor: '#3dd07a',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: '1px solid transparent',
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <Link to="/" style={pillStyleButton}>Home</Link>
      <Link to="/dashboard" style={pillStyleButton}>Dashboard</Link>
      <Link to="/admin" style={pillStyleButton}>Admin</Link>
      <Link to="/auth" style={pillStyleButton}>Login</Link>
    </nav>
  );
}