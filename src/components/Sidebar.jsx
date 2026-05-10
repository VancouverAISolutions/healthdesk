const NAV_ITEMS = [
  { id: 'staff',      label: 'Staff & Credentials', short: 'Staff',     icon: '👥' },
  { id: 'compliance', label: 'Compliance Tracker',  short: 'Compliance', icon: '✅' },
  { id: 'patients',   label: 'Patient Assignments', short: 'Patients',  icon: '🏥' },
  { id: 'scheduling', label: 'Visit Scheduling',    short: 'Schedule',  icon: '📅' },
  { id: 'billing',    label: 'Billing & Invoices',  short: 'Billing',   icon: '💰' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 z-40 shadow-xl">
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-2xl shadow-inner">🏥</div>
            <div>
              <div className="font-bold text-lg leading-tight tracking-tight">HealthDesk</div>
              <div className="text-xs text-slate-400 leading-tight">Home Health Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 mt-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                active === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <span className="text-xl w-7 text-center flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/60">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">V</div>
            <div className="text-xs text-slate-300 font-medium">VancouverAISolutions</div>
          </div>
          <div className="text-xs text-slate-500">HealthDesk v1.0 · Demo</div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 flex z-50 shadow-2xl">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              active === item.id ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="leading-tight">{item.short}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
