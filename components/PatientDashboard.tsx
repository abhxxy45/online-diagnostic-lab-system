
import React, { useState } from 'react';
import { User, Appointment, AppointmentStatus, PaymentStatus } from '../types';
import { TEST_TYPES } from '../constants';
import { Calendar, CreditCard, Droplets, FlaskConical, CheckCircle, Search, Download, ExternalLink, Activity, ClipboardList } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientDashboardProps {
  user: User;
  appointments: Appointment[];
  onBookAppointment: (test: string, date: string, time: string) => void;
  onPay: (appointmentId: string) => void;
  onViewReport: (appointmentId: string) => void;
}

const mockHealthData = [
  { name: 'Jan', value: 85 },
  { name: 'Feb', value: 88 },
  { name: 'Mar', value: 92 },
  { name: 'Apr', value: 90 },
  { name: 'May', value: 94 },
  { name: 'Jun', value: 96 },
];

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, appointments, onBookAppointment, onPay, onViewReport }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTest, setSelectedTest] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const currentAppointment = appointments.find(a => a.status !== AppointmentStatus.READY);
  const completedAppointments = appointments.filter(a => a.status === AppointmentStatus.READY);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600/90 to-indigo-700/90 backdrop-blur-md rounded-[2.5rem] p-10 text-white shadow-2xl border border-white/10">
        <h1 className="text-4xl font-black mb-3">Hello, {user.name.split(' ')[0]}!</h1>
        <p className="opacity-80 max-w-xl text-lg leading-relaxed">Your digital health hub is ready. Monitor your tests and access reports in real-time.</p>
        
        {!currentAppointment && (
          <button 
            onClick={() => setShowBooking(true)}
            className="mt-8 px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95"
          >
            <Calendar size={20} />
            Book Lab Appointment
          </button>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Flow Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2 drop-shadow-md">
            <Activity className="text-blue-400" />
            Live Tracking
          </h2>
          
          {currentAppointment ? (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white">{currentAppointment.testType}</h3>
                  <p className="text-sm text-blue-200 font-medium">{currentAppointment.date} • {currentAppointment.time}</p>
                </div>
                <span className="px-5 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-100 rounded-full text-xs font-black uppercase tracking-widest">
                  {currentAppointment.status.replace('_', ' ')}
                </span>
              </div>

              {/* Status Flow Visualization */}
              <div className="relative flex justify-between mb-12">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                <StatusStep icon={<Calendar />} label="Booked" active={true} />
                <StatusStep icon={<CreditCard />} label="Paid" active={currentAppointment.paymentStatus === PaymentStatus.PAID} />
                <StatusStep icon={<Droplets />} label="Sampled" active={[AppointmentStatus.SAMPLED, AppointmentStatus.PROCESSING, AppointmentStatus.READY].includes(currentAppointment.status)} />
                <StatusStep icon={<FlaskConical />} label="Process" active={[AppointmentStatus.PROCESSING, AppointmentStatus.READY].includes(currentAppointment.status)} />
                <StatusStep icon={<CheckCircle />} label="Ready" active={currentAppointment.status === AppointmentStatus.READY} />
              </div>

              {/* Contextual Actions */}
              <div className="flex gap-4">
                {currentAppointment.status === AppointmentStatus.BOOKED && currentAppointment.paymentStatus === PaymentStatus.UNPAID && (
                  <button 
                    onClick={() => onPay(currentAppointment.id)}
                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <CreditCard size={18} />
                    Complete Payment (₹{currentAppointment.amount})
                  </button>
                )}
                {currentAppointment.paymentStatus === PaymentStatus.PAID && currentAppointment.status !== AppointmentStatus.READY && (
                  <div className="flex-1 py-4 bg-white/5 text-blue-100 border border-white/10 font-bold rounded-2xl text-center backdrop-blur-md">
                    Lab Technician is awaiting your arrival
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-dashed border-white/20 rounded-[2rem] p-16 text-center text-white/40">
              <Calendar className="mx-auto mb-6 opacity-20" size={64} />
              <p className="text-lg">You have no active laboratory tests scheduled.</p>
            </div>
          )}

          {/* Health Dashboard Summary */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-6">Health Index Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '1rem', color: '#fff' }} 
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Reports & History Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2 drop-shadow-md">
            <ClipboardList className="text-blue-400" />
            Report History
          </h2>
          
          <div className="space-y-4">
            {completedAppointments.length > 0 ? (
              completedAppointments.map(report => (
                <div key={report.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 hover:bg-white/20 transition-all group shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black text-white group-hover:text-blue-300 transition-colors">{report.testType}</h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/30">READY</span>
                  </div>
                  <p className="text-xs text-blue-200 font-medium mb-6 opacity-70">{report.date}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onViewReport(report.id)}
                      className="flex-1 py-3 text-xs font-black text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                      <Search size={14} /> View
                    </button>
                    <button className="flex-1 py-3 text-xs font-black text-gray-300 bg-white/5 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10">
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/5 rounded-[1.5rem] p-10 text-center text-white/30 italic text-sm">
                No past diagnostic records.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 p-8">
            <h3 className="text-2xl font-black text-white mb-8">Schedule Diagnostic</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Select Test</label>
                <select 
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white appearance-none"
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                >
                  <option value="" className="bg-slate-900">Choose a procedure...</option>
                  {TEST_TYPES.map(t => (
                    <option key={t.id} value={t.name} className="bg-slate-900">{t.name} - ₹{t.price}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Preferred Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Time Slot</label>
                  <input 
                    type="time" 
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-white"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  onClick={() => setShowBooking(false)}
                  className="flex-1 py-4 text-gray-400 font-black hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={!selectedTest || !bookingDate || !bookingTime}
                  onClick={() => {
                    onBookAppointment(selectedTest, bookingDate, bookingTime);
                    setShowBooking(false);
                  }}
                  className="flex-2 py-4 px-8 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-30 shadow-xl shadow-blue-900/40"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusStep: React.FC<{ icon: React.ReactNode; label: string; active: boolean }> = ({ icon, label, active }) => (
  <div className="relative flex flex-col items-center gap-3 z-10">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${active ? 'bg-blue-600 text-white border-blue-400 scale-110 shadow-xl shadow-blue-500/30' : 'bg-white/5 text-white/20 border-white/10'}`}>
      {/* Verify if the icon is a valid React element before cloning to inject props safely */}
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) : icon}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-blue-400' : 'text-white/20'}`}>{label}</span>
  </div>
);

export default PatientDashboard;
