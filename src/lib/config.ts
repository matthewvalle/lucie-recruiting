// Google OAuth + Sheets configuration
// To set up:
// 1. Go to console.cloud.google.com
// 2. Create a project (e.g., "Lucie Recruiting")
// 3. Enable Google Sheets API
// 4. Create OAuth 2.0 credentials (Web application)
// 5. Add authorized origins: http://localhost:4321, https://lucievalle.com
// 6. Copy the Client ID below

export const GOOGLE_CLIENT_ID = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || '';
export const SPREADSHEET_ID = import.meta.env.PUBLIC_SPREADSHEET_ID || '';

// Whitelist family Google accounts
export const ALLOWED_EMAILS: string[] = [
  'matthew.j.valle@gmail.com',
  'lucie.e.valle@gmail.com',
  'sarahlachancevalle@gmail.com',
];

// Sheet tab names
export const SHEET_NAMES = {
  LACROSSE_PROGRAMS: 'Lacrosse Programs',
  HOCKEY_PROGRAMS: 'Hockey Programs',
  COACHES: 'Coaches',
  EVENTS: 'Events',
  CONTACT_LOG: 'Contact Log',
  TIMELINE: 'Timeline',
} as const;
