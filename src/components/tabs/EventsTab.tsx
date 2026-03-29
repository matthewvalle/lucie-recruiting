import { useState, useMemo } from 'react';
import { DEMO_EVENTS } from '../../lib/demo-data';

const STATUS_COLORS: Record<string, string> = {
  Registered: 'bg-green-100 text-green-800',
  Interested: 'bg-yellow-100 text-yellow-800',
  Attended: 'bg-blue-100 text-blue-800',
  Skipped: 'bg-gray-100 text-gray-600',
};

const TYPE_COLORS: Record<string, string> = {
  Camp: 'bg-purple-50 text-purple-700',
  Showcase: 'bg-orange-50 text-orange-700',
  Game: 'bg-navy/10 text-navy',
  Visit: 'bg-green-50 text-green-700',
};

export default function EventsTab() {
  const [sportFilter, setSportFilter] = useState<'all' | 'Lacrosse' | 'Hockey'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const events = useMemo(() => {
    return DEMO_EVENTS
      .filter((e) => sportFilter === 'all' || e.Sport === sportFilter)
      .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
  }, [sportFilter]);

  const today = new Date();
  const upcoming = events.filter((e) => new Date(e.Date) >= today);
  const past = events.filter((e) => new Date(e.Date) < today);

  // Group events by month for calendar view
  const eventsByMonth = useMemo(() => {
    const groups: Record<string, typeof events> = {};
    upcoming.forEach((event) => {
      const date = new Date(event.Date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });
    return groups;
  }, [upcoming]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Events & Camps</h2>
          <p className="text-gray-500 text-sm">
            {upcoming.length} upcoming | {past.length} past
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'list' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'calendar' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value as typeof sportFilter)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">All Sports</option>
          <option value="Lacrosse">Lacrosse</option>
          <option value="Hockey">Hockey</option>
        </select>
      </div>

      {viewMode === 'list' && (
        <div className="space-y-4">
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Upcoming
              </h3>
              <div className="space-y-3">
                {upcoming.map((event, i) => (
                  <EventCard key={i} event={event} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Past Events
              </h3>
              <div className="space-y-3 opacity-60">
                {past.map((event, i) => (
                  <EventCard key={i} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="space-y-8">
          {Object.entries(eventsByMonth).map(([monthKey, monthEvents]) => {
            const date = new Date(monthKey + '-01');
            return (
              <div key={monthKey}>
                <h3 className="text-lg font-bold text-navy mb-4">
                  {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="space-y-3">
                  {monthEvents.map((event, i) => (
                    <EventCard key={i} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No events found</p>
          <p className="text-sm mt-1">Events will appear here as they&apos;re added</p>
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: (typeof DEMO_EVENTS)[number] }) {
  const startDate = new Date(event.Date);
  const endDate = event['End Date'] ? new Date(event['End Date']) : null;
  const isMultiDay = endDate && endDate.getTime() !== startDate.getTime();
  const deadlineDate = event['Registration Deadline']
    ? new Date(event['Registration Deadline'])
    : null;
  const isDeadlineSoon =
    deadlineDate && deadlineDate.getTime() - Date.now() < 14 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Date */}
        <div className="text-center min-w-[56px] bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-400">
            {startDate.toLocaleDateString('en-US', { month: 'short' })}
          </div>
          <div className="text-xl font-bold text-navy">{startDate.getDate()}</div>
          {isMultiDay && (
            <div className="text-xs text-gray-400">
              - {endDate!.getDate()}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-navy">{event['Event Name']}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{event.Location}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                event.Sport === 'Lacrosse' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {event.Sport}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[event.Type] || 'bg-gray-100 text-gray-600'}`}>
              {event.Type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[event.Status] || 'bg-gray-100 text-gray-600'}`}>
              {event.Status}
            </span>
          </div>

          {event['Coaches Attending'] && (
            <p className="text-xs text-gray-500 mt-2">
              Coaches: <span className="text-gray-700">{event['Coaches Attending']}</span>
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {event.Cost && <span>Cost: {event.Cost}</span>}
            {deadlineDate && (
              <span className={isDeadlineSoon ? 'text-red-600 font-medium' : ''}>
                Deadline: {deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {isDeadlineSoon && ' (soon!)'}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {event['Registration URL'] && (
          <a
            href={event['Registration URL']}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors flex-shrink-0"
          >
            Register
          </a>
        )}
      </div>

      {event.Notes && (
        <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
          {event.Notes}
        </p>
      )}
    </div>
  );
}
