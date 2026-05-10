import { useState, useMemo } from 'react';
import { WEEKLY_VISITS } from '../data/mockData';

const WEEK_DAYS = [
  { label: 'Mon', date: '2026-05-11' },
  { label: 'Tue', date: '2026-05-12' },
  { label: 'Wed', date: '2026-05-13' },
  { label: 'Thu', date: '2026-05-14' },
  { label: 'Fri', date: '2026-05-15' },
  { label: 'Sat', date: '2026-05-16' },
  { label: 'Sun', date: '2026-05-17' },
];

const STATUS_STYLE = {
  'Scheduled': 'bg-blue-50 border-blue-200 text-blue-800',
  'Completed': 'bg-green-50 border-green-200 text-green-800',
  'Missed':    'bg-red-50 border-red-200 text-red-800',
};

const STATUS_DOT = {
  'Scheduled': 'bg-blue-400',
  'Completed': 'bg-green-400',
  'Missed':    'bg-red-400',
};

function VisitModal({ visit, onClose }) {
  if (!visit) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-5 ${
          visit.status === 'Completed' ? 'bg-green-50 border-b border-green-100' :
          visit.status === 'Missed' ? 'bg-red-50 border-b border-red-100' :
          'bg-blue-50 border-b border-blue-100'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[visit.status]}`}></span>
                <span className={`text-xs font-semibold uppercase tracking-wide ${
                  visit.status === 'Completed' ? 'text-green-600' :
                  visit.status === 'Missed' ? 'text-red-600' : 'text-blue-600'
                }`}>{visit.status}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{visit.patientName}</h3>
              <p className="text-sm text-slate-600 mt-0.5">Caregiver: {visit.staffName}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none font-light p-1 -mt-1">×</button>
          </div>
        </div>
        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Date</div>
              <div className="text-sm font-medium text-slate-800">
                {new Date(visit.date).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Time & Duration</div>
              <div className="text-sm font-medium text-slate-800">{visit.time} · {visit.duration} min</div>
            </div>
          </div>
          {visit.notes && (
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Notes</div>
              <div className="text-sm text-slate-700">{visit.notes}</div>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Edit Visit</button>
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VisitScheduling() {
  const [viewMode, setViewMode]       = useState('week');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedDay, setSelectedDay] = useState('2026-05-11');

  const visitsByDate = useMemo(() => {
    const map = {};
    WEEKLY_VISITS.forEach(v => {
      if (!map[v.date]) map[v.date] = [];
      map[v.date].push(v);
    });
    // Sort by time within each day
    Object.keys(map).forEach(d => {
      map[d].sort((a, b) => a.time.localeCompare(b.time));
    });
    return map;
  }, []);

  const totalStats = useMemo(() => ({
    total: WEEKLY_VISITS.length,
    scheduled: WEEKLY_VISITS.filter(v => v.status === 'Scheduled').length,
    completed: WEEKLY_VISITS.filter(v => v.status === 'Completed').length,
    missed:    WEEKLY_VISITS.filter(v => v.status === 'Missed').length,
  }), []);

  const dayVisits = visitsByDate[selectedDay] || [];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visit Scheduling</h1>
          <p className="text-slate-500 text-sm mt-1">Week of May 11–17, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('week')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              Week
            </button>
            <button onClick={() => setViewMode('day')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Visits',  value: totalStats.total,     bg: 'bg-white border-slate-100',          color: 'text-slate-800' },
          { label: 'Scheduled',     value: totalStats.scheduled, bg: 'bg-blue-50 border-blue-100',         color: 'text-blue-700' },
          { label: 'Completed',     value: totalStats.completed, bg: 'bg-green-50 border-green-100',       color: 'text-green-700' },
          { label: 'Missed',        value: totalStats.missed,    bg: 'bg-red-50 border-red-100',           color: 'text-red-700' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Legend:</span>
        {['Scheduled', 'Completed', 'Missed'].map(s => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[s]}`}></span>{s}
          </span>
        ))}
      </div>

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-100">
            {WEEK_DAYS.map(day => {
              const isToday = day.date === '2026-05-10';
              const visits = visitsByDate[day.date] || [];
              const count = visits.length;
              return (
                <div
                  key={day.date}
                  className={`px-2 py-3 text-center border-r border-slate-50 last:border-r-0 cursor-pointer hover:bg-blue-50/50 transition-colors ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => { setSelectedDay(day.date); setViewMode('day'); }}
                >
                  <div className={`text-xs font-semibold uppercase tracking-wide ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>{day.label}</div>
                  <div className={`text-sm font-bold mt-0.5 ${isToday ? 'text-blue-700' : 'text-slate-800'}`}>
                    {new Date(day.date + 'T12:00:00').getDate()}
                  </div>
                  {count > 0 && (
                    <div className="mt-1 text-xs text-slate-400">{count} visit{count > 1 ? 's' : ''}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 min-h-64">
            {WEEK_DAYS.map(day => {
              const visits = visitsByDate[day.date] || [];
              return (
                <div key={day.date} className="border-r border-slate-50 last:border-r-0 p-2 space-y-1.5">
                  {visits.length === 0 && (
                    <div className="text-xs text-slate-200 text-center mt-4">—</div>
                  )}
                  {visits.map(visit => (
                    <div
                      key={visit.id}
                      onClick={() => setSelectedVisit(visit)}
                      className={`rounded-lg border p-2 cursor-pointer hover:opacity-80 hover:shadow-sm transition-all ${STATUS_STYLE[visit.status]}`}
                    >
                      <div className="font-semibold text-xs leading-tight truncate">{visit.patientName.split(' ')[0]}</div>
                      <div className="text-xs opacity-70 truncate mt-0.5">{visit.staffName.split(' ')[0]}</div>
                      <div className="text-xs opacity-70 mt-0.5">{visit.time}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div>
          {/* Day selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {WEEK_DAYS.map(day => (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day.date)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedDay === day.date
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>{day.label}</div>
                <div className="text-xs opacity-70">{new Date(day.date + 'T12:00:00').getDate()}</div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">
                {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{dayVisits.length} visit{dayVisits.length !== 1 ? 's' : ''} scheduled</p>
            </div>

            {dayVisits.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <div className="text-4xl mb-3">📅</div>
                <div>No visits scheduled for this day</div>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {dayVisits.map(visit => (
                  <div
                    key={visit.id}
                    onClick={() => setSelectedVisit(visit)}
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="text-center flex-shrink-0 w-16">
                      <div className="text-sm font-bold text-slate-800">{visit.time}</div>
                      <div className="text-xs text-slate-400">{visit.duration}m</div>
                    </div>
                    <div className={`w-1 h-12 rounded-full flex-shrink-0 ${STATUS_DOT[visit.status]}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-sm">{visit.patientName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Caregiver: {visit.staffName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{visit.notes}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[visit.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[visit.status]}`}></span>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visit Modal */}
      {selectedVisit && (
        <VisitModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} />
      )}
    </div>
  );
}
