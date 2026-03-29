import { SPREADSHEET_ID, SHEET_NAMES } from './config';

let accessToken: string | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

async function sheetsRequest(path: string, options: RequestInit = {}) {
  if (!accessToken) throw new Error('Not authenticated');
  if (!SPREADSHEET_ID) throw new Error('Spreadsheet ID not configured');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sheets API error: ${res.status} - ${err}`);
  }

  return res.json();
}

// Read all rows from a sheet tab
export async function readSheet(sheetName: string): Promise<string[][]> {
  const data = await sheetsRequest(
    `/values/${encodeURIComponent(sheetName)}?valueRenderOption=UNFORMATTED_VALUE`
  );
  return data.values || [];
}

// Append a row to a sheet tab
export async function appendRow(sheetName: string, values: (string | number | boolean)[]): Promise<void> {
  await sheetsRequest(
    `/values/${encodeURIComponent(sheetName)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      body: JSON.stringify({ values: [values] }),
    }
  );
}

// Update a specific cell range
export async function updateRange(
  range: string,
  values: (string | number | boolean)[][]
): Promise<void> {
  await sheetsRequest(
    `/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      body: JSON.stringify({ values }),
    }
  );
}

// Delete a row by clearing it (Sheets API doesn't have direct row delete in v4 values)
export async function clearRow(sheetName: string, rowIndex: number): Promise<void> {
  const range = `${sheetName}!A${rowIndex}:ZZ${rowIndex}`;
  await sheetsRequest(`/values/${encodeURIComponent(range)}:clear`, {
    method: 'POST',
  });
}

// Helper to convert sheet rows to objects using header row
export function rowsToObjects<T extends Record<string, unknown>>(
  rows: string[][]
): T[] {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => String(h).trim());
  return rows.slice(1).map((row, idx) => {
    const obj: Record<string, unknown> = { _rowIndex: idx + 2 }; // 1-indexed, skip header
    headers.forEach((header, i) => {
      obj[header] = row[i] ?? '';
    });
    return obj as T;
  });
}

// Initialize the spreadsheet with all required tabs
export async function initializeSpreadsheet(): Promise<void> {
  // Check if spreadsheet exists and has tabs
  const meta = await sheetsRequest('');
  const existingSheets = meta.sheets?.map(
    (s: { properties: { title: string } }) => s.properties.title
  ) || [];

  const neededSheets = Object.values(SHEET_NAMES);
  const missingSheets = neededSheets.filter((name) => !existingSheets.includes(name));

  if (missingSheets.length > 0) {
    // Add missing sheet tabs
    await sheetsRequest(':batchUpdate', {
      method: 'POST',
      body: JSON.stringify({
        requests: missingSheets.map((title) => ({
          addSheet: { properties: { title } },
        })),
      }),
    });

    // Add headers to new sheets
    const headerMap: Record<string, string[]> = {
      [SHEET_NAMES.LACROSSE_PROGRAMS]: [
        'School', 'Division', 'Conference', 'Academic Ranking', 'Acceptance Rate',
        'Head Coach', 'Coach Email', 'Coach Phone', 'Coach Background',
        'Choate Connection', 'Roster Size', 'Goalies on Roster', 'Graduating Goalies',
        'Program URL', 'Questionnaire URL', 'Priority', 'Notes', 'Last Updated',
      ],
      [SHEET_NAMES.HOCKEY_PROGRAMS]: [
        'School', 'Division', 'Conference', 'Academic Ranking', 'Acceptance Rate',
        'Head Coach', 'Coach Email', 'Coach Phone', 'Coach Background',
        'Choate Connection', 'Roster Size', 'Defenders on Roster', 'Graduating Defenders',
        'Program URL', 'Questionnaire URL', 'Priority', 'Notes', 'Last Updated',
      ],
      [SHEET_NAMES.COACHES]: [
        'Name', 'School', 'Sport', 'Role', 'Email', 'Phone',
        'Alma Mater', 'Years at Program', 'Background',
        'Choate Connection', 'Notes', 'Last Updated',
      ],
      [SHEET_NAMES.EVENTS]: [
        'Event Name', 'Sport', 'Date', 'End Date', 'Location',
        'Type', 'Coaches Attending', 'Cost', 'Registration URL',
        'Registration Deadline', 'Status', 'Notes',
      ],
      [SHEET_NAMES.CONTACT_LOG]: [
        'Date', 'School', 'Coach', 'Sport', 'Type',
        'Summary', 'Follow Up Date', 'Follow Up Done', 'Notes',
      ],
      [SHEET_NAMES.TIMELINE]: [
        'Date', 'Event', 'Category', 'Sport', 'Notes', 'Completed',
      ],
    };

    for (const sheetName of missingSheets) {
      const headers = headerMap[sheetName];
      if (headers) {
        await updateRange(`${sheetName}!A1`, [headers]);
      }
    }
  }
}

export { SHEET_NAMES };
