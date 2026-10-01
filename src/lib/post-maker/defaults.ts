// Default content for the Instagram post maker (/post-maker).
// Edit this file to change what the tool starts with. Changes made in the
// browser are saved to that browser only, and "Reset" brings back these values.

export interface PostEvent {
  date: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, or '' for a single day
  name: string;
  location: string;
}

export type ThemeId = 'tomahawks' | 'choate';

export interface PostConfig {
  theme: ThemeId;
  titleTop: string;
  titleBottom: string;
  name: string;
  number: string;
  position: string;
  gradYear: string;
  teamLine: string;
  schoolLine: string;
  footer: string;
  events: PostEvent[];
  photoId: string;
  photoZoom: number;
  photoX: number; // 0 = show left edge of photo, 1 = right edge
  photoY: number; // 0 = top, 1 = bottom
  showTomahawks: boolean;
  showChoate: boolean;
  igTeamHandle: string;
}

export interface PresetPhoto {
  id: string;
  label: string;
  src: string;
  x: number;
  y: number;
}

export const PRESET_PHOTOS: PresetPhoto[] = [
  { id: 'tomahawks-save', label: 'Tomahawks save (#13)', src: '/post-maker/tomahawks-save.jpg', x: 0.12, y: 0.2 },
  { id: 'choate-goalie', label: 'Choate in the cage', src: '/post-maker/choate-goalie.jpg', x: 0.5, y: 0.5 },
];

export const LOGOS = {
  tomahawks: '/post-maker/tomahawks-logo.png',
  // Shield only (the name is already written under the logos); full seal kept as a fallback.
  choate: ['/post-maker/choate-shield.png', '/post-maker/choate-seal.png'],
};

export const DEFAULT_CONFIG: PostConfig = {
  theme: 'tomahawks',
  titleTop: 'FALL',
  titleBottom: 'SCHEDULE',
  name: 'LUCIE VALLE',
  number: '13',
  position: 'LEFTY GOALIE',
  gradYear: '2029',
  teamLine: 'NH TOMAHAWKS 2029 PURPLE',
  schoolLine: 'CHOATE ROSEMARY HALL',
  footer: '',
  igTeamHandle: '@nhtomahawksgirls',
  events: [
    { date: '2026-11-08', endDate: '', name: 'NE Showcase', location: 'Albany, NY' },
    { date: '2026-11-14', endDate: '', name: 'Fall Draw', location: 'Flemington, NJ' },
    { date: '2026-11-15', endDate: '', name: 'Lax for the Cure', location: 'New Egypt, NJ' },
    { date: '2026-11-21', endDate: '2026-11-22', name: 'Presidents Cup', location: 'Lakewood Ranch, FL' },
  ],
  photoId: 'tomahawks-save',
  photoZoom: 1,
  photoX: 0.12,
  photoY: 0.2,
  showTomahawks: true,
  showChoate: true,
};
