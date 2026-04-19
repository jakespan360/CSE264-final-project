import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem' }}>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/auth">Login</Link>
    </nav>
  );
}