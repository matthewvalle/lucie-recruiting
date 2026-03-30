import { useState, useMemo } from 'react';
import { DEMO_LACROSSE_PROGRAMS, DEMO_HOCKEY_PROGRAMS } from '../../lib/demo-data';
import type { Program } from '../../lib/types';

type Sport = 'all' | 'lacrosse' | 'hockey';
type Division = 'all' | 'D1' | 'D3';
type Priority = 'all' | 'Dream' | 'Target' | 'Safety';
type ViewMode = 'cards' | 'table';

const PRIORITY_COLORS: Record<string, string> = {
  Dream: 'bg-purple-100 text-purple-800',
  Target: 'bg-blue-100 text-blue-800',
  Safety: 'bg-green-100 text-green-800',
  '': 'bg-gray-100 text-gray-600',
};

export default function ProgramsTab() {
  const [sport, setSport] = useState<Sport>('all');
  const [division, setDivision] = useState<Division>('all');
  const [priority, setPriority] = useState<Priority>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const allPrograms = useMemo(() => {
    const lax = DEMO_LACROSSE_PROGRAMS.map((p) => ({ ...p, _sport: 'lacrosse' as const }));
    const hk = DEMO_HOCKEY_PROGRAMS.map((p) => ({ ...p, _sport: 'hockey' as const }));
    return [...lax, ...hk];
  }, []);

  const filtered = useMemo(() => {
    return allPrograms.filter((p) => {
      if (sport !== 'all' && p._sport !== sport) return false;
      if (division !== 'all' && p.Division !== division) return false;
      if (priority !== 'all' && p.Priority !== priority) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.School.toLowerCase().includes(q) ||
          p.Conference.toLowerCase().includes(q) ||
          p['Head Coach'].toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allPrograms, sport, division, priority, search]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">Programs</h2>
          <p className="text-gray-500 text-sm">{filtered.length} programs tracked</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'cards' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'table' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search schools, conferences, coaches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value as Sport)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">All Sports</option>
          <option value="lacrosse">Lacrosse</option>
          <option value="hockey">Hockey</option>
        </select>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value as Division)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">All Divisions</option>
          <option value="D1">D1</option>
          <option value="D3">D3</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="all">All Priorities</option>
          <option value="Dream">Dream</option>
          <option value="Target">Target</option>
          <option value="Safety">Safety</option>
        </select>
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-navy">{selectedProgram.School}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-sm text-gray-500">{selectedProgram.Division}</span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">{selectedProgram.Conference}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400">Academic Ranking</div>
                <div className="font-semibold">{selectedProgram['Academic Ranking'] || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400">Acceptance Rate</div>
                <div className="font-semibold">{selectedProgram['Acceptance Rate'] || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400">Head Coach</div>
                <div className="font-semibold">{selectedProgram['Head Coach']}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-400">Roster Size</div>
                <div className="font-semibold">{selectedProgram['Roster Size'] || 'N/A'}</div>
              </div>
            </div>

            {selectedProgram['Coach Email'] && (
              <a
                href={`mailto:${selectedProgram['Coach Email']}`}
                className="block w-full text-center py-2 bg-navy text-white rounded-lg font-medium mb-4 hover:bg-navy-light transition-colors"
              >
                Email Coach: {selectedProgram['Coach Email']}
              </a>
            )}

            {selectedProgram['Choate Connection'] && (
              <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 mb-4">
                <div className="text-xs font-medium text-gold">Choate Connection</div>
                <div className="text-sm mt-1">{selectedProgram['Choate Connection']}</div>
              </div>
            )}

            {selectedProgram['Coach Background'] && (
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-1">Coach Background</div>
                <div className="text-sm">{selectedProgram['Coach Background']}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {selectedProgram['Goalies on Roster'] && (
                <div className="text-sm">
                  <span className="text-gray-400">Goalies:</span>{' '}
                  {selectedProgram['Goalies on Roster']}
                </div>
              )}
              {selectedProgram['Graduating Goalies'] && (
                <div className="text-sm">
                  <span className="text-gray-400">Graduating:</span>{' '}
                  <span className="text-green-600 font-medium">{selectedProgram['Graduating Goalies']}</span>
                </div>
              )}
              {selectedProgram['Defenders on Roster'] && (
                <div className="text-sm">
                  <span className="text-gray-400">Defenders:</span>{' '}
                  {selectedProgram['Defenders on Roster']}
                </div>
              )}
              {selectedProgram['Graduating Defenders'] && (
                <div className="text-sm">
                  <span className="text-gray-400">Graduating:</span>{' '}
                  <span className="text-green-600 font-medium">{selectedProgram['Graduating Defenders']}</span>
                </div>
              )}
            </div>

            {selectedProgram.Notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                {selectedProgram.Notes}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {selectedProgram['Program URL'] && (
                <a
                  href={selectedProgram['Program URL']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy hover:underline"
                >
                  Program Page &rarr;
                </a>
              )}
              {selectedProgram['Questionnaire URL'] && (
                <a
                  href={selectedProgram['Questionnaire URL']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy hover:underline"
                >
                  Recruiting Questionnaire &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((program, i) => (
            <button
              key={i}
              onClick={() => setSelectedProgram(program)}
              className="bg-white rounded-xl shadow-sm p-5 text-left hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-navy">{program.School}</h3>
                  <p className="text-xs text-gray-500">
                    {program.Division} | {program.Conference}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      program._sport === 'lacrosse'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {program._sport === 'lacrosse' ? 'LAX' : 'HKY'}
                  </span>
                  {program.Priority && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[program.Priority]}`}>
                      {program.Priority}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Academics:</span>{' '}
                  <span className="font-medium">{program['Academic Ranking'] || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Coach:</span>{' '}
                  <span className="font-medium">{program['Head Coach']}</span>
                </div>
              </div>

              {program['Choate Connection'] && (
                <div className="mt-3 text-xs px-2 py-1 bg-gold/10 text-gold rounded border border-gold/20">
                  Choate Connection
                </div>
              )}

              {(program['Graduating Goalies'] && program['Graduating Goalies'] !== '0') ||
              (program['Graduating Defenders'] && program['Graduating Defenders'] !== '0') ? (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  Position opening available
                </div>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">School</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Sport</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Div</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Conference</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Academics</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Coach</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Opening</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedProgram(p)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-navy">{p.School}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        p._sport === 'lacrosse' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {p._sport === 'lacrosse' ? 'LAX' : 'HKY'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.Division}</td>
                  <td className="px-4 py-3 text-gray-600">{p.Conference}</td>
                  <td className="px-4 py-3">{p['Academic Ranking']}</td>
                  <td className="px-4 py-3 text-gray-600">{p['Head Coach']}</td>
                  <td className="px-4 py-3">
                    {p.Priority && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[p.Priority]}`}>
                        {p.Priority}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {((p['Graduating Goalies'] && p['Graduating Goalies'] !== '0') ||
                      (p['Graduating Defenders'] && p['Graduating Defenders'] !== '0')) && (
                      <span className="text-xs text-green-600 font-medium">Yes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
