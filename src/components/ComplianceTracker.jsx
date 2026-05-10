import { useState, useMemo } from 'react';
import { COMPLIANCE } from '../data/mockData';

function StatusBadge({ status }) {
  const styles = {
    'Compliant': 'bg-green-100 text-green-700 border border-green-200',
    'Due Soon':  'bg-amber-100 text-amber-700 border border-amber-300',
    'Overdue':   'bg-red-100 text-red-700 border border-red-200',
  };
  const icons = { 'Compliant': '✓', 'Due Soon': '⚡', 'Overdue': '!' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      <span>{icons[status]}</span>{status}
    </span>
  );
}

const ITEMS = ['All', 'TB Test', 'CPR Certification', 'Background Check', 'Annual Training', 'BLS Certification'];
const ROLES = ['All', 'RN', 'CNA', 'HHA', 'PT'];

export default function ComplianceTracker() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [itemFilter, setItemFilter]     = useState('All');
  const [roleFilter, setRoleFilter]     = useState('All');
  const [search, setSearch]             = useState('');

  const stats = useMemo(() => ({
    total:     COMPLIANCE.length,
    compliant: COMPLIANCE.filter(c => c.status === 'Compliant').length,
    dueSoon:   COMPLIANCE.filter(c => c.status === 'Due Soon').length,
    overdue:   COMPLIANCE.filter(c => c.status === 'Overdue').length,
  }), []);

  const filtered = useMemo(() => {
    return COMPLIANCE.filter(c => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter ||
        (statusFilter === 'Due This Month' && c.status === 'Due Soon');
      const matchItem   = itemFilter === 'All' || c.item === itemFilter;
      const matchRole   = roleFilter === 'All' || c.role === roleFilter;
      const matchSearch = c.staffName.toLowerCase().includes(search.toLowerCase()) ||
        c.item.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchItem && matchRole && matchSearch;
    });
  }, [statusFilter, itemFilter, roleFilter, search]);

  const pct = Math.round((stats.compliant / stats.total) * 100);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Compliance Tracker</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor required certifications, tests, and training for all staff</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Items',     value: stats.total,     sub: '40 records',                       color: 'text-slate-800', bg: 'bg-white border-slate-100',          icon: '📋' },
          { label: 'Compliant',       value: stats.compliant, sub: `${pct}% compliance rate`,          color: 'text-green-700', bg: 'bg-green-50 border-green-100',         icon: '✅' },
          { label: 'Due Soon',        value: stats.dueSoon,   sub: 'Action needed within 30 days',     color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100',         icon: '⚡' },
          { label: 'Overdue',         value: stats.overdue,   sub: 'Immediate attention required',     color: 'text-red-700',   bg: 'bg-red-50 border-red-100',             icon: '🚨' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border p-4`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{s.icon}</span>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            </div>
            <div className="text-sm font-semibold text-slate-700">{s.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Compliance bar */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Compliance Rate</span>
          <span className={`text-sm font-bold ${pct >= 90 ? 'text-green-600' : pct >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="🔍  Search staff or item…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-40 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
          />
          <div className="flex gap-2 flex-wrap">
            {['All', 'Compliant', 'Due This Month', 'Overdue'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  statusFilter === f
                    ? f === 'Overdue' ? 'bg-red-500 text-white border-red-500' :
                      f === 'Due This Month' ? 'bg-amber-500 text-white border-amber-500' :
                      f === 'Compliant' ? 'bg-green-500 text-white border-green-500' :
                      'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >{f}</button>
            ))}
          </div>
          <select value={itemFilter} onChange={e => setItemFilter(e.target.value)}
            className="text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50">
            {ITEMS.map(i => <option key={i}>{i}</option>)}
          </select>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Staff</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Compliance Item</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Completed</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Due Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="py-12 text-center text-slate-400">No records match your filters.</td></tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${
                    item.status === 'Overdue' ? 'bg-red-50/30' : item.status === 'Due Soon' ? 'bg-amber-50/30' : ''
                  }`}>
                    <td className="py-3 px-4 font-medium text-slate-900">{item.staffName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.role === 'RN' ? 'bg-purple-100 text-purple-700' :
                        item.role === 'CNA' ? 'bg-blue-100 text-blue-700' :
                        item.role === 'HHA' ? 'bg-teal-100 text-teal-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>{item.role}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.item}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(item.lastCompleted).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="py-3 px-4 text-xs">
                      <span className={`font-medium ${item.status === 'Overdue' ? 'text-red-700' : item.status === 'Due Soon' ? 'text-amber-700' : 'text-slate-600'}`}>
                        {new Date(item.dueDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {COMPLIANCE.length} records
        </div>
      </div>
    </div>
  );
}
