export interface Program {
  _rowIndex: number;
  School: string;
  Division: string;
  Conference: string;
  'Academic Ranking': string;
  'Acceptance Rate': string;
  'Head Coach': string;
  'Coach Email': string;
  'Coach Phone': string;
  'Coach Background': string;
  'Choate Connection': string;
  'Roster Size': string;
  // Lacrosse-specific
  'Goalies on Roster'?: string;
  'Graduating Goalies'?: string;
  // Hockey-specific
  'Defenders on Roster'?: string;
  'Graduating Defenders'?: string;
  'Program URL': string;
  'Questionnaire URL': string;
  Priority: string;
  Notes: string;
  'Last Updated': string;
}

export interface Coach {
  _rowIndex: number;
  Name: string;
  School: string;
  Sport: string;
  Role: string;
  Email: string;
  Phone: string;
  'Alma Mater': string;
  'Years at Program': string;
  Background: string;
  'Choate Connection': string;
  Notes: string;
  'Last Updated': string;
}

export interface CalendarEvent {
  _rowIndex: number;
  'Event Name': string;
  Sport: string;
  Date: string;
  'End Date': string;
  Location: string;
  Type: string;
  'Coaches Attending': string;
  Cost: string;
  'Registration URL': string;
  'Registration Deadline': string;
  Status: string;
  Notes: string;
}

export interface ContactLogEntry {
  _rowIndex: number;
  Date: string;
  School: string;
  Coach: string;
  Sport: string;
  Type: string;
  Summary: string;
  'Follow Up Date': string;
  'Follow Up Done': string;
  Notes: string;
}

export interface TimelineEvent {
  _rowIndex: number;
  Date: string;
  Event: string;
  Category: string;
  Sport: string;
  Notes: string;
  Completed: string;
}
