
import React from 'react';
import { User, Appointment, AppointmentStatus, PaymentStatus } from '../types';
import { Microscope, Droplets, CheckCircle2, Clock, MapPin, User as UserIcon } from 'lucide-react';

interface LabDashboardProps {
  user: User;
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

const LabDashboard: React.FC<LabDashboardProps> = ({ user, appointments, onUpdateStatus }) => {
  const pendingCollection = appointments.filter(a => a.paymentStatus === PaymentStatus.PAID && a.status === AppointmentStatus.BOOKED);
  const inProcessing = appointments.filter(a => a.status === AppointmentStatus.SAMPLED || a.status === AppointmentStatus.PROCESSING);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Processing Station</h1>
          <p className="text-gray-500">Manage samples and test processing for today.</p>
        </div>
        <div className="flex gap-4">
          <StatCard icon={<Droplets className="text-blue-600" />} count={pendingCollection.length} label="Pending Collection" />
          <StatCard icon={<Microscope className="text-amber-600" />} count={inProcessing.length} label="In Process" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sample Collection Queue */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Droplets size={20} className="text-blue-500" />
            Collection Queue
          </h2>
          <div className="space-y-3">
            {pendingCollection.length > 0 ? pendingCollection.map(app => (
              <LabCard 
                key={app.id} 
                appointment={app} 
                actionLabel="Collect Sample"
                onAction={() => onUpdateStatus(app.id, AppointmentStatus.SAMPLED)}
              />
            )) : (
              <EmptyState message="No pending collections." />
            )}
          </div>
        </section>

        {/* Processing Queue */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Microscope size={20} className="text-amber-500" />
            Testing Lab
          </h2>
          <div className="space-y-3">
            {inProcessing.length > 0 ? inProcessing.map(app => (
              <LabCard 
                key={app.id} 
                appointment={app} 
                actionLabel={app.status === AppointmentStatus.SAMPLED ? "Start Analysis" : "Generate Report"}
                onAction={() => onUpdateStatus(app.id, app.status === AppointmentStatus.SAMPLED ? AppointmentStatus.PROCESSING : AppointmentStatus.READY)}
                highlight={app.status === AppointmentStatus.PROCESSING}
              />
            )) : (
              <EmptyState message="No tests currently in processing." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; count: number; label: string }> = ({ icon, count, label }) => (
  <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 min-w-[160px]">
    <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-xs text-gray-500 font-medium uppercase">{label}</p>
    </div>
  </div>
);

const LabCard: React.FC<{ appointment: Appointment; actionLabel: string; onAction: () => void; highlight?: boolean }> = ({ appointment, actionLabel, onAction, highlight }) => (
  <div className={`bg-white border p-5 rounded-2xl transition-all shadow-sm ${highlight ? 'border-amber-200 ring-1 ring-amber-100 bg-amber-50/10' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="font-bold text-gray-900">{appointment.testType}</h4>
        <div className="flex items-center gap-4 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-500"><UserIcon size={12} /> PID: {appointment.patientId.slice(0, 8)}</span>
          <span className="flex items-center gap-1 text-xs text-gray-500"><Clock size={12} /> {appointment.time}</span>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${appointment.status === AppointmentStatus.PROCESSING ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
        {appointment.status}
      </span>
    </div>
    
    <div className="flex items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <MapPin size={12} /> Area B104
      </div>
      <button 
        onClick={onAction}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${highlight ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        <CheckCircle2 size={16} />
        {actionLabel}
      </button>
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    <p className="text-gray-400 text-sm italic">{message}</p>
  </div>
);

export default LabDashboard;
