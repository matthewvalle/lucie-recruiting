import { DEMO_TIMELINE } from '../../lib/demo-data';

const CATEGORY_COLORS: Record<string, string> = {
  Milestone: 'bg-navy text-white',
  NCAA: 'bg-purple-600 text-white',
  Task: 'bg-blue-500 text-white',
  Academic: 'bg-green-600 text-white',
};

export default function TimelineTab() {
  const today = new Date();
  const events = [...DEMO_TIMELINE].sort(
    (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
  );

  // Group by year
  const eventsByYear: Record<string, typeof events> = {};
  events.forEach((event) => {
    const year = new Date(event.Date).getFullYear().toString();
    if (!eventsByYear[year]) eventsByYear[year] = [];
    eventsByYear[year].push(event);
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy">Recruiting Timeline</h2>
        <p className="text-gray-500 text-sm">Key dates and milestones for Class of 2029</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs text-gray-600">{cat}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-10">
        {Object.entries(eventsByYear).map(([year, yearEvents]) => (
          <div key={year}>
            <h3 className="text-lg font-bold text-navy mb-4 sticky top-20 bg-gray-50 py-2 z-10">
              {year}
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-4">
                {yearEvents.map((event, i) => {
                  const eventDate = new Date(event.Date);
                  const isPast = eventDate < today;
                  const isCompleted = event.Completed === 'true';
                  const categoryColor = CATEGORY_COLORS[event.Category] || 'bg-gray-400 text-white';

                  return (
                    <div key={i} className={`relative flex gap-4 pl-1 ${isPast && !isCompleted ? 'opacity-70' : ''}`}>
                      {/* Dot */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          isCompleted
                            ? 'bg-green-500'
                            : isPast
                            ? 'bg-gray-300'
                            : categoryColor
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className={`font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-navy'}`}>
                              {event.Event}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {eventDate.toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor}`}>
                                {event.Category}
                              </span>
                              {event.Sport !== 'Both' && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    event.Sport === 'Lacrosse'
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-red-50 text-red-700'
                                  }`}
                                >
                                  {event.Sport}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {event.Notes && (
                          <p className="text-xs text-gray-500 mt-2">{event.Notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
