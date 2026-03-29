import { useState, useMemo } from 'react';
import { DEMO_COACHES } from '../../lib/demo-data';

export default function CoachesTab() {
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<'all' | 'Lacrosse' | 'Hockey'>('all');

  const filtered = useMemo(() => {
    return DEMO_COACHES.filter((c) => {
      if (sportFilter !== 'all' && c.Sport !== sportFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.Name.toLowerCase().includes(q) ||
          c.School.toLowerCase().includes(q) ||
          c['Alma Mater'].toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, sportFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Coaches</h2>
          <p className="text-gray-500 text-sm">{filtered.length} coaches in directory</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search coaches, schools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
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

      {/* Coach Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((coach, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-start gap-3">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-navy font-semibold text-lg">
                  {coach.Name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-navy">{coach.Name}</h3>
                <p className="text-sm text-gray-500">{coach.Role}</p>
                <p className="text-sm text-gray-600">{coach.School}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  coach.Sport === 'Lacrosse' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {coach.Sport}
              </span>
            </div>

            {coach['Alma Mater'] && (
              <div className="mt-3 text-xs text-gray-500">
                Alma Mater: <span className="text-gray-700">{coach['Alma Mater']}</span>
              </div>
            )}

            {coach['Years at Program'] && (
              <div className="text-xs text-gray-500">
                Years at program: <span className="text-gray-700">{coach['Years at Program']}</span>
              </div>
            )}

            {coach.Background && (
              <p className="mt-2 text-xs text-gray-600 line-clamp-2">{coach.Background}</p>
            )}

            {coach['Choate Connection'] && (
              <div className="mt-3 text-xs px-2 py-1 bg-gold/10 text-gold rounded border border-gold/20">
                {coach['Choate Connection']}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {coach.Email && (
                <a
                  href={`mailto:${coach.Email}`}
                  className="flex-1 text-center py-2 bg-navy text-white text-xs rounded-lg hover:bg-navy-light transition-colors"
                >
                  Email
                </a>
              )}
              {coach.Phone && (
                <a
                  href={`tel:${coach.Phone}`}
                  className="flex-1 text-center py-2 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Call
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No coaches found</p>
          <p className="text-sm mt-1">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
}
