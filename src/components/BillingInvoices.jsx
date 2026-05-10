import { useState, useMemo } from 'react';
import { INVOICES } from '../data/mockData';

const STATUS_STYLE = {
  'Draft':   'bg-slate-100 text-slate-600 border border-slate-200',
  'Sent':    'bg-blue-100 text-blue-700 border border-blue-200',
  'Paid':    'bg-green-100 text-green-700 border border-green-200',
  'Overdue': 'bg-red-100 text-red-700 border border-red-200',
};

function fmt(n) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 }).format(n);
}

function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{invoice.id}</div>
              <h3 className="text-lg font-bold text-slate-900">{invoice.patientName}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{invoice.period}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none p-1 -mt-1">×</button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Hours</div>
              <div className="text-lg font-bold text-slate-800">{invoice.hours}h</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Rate</div>
              <div className="text-lg font-bold text-slate-800">{fmt(invoice.rate)}/hr</div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
            <span className="font-medium text-slate-700">Total Amount</span>
            <span className="text-2xl font-bold text-slate-900">{fmt(invoice.amount)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div>
              <span className="text-xs text-slate-400 block">Issued</span>
              {new Date(invoice.issuedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Due</span>
              <span className={invoice.status === 'Overdue' ? 'text-red-600 font-medium' : ''}>
                {new Date(invoice.dueDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm text-slate-600">Status:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[invoice.status]}`}>{invoice.status}</span>
          </div>
          <div className="flex gap-2 pt-1">
            {invoice.status === 'Overdue' && (
              <button className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                💳 Mark as Paid
              </button>
            )}
            {invoice.status === 'Draft' && (
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                📤 Send Invoice
              </button>
            )}
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingInvoices() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]             = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const stats = useMemo(() => {
    const thisMonth = INVOICES;
    const billed    = thisMonth.reduce((s, i) => s + i.amount, 0);
    const collected = thisMonth.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
    const outstanding = thisMonth.filter(i => i.status !== 'Paid' && i.status !== 'Draft').reduce((s, i) => s + i.amount, 0);
    const overdue   = thisMonth.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
    return { billed, collected, outstanding, overdue, count: thisMonth.length };
  }, []);

  const filtered = useMemo(() => {
    return INVOICES.filter(i => {
      const matchStatus = statusFilter === 'All' || i.status === statusFilter;
      const matchSearch = i.patientName.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [statusFilter, search]);

  function exportCSV() {
    const headers = ['Invoice ID', 'Patient', 'Period', 'Hours', 'Rate', 'Amount', 'Status', 'Due Date'];
    const rows = INVOICES.map(i => [i.id, i.patientName, i.period, i.hours, i.rate, i.amount, i.status, i.dueDate]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'healthdesk-invoices.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const collectionRate = Math.round((stats.collected / stats.billed) * 100);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
          <p className="text-slate-500 text-sm mt-1">April – May 2026 billing period</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <span>📥</span> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Billed',   value: fmt(stats.billed),     sub: `${stats.count} invoices`,            color: 'text-slate-800', bg: 'bg-white border-slate-100' },
          { label: 'Collected',      value: fmt(stats.collected),  sub: `${collectionRate}% collection rate`, color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
          { label: 'Outstanding',    value: fmt(stats.outstanding), sub: 'Sent & awaiting payment',           color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-100' },
          { label: 'Overdue',        value: fmt(stats.overdue),    sub: 'Requires follow-up',                 color: 'text-red-700',   bg: 'bg-red-50 border-red-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border p-4`}>
            <div className={`text-xl md:text-2xl font-bold ${s.color} leading-tight`}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">{s.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Collection progress */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Collection Rate</span>
          <span className={`text-sm font-bold ${collectionRate >= 80 ? 'text-green-600' : 'text-amber-600'}`}>{collectionRate}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${collectionRate >= 80 ? 'bg-green-500' : 'bg-amber-500'}`}
            style={{ width: `${collectionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text" placeholder="🔍  Search by patient or invoice ID…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-40 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
        />
        <div className="flex gap-2 flex-wrap">
          {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                statusFilter === f
                  ? f === 'Overdue' ? 'bg-red-500 text-white border-red-500' :
                    f === 'Paid' ? 'bg-green-500 text-white border-green-500' :
                    f === 'Sent' ? 'bg-blue-500 text-white border-blue-500' :
                    f === 'Draft' ? 'bg-slate-500 text-white border-slate-500' :
                    'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Invoice table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Invoice</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Period</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Hours</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Rate</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Due</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" className="py-12 text-center text-slate-400">No invoices match your filters.</td></tr>
              ) : (
                filtered.map(inv => (
                  <tr
                    key={inv.id}
                    className={`border-b border-slate-50 hover:bg-slate-50/60 cursor-pointer transition-colors ${
                      inv.status === 'Overdue' ? 'bg-red-50/20' : ''
                    }`}
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">{inv.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{inv.patientName}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">{inv.period}</td>
                    <td className="py-3 px-4 text-right text-slate-600 hidden sm:table-cell">{inv.hours}h</td>
                    <td className="py-3 px-4 text-right text-slate-600 hidden lg:table-cell">{fmt(inv.rate)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">{fmt(inv.amount)}</td>
                    <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell">
                      <span className={inv.status === 'Overdue' ? 'text-red-600 font-medium' : ''}>
                        {new Date(inv.dueDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                      {inv.status === 'Overdue' && (
                        <button className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
                          💳 Pay Now
                        </button>
                      )}
                      {inv.status === 'Draft' && (
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          📤 Send
                        </button>
                      )}
                      {inv.status === 'Sent' && (
                        <button className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors">
                          Remind
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filtered.length} of {INVOICES.length} invoices</span>
          <span className="font-medium text-slate-600">
            Total shown: {fmt(filtered.reduce((s, i) => s + i.amount, 0))}
          </span>
        </div>
      </div>

      {/* Invoice modal */}
      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
}
