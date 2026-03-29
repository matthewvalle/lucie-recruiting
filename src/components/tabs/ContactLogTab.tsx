import { useState } from 'react';
import { DEMO_CONTACT_LOG } from '../../lib/demo-data';
import type { ContactLogEntry } from '../../lib/types';

export default function ContactLogTab() {
  const [entries] = useState<ContactLogEntry[]>(DEMO_CONTACT_LOG);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Contact Log</h2>
          <p className="text-gray-500 text-sm">Track all coach interactions and follow-ups</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-navy text-white text-sm rounded-lg hover:bg-navy-light transition-colors"
        >
          + Log Interaction
        </button>
      </div>

      {/* Add Form (placeholder — will be functional with Sheets) */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h3 className="font-semibold text-navy mb-4">New Contact Log Entry</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">School</label>
              <input
                type="text"
                placeholder="e.g., Yale"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Coach</label>
              <input
                type="text"
                placeholder="Coach name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Sport</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                <option>Lacrosse</option>
                <option>Hockey</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                <option>Email</option>
                <option>Phone Call</option>
                <option>Camp Meeting</option>
                <option>Visit</option>
                <option>Questionnaire</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Follow Up Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Summary</label>
              <textarea
                rows={3}
                placeholder="What was discussed..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-navy text-white text-sm rounded-lg hover:bg-navy-light transition-colors">
              Save Entry
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Note: Saving to Google Sheets requires OAuth setup. Currently in demo mode.
          </p>
        </div>
      )}

      {/* Entries */}
      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-navy">{entry.School}</h4>
                  <p className="text-sm text-gray-600">
                    {entry.Coach} — {entry.Type}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(entry.Date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-2">{entry.Summary}</p>
              {entry['Follow Up Date'] && (
                <div className="mt-2 text-xs text-orange-600">
                  Follow up by: {new Date(entry['Follow Up Date']).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">No interactions logged yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click &quot;Log Interaction&quot; to record your first coach contact
          </p>
          <p className="text-gray-400 text-xs mt-4">
            Track emails, phone calls, camp meetings, and visits here
          </p>
        </div>
      )}
    </div>
  );
}
