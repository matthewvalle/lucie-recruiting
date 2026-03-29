import { DEMO_LACROSSE_PROGRAMS, DEMO_HOCKEY_PROGRAMS, DEMO_EVENTS, DEMO_CONTACT_LOG, DEMO_TIMELINE } from '../../lib/demo-data';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const lacrosseCount = DEMO_LACROSSE_PROGRAMS.length;
  const hockeyCount = DEMO_HOCKEY_PROGRAMS.length;
  const totalPrograms = lacrosseCount + hockeyCount;

  // NCAA D1 contact date for Class of 2029
  const contactDate = new Date('2027-06-15');
  const today = new Date();
  const daysUntilContact = Math.ceil(
    (contactDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Upcoming events
  const upcomingEvents = DEMO_EVENTS
    .filter((e) => new Date(e.Date) >= today)
    .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
    .slice(0, 4);

  // Programs with position needs
  const laxOpportunities = DEMO_LACROSSE_PROGRAMS.filter(
    (p) => p['Graduating Goalies'] && p['Graduating Goalies'] !== '0'
  );
  const hockeyOpportunities = DEMO_HOCKEY_PROGRAMS.filter(
    (p) => p['Graduating Defenders'] && p['Graduating Defenders'] !== '0'
  );

  // Choate connections
  const choateConnections = [
    ...DEMO_LACROSSE_PROGRAMS.filter((p) => p['Choate Connection']),
    ...DEMO_HOCKEY_PROGRAMS.filter((p) => p['Choate Connection']),
  ];

  // Next timeline milestone
  const nextMilestone = DEMO_TIMELINE
    .filter((t) => !t.Completed && new Date(t.Date) >= today)
    .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())[0];

  return (
    <div className="space-y-6">
      {/* Countdown Banner */}
      <div className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Lucie Valle — Class of 2029</h2>
            <p className="text-white/70 mt-1">Choate Rosemary Hall | Lacrosse Goalie | Hockey Defense</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gold">{daysUntilContact}</div>
            <div className="text-white/70 text-sm">days until D1 contact opens</div>
            <div className="text-white/50 text-xs">June 15, 2027</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('programs')}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="text-3xl font-bold text-navy">{totalPrograms}</div>
          <div className="text-gray-500 text-sm mt-1">Programs Tracked</div>
          <div className="text-xs text-gray-400 mt-1">
            {lacrosseCount} lacrosse | {hockeyCount} hockey
          </div>
        </button>

        <button
          onClick={() => onNavigate('programs')}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="text-3xl font-bold text-green-600">
            {laxOpportunities.length + hockeyOpportunities.length}
          </div>
          <div className="text-gray-500 text-sm mt-1">Position Openings</div>
          <div className="text-xs text-gray-400 mt-1">Graduating goalies/defenders</div>
        </button>

        <button
          onClick={() => onNavigate('events')}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</div>
          <div className="text-gray-500 text-sm mt-1">Upcoming Events</div>
          <div className="text-xs text-gray-400 mt-1">Camps & showcases</div>
        </button>

        <button
          onClick={() => onNavigate('contacts')}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="text-3xl font-bold text-purple-600">{DEMO_CONTACT_LOG.length}</div>
          <div className="text-gray-500 text-sm mt-1">Coach Contacts</div>
          <div className="text-xs text-gray-400 mt-1">Interactions logged</div>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy text-lg">Upcoming Events</h3>
            <button
              onClick={() => onNavigate('events')}
              className="text-sm text-navy hover:underline"
            >
              View all
            </button>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center min-w-[48px]">
                    <div className="text-xs text-gray-400">
                      {new Date(event.Date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-lg font-bold text-navy">
                      {new Date(event.Date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{event['Event Name']}</div>
                    <div className="text-xs text-gray-500">{event.Location}</div>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          event.Sport === 'Lacrosse'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {event.Sport}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          event.Status === 'Registered'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {event.Status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Position Opportunities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy text-lg">Position Opportunities</h3>
            <button
              onClick={() => onNavigate('programs')}
              className="text-sm text-navy hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {laxOpportunities.map((p, i) => (
              <div key={`lax-${i}`} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{p.School}</div>
                  <div className="text-xs text-gray-500">{p.Division} | {p.Conference}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-700 font-medium">Goalie graduating</div>
                  <div className="text-xs text-gray-400">{p['Graduating Goalies']}</div>
                </div>
              </div>
            ))}
            {hockeyOpportunities.map((p, i) => (
              <div key={`hk-${i}`} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{p.School}</div>
                  <div className="text-xs text-gray-500">{p.Division} | {p.Conference}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-red-700 font-medium">Defender(s) graduating</div>
                  <div className="text-xs text-gray-400">{p['Graduating Defenders']}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Choate Connections */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-navy text-lg mb-4">Choate Connections</h3>
          {choateConnections.length === 0 ? (
            <p className="text-gray-400 text-sm">No connections found yet</p>
          ) : (
            <div className="space-y-3">
              {choateConnections.map((p, i) => (
                <div key={i} className="p-3 bg-gold/10 rounded-lg border border-gold/20">
                  <div className="font-medium text-sm">{p.School}</div>
                  <div className="text-xs text-gray-600 mt-1">{p['Choate Connection']}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Milestone */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy text-lg">Recruiting Timeline</h3>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-sm text-navy hover:underline"
            >
              View all
            </button>
          </div>
          {nextMilestone ? (
            <div className="p-4 bg-navy/5 rounded-lg border border-navy/10">
              <div className="text-xs text-navy/60 mb-1">Next milestone</div>
              <div className="font-semibold text-navy">{nextMilestone.Event}</div>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(nextMilestone.Date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              {nextMilestone.Notes && (
                <div className="text-xs text-gray-400 mt-2">{nextMilestone.Notes}</div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No upcoming milestones</p>
          )}

          {/* Quick timeline preview */}
          <div className="mt-4 space-y-2">
            {DEMO_TIMELINE.slice(0, 4).map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    t.Completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className={t.Completed ? 'text-gray-400 line-through' : 'text-gray-700'}>
                  {t.Event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
