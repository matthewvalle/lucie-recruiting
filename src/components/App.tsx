import { useState, useEffect, useCallback } from 'react';
import { getStoredUser, storeUser, clearUser, isEmailAllowed, type UserProfile } from '../lib/auth';
import { setAccessToken } from '../lib/sheets';
import { GOOGLE_CLIENT_ID } from '../lib/config';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback((credentialResponse: { credential: string }) => {
    try {
      // Decode the JWT token from Google
      const payload = JSON.parse(
        atob(credentialResponse.credential.split('.')[1])
      );

      const email = payload.email as string;
      if (!isEmailAllowed(email)) {
        setError('This account is not authorized. Contact the site administrator.');
        return;
      }

      const profile: UserProfile = {
        email,
        name: payload.name || email,
        picture: payload.picture || '',
      };

      storeUser(profile);
      setUser(profile);
      setError('');

      // For Sheets API, we need an access token (not the ID token)
      // We'll use the token client for this
      initTokenClient(email);
    } catch {
      setError('Login failed. Please try again.');
    }
  }, []);

  const initTokenClient = useCallback((email: string) => {
    if (!GOOGLE_CLIENT_ID || typeof google === 'undefined') return;

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      hint: email,
      callback: (response: { access_token?: string; error?: string }) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
        }
      },
    });

    // Request token immediately
    tokenClient.requestAccessToken({ prompt: '' });
  }, []);

  const handleLogout = useCallback(() => {
    clearUser();
    setUser(null);
    setAccessToken('');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} error={error} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

// Type declaration for Google Identity Services
declare const google: {
  accounts: {
    id: {
      initialize: (config: Record<string, unknown>) => void;
      renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
    };
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        hint: string;
        callback: (response: { access_token?: string; error?: string }) => void;
      }) => { requestAccessToken: (config: { prompt: string }) => void };
    };
  };
};
