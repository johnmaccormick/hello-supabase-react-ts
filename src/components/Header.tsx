import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  signOut: () => Promise<void>;
}

function Header({ user, signOut }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: '#f8f9fa'
    }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ margin: 0 }}>MirDB</h1>
        </Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span>Logged in as {user.email}</span>
            <button 
              onClick={signOut}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </>
        ) : (<>
          <span>Not signed in. You can view content but must sign in to edit or add content.</span>
          <Link 
            to="/login"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Sign In
          </Link></>
        )}
      </div>
    </header>
  );
}

export default Header;