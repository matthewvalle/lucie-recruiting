import { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../lib/config';

interface LoginPageProps {
  onLogin: (response: { credential: string }) => void;
  error: string;
}

export default function LoginPage({ onLogin, error }: LoginPageProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || typeof google === 'undefined') return;

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onLogin,
    });

    if (buttonRef.current) {
      google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        width: 300,
      });
    }
  }, [onLogin]);

  const isDemoMode = !GOOGLE_CLIENT_ID;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-light">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center">
        {/* Logo / Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">LV</span>
          </div>
          <h1 className="text-2xl font-bold text-navy">Lucie Valle</h1>
          <p className="text-gray-500 mt-1">Recruiting Dashboard</p>
          <p className="text-xs text-gray-400 mt-1">Choate Rosemary Hall '29</p>
        </div>

        {/* Sport badges */}
        <div className="flex justify-center gap-3 mb-8">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            Lacrosse — Goalie
          </span>
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
            Hockey — Defense
          </span>
        </div>

        {/* Login */}
        {isDemoMode ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Demo mode — Google OAuth not configured yet
            </p>
            <button
              onClick={() => {
                const header = btoa(JSON.stringify({ alg: 'none' }));
                const payload = btoa(JSON.stringify({
                  email: 'demo@example.com',
                  name: 'Demo User',
                  picture: '',
                }));
                onLogin({ credential: [header, payload, 'demo'].join('.') });
              }}
              className="w-full py-3 px-6 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors"
            >
              Enter Dashboard (Demo)
            </button>
            <p className="text-xs text-gray-400 mt-3">
              Set PUBLIC_GOOGLE_CLIENT_ID in .env to enable Google login
            </p>
          </div>
        ) : (
          <div>
            <div ref={buttonRef} className="flex justify-center" />
            <p className="text-xs text-gray-400 mt-4">
              Family members only
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      <p className="text-white/40 text-xs mt-8">
        Valle Family Recruiting Hub
      </p>
    </div>
  );
}

declare const google: {
  accounts: {
    id: {
      initialize: (config: Record<string, unknown>) => void;
      renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
    };
  };
};
