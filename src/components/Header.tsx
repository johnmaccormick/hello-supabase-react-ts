import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  signOut: () => Promise<{ error: string | null }>;
}

function Header({ user, signOut }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <Link to="/" className="header-brand">
          <h1 className="header-title">MirDB</h1>
        </Link>
      </div>
      
      <div className="header-nav">
        {user ? (
          <>
            <span className="user-info">Logged in as {user.email}</span>
            <button onClick={signOut} className="btn-danger">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <span className="user-info">
              Not signed in. You can view content but must sign in to edit or add content.
            </span>
            <Link to="/login" className="btn-link-primary">
              Sign In
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;