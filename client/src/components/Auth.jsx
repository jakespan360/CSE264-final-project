import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function Auth() {
  const [session, setSession] = useState(null);

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

  return (
    <div>
      {session ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : (
        <button onClick={handleLogin}>Log In with Spotify</button>
      )}
    </div>
  );
}