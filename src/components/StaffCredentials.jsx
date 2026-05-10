import { useState, useMemo } from 'react';
import { STAFF, CREDENTIALS } from '../data/mockData';

function StatusBadge({ status }) {
  const styles = {
    'Active':    'bg-green-100 text-green-700 border border-green-200',
    'Inactive':  'bg-slate-100 text-slate-500 border border-slate-200',
    'On Leave':  'bg-amber-100 text-amber-700 border border-amber-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Active' ? 'bg-green-500' : status === 'Inactive' ? 'bg-slate-400' : 'bg-amber-500'}`}></span>
      {status}
    </span>
  );
}

function CredBadge({ status }) {
  const styles = {
    'Valid':          'bg-green-50 text-green-700 border border-green-200',
    'Expiring Soon':  'bg-amber-50 text-amber-700 border border-amber-300',
    'Expired':        'bg-red-50 text-red-700 border border-red-200',
  };
  const dots = {
    'Valid': 'bg-green-400',
    'Expiring Soon': 'bg-amber-400',
    'Expired': 'bg-red-400',
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${dots[status]}`}></span>
      {status}
    </span>
  );
}

function CredentialCard({ cred }) {
  const bg = {
    'Valid': 'bg-white border-green-100',
    'Expiring Soon': 'bg-amber-50 border-amber-200',
    'Expired': 'bg-red-50 border-red-200',
  };
  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-1 ${bg[cred.status] || 'bg-white border-slate-100'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-semibold text-slate-800 leading-tight">{cred.type}</div>
        <CredBadge status={cred.status} />
      </div>
      <div className="text-xs text-slate-500 font-mono">{cred.number}</div>
      <div className="text-xs text-slate-600">
        Expires: <span className="font-medium">{new Date(cred.expiry).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}

const ROLE_COLORS = {
  RN:  'bg-purple-100 text-purple-700',
  CNA: 'bg-blue-100 text-blue-700',
  HHA: 'bg-teal-100 text-teal-700',
  PT:  'bg-orange-100 text-orange-700',
};

function StaffCard({ member }) {
  const [expanded, setExpanded] = useState(false);
  const creds = CREDENTIALS[member.id] || [];
  const hasIssue = creds.some(c => c.status === 'Expired' || c.status === 'Expiring Soon');

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${hasIssue ? 'border-amber-200' : 'border-slate-100'} hover:shadow-md`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
            member.status === 'Active' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
            member.status === 'On Leave' ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white' :
            'bg-slate-200 text-slate-500'
          }`}>
            {member.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
              <span className="font-semibold text-slate-900 text-sm">{member.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${ROLE_COLORS[member.role]}`}>{member.role}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={member.status} />
              {hasIssue && (
                <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <span>⚠️</span> Credential alert
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-1">{member.email}</div>
          </div>
        </div>

        {/* Credentials preview */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {creds.map(c => (
            <span key={c.id} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              c.status === 'Valid' ? 'bg-green-50 text-green-700 border-green-200' :
              c.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-700 border-amber-300' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {c.type.split(' ')[0]}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
        >
          {expanded ? '▲ Hide details' : '▼ View credentials'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-4 bg-slate-50/50 rounded-b-xl">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Credentials</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {creds.map(cred => (
              <CredentialCard key={cred.id} cred={cred} />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 flex gap-4 text-xs text-slate-500">
            <span>📞 {member.phone}</span>
            <span>📅 Since {new Date(member.joinDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StaffCredentials() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [credFilter, setCredFilter] = useState('All');

  // Compute expiring credentials for alert banner
  const expiringAlerts = useMemo(() => {
    const alerts = [];
    STAFF.forEach(s => {
      (CREDENTIALS[s.id] || []).forEach(c => {
        if (c.status === 'Expiring Soon' || c.status === 'Expired') {
          alerts.push({ staff: s.name, cred: c.type, expiry: c.expiry, status: c.status });
        }
      });
    });
    return alerts;
  }, []);

  const expiringSoon = expiringAlerts.filter(a => a.status === 'Expiring Soon');
  const expired = expiringAlerts.filter(a => a.status === 'Expired');

  const filtered = useMemo(() => {
    return STAFF.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'All' || s.role === roleFilter;
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      const creds = CREDENTIALS[s.id] || [];
      const matchCred = credFilter === 'All' ||
        creds.some(c => c.status === credFilter);
      return matchSearch && matchRole && matchStatus && matchCred;
    });
  }, [search, roleFilter, statusFilter, credFilter]);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Staff & Credentials</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your care team credentials and compliance status</p>
      </div>

      {/* Alert Banners */}
      {expiringSoon.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <div className="font-semibold text-amber-900 text-sm">
              {expiringSoon.length} credential{expiringSoon.length > 1 ? 's' : ''} expiring in the next 30 days
            </div>
            <div className="text-amber-800 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
              {expiringSoon.map((a, i) => (
                <span key={i}>
                  <span className="font-medium">{a.staff}</span> — {a.cred} (exp. {new Date(a.expiry).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {expired.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🚨</span>
          <div>
            <div className="font-semibold text-red-900 text-sm">
              {expired.length} expired credential{expired.length > 1 ? 's' : ''} require immediate attention
            </div>
            <div className="text-red-800 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
              {expired.map((a, i) => (
                <span key={i}>
                  <span className="font-medium">{a.staff}</span> — {a.cred} (expired {new Date(a.expiry).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Staff',    value: STAFF.length,                                          color: 'text-slate-800', bg: 'bg-white' },
          { label: 'Active',         value: STAFF.filter(s => s.status === 'Active').length,       color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Expiring Soon',  value: expiringSoon.length,                                   color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Expired',        value: expired.length,                                        color: 'text-red-700',   bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-slate-100 p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍  Search staff by name or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
        />
        <select
          value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
        >
          {['All', 'RN', 'CNA', 'HHA', 'PT'].map(r => <option key={r}>{r}</option>)}
        </select>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
        >
          {['All', 'Active', 'Inactive', 'On Leave'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={credFilter} onChange={e => setCredFilter(e.target.value)}
          className="text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
        >
          {['All', 'Valid', 'Expiring Soon', 'Expired'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Staff Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No staff match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(member => <StaffCard key={member.id} member={member} />)}
        </div>
      )}
      <div className="mt-4 text-xs text-slate-400">Showing {filtered.length} of {STAFF.length} staff members</div>
    </div>
  );
}
