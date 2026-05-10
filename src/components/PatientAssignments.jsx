import { useState } from 'react';
import { PATIENTS, STAFF } from '../data/mockData';

const CARE_COLORS = {
  'Basic':    'bg-blue-100 text-blue-700 border border-blue-200',
  'Moderate': 'bg-amber-100 text-amber-700 border border-amber-200',
  'Complex':  'bg-red-100 text-red-700 border border-red-200',
};

const CARE_ICONS = { 'Basic': '💙', 'Moderate': '💛', 'Complex': '❤️' };

export default function PatientAssignments() {
  const [selected, setSelected]   = useState(null);
  const [patients, setPatients]   = useState(PATIENTS);
  const [search, setSearch]       = useState('');
  const [careFilter, setCareFilter] = useState('All');

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchCare = careFilter === 'All' || p.careLevel === careFilter;
    return matchSearch && matchCare;
  });

  const selectedPatient = selected ? patients.find(p => p.id === selected) : null;

  function reassign(patientId, newCaregiverId) {
    setPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, assignedCaregiverId: Number(newCaregiverId) } : p
    ));
    if (selectedPatient) {
      setSelected(patientId); // refresh view
    }
  }

  const assignedStaff = (caregiverId) => STAFF.find(s => s.id === caregiverId);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Patient Assignments</h1>
        <p className="text-slate-500 text-sm mt-1">{patients.length} active patients across {new Set(patients.map(p => p.assignedCaregiverId)).size} caregivers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {['Basic', 'Moderate', 'Complex'].map(level => (
          <div key={level} className={`rounded-xl border p-4 ${
            level === 'Basic' ? 'bg-blue-50 border-blue-100' :
            level === 'Moderate' ? 'bg-amber-50 border-amber-100' :
            'bg-red-50 border-red-100'
          }`}>
            <div className="text-2xl mb-1">{CARE_ICONS[level]}</div>
            <div className={`text-2xl font-bold ${
              level === 'Basic' ? 'text-blue-700' : level === 'Moderate' ? 'text-amber-700' : 'text-red-700'
            }`}>
              {patients.filter(p => p.careLevel === level).length}
            </div>
            <div className="text-xs text-slate-500">{level} Care</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text" placeholder="🔍  Search patients…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
        />
        <div className="flex gap-2">
          {['All', 'Basic', 'Moderate', 'Complex'].map(c => (
            <button key={c} onClick={() => setCareFilter(c)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                careFilter === c
                  ? c === 'Complex' ? 'bg-red-500 text-white border-red-500' :
                    c === 'Moderate' ? 'bg-amber-500 text-white border-amber-500' :
                    c === 'Basic' ? 'bg-blue-500 text-white border-blue-500' :
                    'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Patient list */}
        <div className="flex-1 lg:max-w-sm space-y-2">
          {filtered.map(p => {
            const caregiver = assignedStaff(p.assignedCaregiverId);
            return (
              <div
                key={p.id}
                onClick={() => setSelected(selected === p.id ? null : p.id)}
                className={`bg-white rounded-xl border cursor-pointer transition-all duration-150 p-4 hover:shadow-md ${
                  selected === p.id ? 'border-blue-400 shadow-md ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{p.diagnosis}</div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CARE_COLORS[p.careLevel]}`}>
                        {CARE_ICONS[p.careLevel]} {p.careLevel}
                      </span>
                      <span className="text-xs text-slate-400">{p.visitFrequency}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {caregiver?.initials}
                  </div>
                  <span>{caregiver?.name}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-400">{caregiver?.role}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">No patients match your search.</div>
          )}
        </div>

        {/* Detail panel */}
        {selectedPatient ? (
          <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Detail header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
                  <div className="text-sm text-slate-500 mt-0.5">DOB: {new Date(selectedPatient.dob).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })} · Age {selectedPatient.age}</div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CARE_COLORS[selectedPatient.careLevel]}`}>
                      {CARE_ICONS[selectedPatient.careLevel]} {selectedPatient.careLevel} Care
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{selectedPatient.visitFrequency} visits</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none p-1">×</button>
              </div>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto max-h-screen">
              {/* Contact & diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Contact</div>
                  <div className="text-sm text-slate-700">📞 {selectedPatient.phone}</div>
                  <div className="text-xs text-slate-500 mt-1">📍 {selectedPatient.address}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Diagnosis</div>
                  <div className="text-sm text-slate-700">{selectedPatient.diagnosis}</div>
                </div>
              </div>

              {/* Care plan */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Care Plan Summary</div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-900 leading-relaxed">
                  {selectedPatient.carePlanSummary}
                </div>
              </div>

              {/* Assign caregiver */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Assigned Caregiver</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <select
                      value={selectedPatient.assignedCaregiverId}
                      onChange={e => reassign(selectedPatient.id, e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      {STAFF.filter(s => s.status === 'Active').map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-slate-500 flex-shrink-0">
                    Active staff only
                  </div>
                </div>
              </div>

              {/* Next visit */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">Next Scheduled Visit</div>
                  <div className="text-sm font-medium text-green-900 mt-0.5">
                    {new Date(selectedPatient.nextVisit).toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    {' at '}
                    {new Date(selectedPatient.nextVisit).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Visit history */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Recent Visit History</div>
                <div className="space-y-2">
                  {selectedPatient.visitHistory.map((v, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-lg p-3 bg-white hover:bg-slate-50/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800">
                            {new Date(v.date).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-600">{v.caregiver}</span>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{v.duration} min</span>
                      </div>
                      <div className="text-xs text-slate-600 leading-relaxed">{v.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 flex-col gap-3 min-h-64">
            <span className="text-5xl">👈</span>
            <span className="text-sm">Select a patient to view their full care profile</span>
          </div>
        )}
      </div>
    </div>
  );
}
