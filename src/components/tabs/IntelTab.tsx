import { useState } from 'react';
import { DEMO_MONITORS, DEMO_INTEL } from '../../lib/demo-data-monitors';
import type { WebMonitor, IntelItem } from '../../lib/demo-data-monitors';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  watching: { label: 'Watching', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  open: { label: 'Registration Open!', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  changed: { label: 'Changed!', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Camp Opening': 'bg-green-50 text-green-700',
  'Coaching Change': 'bg-orange-50 text-orange-700',
  'Roster Update': 'bg-blue-50 text-blue-700',
  'Recruiting News': 'bg-purple-50 text-purple-700',
  'Social Media': 'bg-pink-50 text-pink-700',
  'Schedule': 'bg-navy/10 text-navy',
};

export default function IntelTab() {
  const [monitors] = useState<WebMonitor[]>(DEMO_MONITORS);
  const [intel] = useState<IntelItem[]>(DEMO_INTEL);
  const [showAddMonitor, setShowAddMonitor] = useState(false);
  const [filter, setFilter] = useState<'all' | 'action'>('all');

  const actionItems = intel.filter((i) => i.actionNeeded && !i.dismissed);
  const displayedIntel = filter === 'action' ? actionItems : intel.filter((i) => !i.dismissed);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy">Intel & Monitoring</h2>
        <p className="text-gray-500 text-sm">
          Website monitors, recruiting intelligence, and actionable insights
        </p>
      </div>

      {/* Action Items Banner */}
      {actionItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-semibold text-amber-800">
              {actionItems.length} Action Item{actionItems.length !== 1 ? 's' : ''} Need Attention
            </h3>
          </div>
          <div className="space-y-2">
            {actionItems.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <span className="text-amber-600 mt-0.5">-</span>
                <span className="text-amber-900">{item.actionItem}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.sport === 'Lacrosse' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {item.sport}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Website Monitors */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy">Website Monitors</h3>
          <button
            onClick={() => setShowAddMonitor(!showAddMonitor)}
            className="px-3 py-1.5 bg-navy text-white text-sm rounded-lg hover:bg-navy-light transition-colors"
          >
            + Add Monitor
          </button>
        </div>

        {showAddMonitor && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
            <h4 className="font-medium text-navy mb-3">Add Website to Monitor</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g., Cornell Lacrosse Summer Camp"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sport</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                  <option>Lacrosse</option>
                  <option>Hockey</option>
                  <option>Both</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">What to watch for</label>
                <input
                  type="text"
                  placeholder="e.g., August camp registration opens"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-4 py-2 bg-navy text-white text-sm rounded-lg">
                Add Monitor
              </button>
              <button
                onClick={() => setShowAddMonitor(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {monitors.map((monitor) => {
            const status = STATUS_CONFIG[monitor.status];
            return (
              <div key={monitor.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${status.dot} ${monitor.status === 'watching' ? 'animate-pulse' : ''}`} />
                      <h4 className="font-semibold text-navy">{monitor.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{monitor.description}</p>
                    {monitor.notes && (
                      <p className="text-xs text-gray-400 mt-2">{monitor.notes}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span>Last checked: {monitor.lastChecked}</span>
                      {monitor.lastChange && <span>Last change: {monitor.lastChange}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        monitor.sport === 'Lacrosse'
                          ? 'bg-blue-50 text-blue-700'
                          : monitor.sport === 'Hockey'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {monitor.sport}
                    </span>
                    <a
                      href={monitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-navy hover:underline"
                    >
                      Visit site
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Intel Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-navy">Recruiting Intel</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg ${filter === 'all' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('action')}
              className={`px-3 py-1.5 text-sm rounded-lg ${filter === 'action' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Action Needed ({actionItems.length})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {displayedIntel.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-navy">{item.title}</h4>
                    {item.actionNeeded && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                        Action needed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.summary}</p>
                  {item.actionItem && item.actionNeeded && (
                    <div className="mt-3 p-2 bg-amber-50 rounded-lg text-sm text-amber-800 border border-amber-100">
                      Action: {item.actionItem}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{item.date}</span>
                    {item.source && (
                      <span>
                        via{' '}
                        {item.sourceUrl ? (
                          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-navy hover:underline">
                            {item.source}
                          </a>
                        ) : (
                          item.source
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
                    {item.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.sport === 'Lacrosse'
                        ? 'bg-blue-50 text-blue-700'
                        : item.sport === 'Hockey'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {item.sport}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedIntel.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No intel items to show</p>
            <p className="text-gray-400 text-sm mt-1">New insights will appear here as they are discovered</p>
          </div>
        )}
      </div>

      {/* Instagram Note */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
        <h4 className="font-semibold text-purple-800 mb-2">Instagram Monitoring</h4>
        <p className="text-sm text-purple-700">
          Key accounts to follow for early camp announcements and recruiting intel:
        </p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          {[
            { handle: '@caliberhockey', note: 'Caliber HT — camp announcements' },
            { handle: '@umaborvwlax', note: 'Michigan Women\'s Lacrosse' },
            { handle: '@choaborvlacrosse', note: 'Choate Lacrosse updates' },
            { handle: '@choaborvhockey', note: 'Choate Hockey updates' },
            { handle: '@naborvllacrosse', note: 'National lacrosse recruiting news' },
          ].map((acct) => (
            <div key={acct.handle} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-purple-800">{acct.handle}</span>
              <span className="text-purple-600 text-xs">— {acct.note}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-purple-500 mt-3">
          Claude Code can periodically scan these accounts and surface new posts with recruiting relevance.
          Instagram insights will be added to the intel feed above.
        </p>
      </div>
    </div>
  );
}
