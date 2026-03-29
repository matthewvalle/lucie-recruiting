export interface WebMonitor {
  id: string;
  name: string;
  url: string;
  description: string;
  sport: 'Lacrosse' | 'Hockey' | 'Both';
  status: 'watching' | 'open' | 'closed' | 'changed';
  lastChecked: string;
  lastChange: string;
  notes: string;
}

export interface IntelItem {
  id: string;
  date: string;
  title: string;
  source: string;
  sourceUrl: string;
  sport: 'Lacrosse' | 'Hockey' | 'Both';
  category: 'Camp Opening' | 'Coaching Change' | 'Roster Update' | 'Recruiting News' | 'Social Media' | 'Schedule';
  summary: string;
  actionNeeded: boolean;
  actionItem: string;
  dismissed: boolean;
}

export const DEMO_MONITORS: WebMonitor[] = [
  {
    id: 'caliber-summer',
    name: 'Caliber Hockey Training — Summer 2026',
    url: 'https://www.caliberht.com/',
    description: 'Watching for summer 2026 session registration to open. Currently only 2025 sessions listed.',
    sport: 'Hockey',
    status: 'watching',
    lastChecked: '2026-03-29',
    lastChange: '',
    notes: 'Shelton CT based. Summer programs include 3v3 Prep Prospects, 4v4 leagues. Contact: admin@caliberht.com',
  },
  {
    id: 'michigan-lax-august',
    name: 'Michigan Women\'s Lacrosse — August Camp',
    url: 'https://camps.mgoblue.com/womenslacrosse/',
    description: 'Watching for August 2026 camp registration. Coach Hannah Nielsen leads camps.',
    sport: 'Lacrosse',
    status: 'watching',
    lastChecked: '2026-03-29',
    lastChange: '',
    notes: 'D1 Big Ten program. Great exposure opportunity at Michigan.',
  },
];

export const DEMO_INTEL: IntelItem[] = [
  {
    id: 'intel-1',
    date: '2026-03-29',
    title: 'Michigan Women\'s Lacrosse August camp not yet posted',
    source: 'camps.mgoblue.com',
    sourceUrl: 'https://camps.mgoblue.com/womenslacrosse/',
    sport: 'Lacrosse',
    category: 'Camp Opening',
    summary: 'The Michigan Women\'s Lacrosse camp page (Coach Hannah Nielsen) does not yet list August 2026 camps. Previous years typically posted in April/May. Worth checking back regularly.',
    actionNeeded: true,
    actionItem: 'Set reminder to check back in mid-April for August camp posting',
    dismissed: false,
  },
  {
    id: 'intel-2',
    date: '2026-03-29',
    title: 'Caliber Hockey Training summer sessions not yet posted for 2026',
    source: 'caliberht.com',
    sourceUrl: 'https://www.caliberht.com/',
    sport: 'Hockey',
    category: 'Camp Opening',
    summary: 'Caliber HT in Shelton CT still shows 2025 summer programs. The 2026 summer schedule (3v3 Prep Prospects, skills sessions) has not been posted yet. Instagram (@caliberhockey) may announce before the website updates.',
    actionNeeded: true,
    actionItem: 'Follow @caliberhockey on Instagram for early announcements',
    dismissed: false,
  },
  {
    id: 'intel-3',
    date: '2026-03-29',
    title: 'Nike Blue Chip Lacrosse Camp — Registration deadline May 15',
    source: 'Internal tracking',
    sourceUrl: '',
    sport: 'Lacrosse',
    category: 'Camp Opening',
    summary: 'The Nike Blue Chip camp at UVA (June 15-17) has a May 15 registration deadline. This is a top exposure event with multiple D1 coaches in attendance.',
    actionNeeded: true,
    actionItem: 'Decide on registration by early May',
    dismissed: false,
  },
];
