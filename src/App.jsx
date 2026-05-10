import { useState } from 'react';
import Sidebar from './components/Sidebar';
import StaffCredentials from './components/StaffCredentials';
import ComplianceTracker from './components/ComplianceTracker';
import PatientAssignments from './components/PatientAssignments';
import VisitScheduling from './components/VisitScheduling';
import BillingInvoices from './components/BillingInvoices';

export default function App() {
  const [activeSection, setActiveSection] = useState('staff');

  const sections = {
    staff:      <StaffCredentials />,
    compliance: <ComplianceTracker />,
    patients:   <PatientAssignments />,
    scheduling: <VisitScheduling />,
    billing:    <BillingInvoices />,
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar active={activeSection} onNavigate={setActiveSection} />
      <main className="flex-1 md:ml-64 pb-16 md:pb-0 min-h-screen">
        <div className="fade-in" key={activeSection}>
          {sections[activeSection]}
        </div>
      </main>
    </div>
  );
}
