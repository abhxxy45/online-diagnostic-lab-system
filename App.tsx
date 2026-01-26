
import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, Appointment, AppointmentStatus, PaymentStatus } from './types';
import Layout from './components/Layout';
import PatientDashboard from './components/PatientDashboard';
import LabDashboard from './components/LabDashboard';
import PaymentModule from './components/PaymentModule';
import ReportViewer from './components/ReportViewer';
import BackgroundVideo from './components/BackgroundVideo';
import { Activity, ShieldCheck, Mail, Lock } from 'lucide-react';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Abhay Verma', email: 'patient@example.com', role: UserRole.PATIENT },
  { id: 'u2', name: 'Dr. Smith', email: 'lab@example.com', role: UserRole.LAB_STAFF },
  { id: 'u3', name: 'System Admin', email: 'admin@example.com', role: UserRole.ADMIN },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activePayment, setActivePayment] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === loginForm.email);
    if (user) {
      setCurrentUser(user);
    } else {
      alert('Invalid credentials. Try: patient@example.com, lab@example.com, or admin@example.com');
    }
  };

  const handleBookAppointment = (test: string, date: string, time: string) => {
    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: currentUser?.id || 'guest',
      testType: test,
      date,
      time,
      status: AppointmentStatus.BOOKED,
      paymentStatus: PaymentStatus.UNPAID,
      amount: 1500, // Fixed price for demo
    };
    setAppointments(prev => [...prev, newApp]);
  };

  const handlePaymentSuccess = () => {
    if (!activePayment) return;
    setAppointments(prev => prev.map(a => 
      a.id === activePayment ? { ...a, paymentStatus: PaymentStatus.PAID } : a
    ));
    setActivePayment(null);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, status } : a
    ));
  };

  const renderAuthContent = () => {
    if (!currentUser) {
      return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex flex-col items-center mb-10">
              <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-blue-200">
                <Activity size={32} />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">SwiftLab Access</h1>
              <p className="text-gray-500 font-medium">Secure Diagnostic Management</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-gray-900"
                    value={loginForm.email}
                    onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all text-gray-900"
                    value={loginForm.password}
                    onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-400/30 transition-all flex items-center justify-center gap-2 text-lg">
                <ShieldCheck size={20} />
                Authenticate
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200/50 space-y-4">
               <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl text-blue-700 text-xs font-medium border border-blue-100/50">
                 <span>Demo Access:</span>
                 <div className="flex gap-2 font-bold">
                   <span className="cursor-pointer underline" onClick={() => setLoginForm({email: 'patient@example.com', password: 'password'})}>Patient</span>
                   <span className="cursor-pointer underline" onClick={() => setLoginForm({email: 'lab@example.com', password: 'password'})}>Lab Staff</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Layout user={currentUser} onLogout={() => setCurrentUser(null)}>
        {currentUser.role === UserRole.PATIENT && (
          <PatientDashboard 
            user={currentUser} 
            appointments={appointments.filter(a => a.patientId === currentUser.id)}
            onBookAppointment={handleBookAppointment}
            onPay={setActivePayment}
            onViewReport={setViewingReport}
          />
        )}

        {currentUser.role === UserRole.LAB_STAFF && (
          <LabDashboard 
            user={currentUser}
            appointments={appointments}
            onUpdateStatus={updateAppointmentStatus}
          />
        )}

        {currentUser.role === UserRole.ADMIN && (
          <div className="p-8 text-center space-y-6 bg-white/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Administrative Command Center</h2>
            <p className="text-gray-600 max-w-lg mx-auto">You are logged in with full administrative privileges. Use the sidebar to manage users, view financial logs, and audit lab activities.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8">
              <AdminQuickStat label="Total Patients" value="1,284" />
              <AdminQuickStat label="Today's Revenue" value="₹42,500" />
              <AdminQuickStat label="Active Staff" value="12" />
            </div>
          </div>
        )}

        {activePayment && (
          <PaymentModule 
            amount={appointments.find(a => a.id === activePayment)?.amount || 0}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setActivePayment(null)}
          />
        )}

        {viewingReport && (
          <ReportViewer 
            appointment={appointments.find(a => a.id === viewingReport)!}
            onClose={() => setViewingReport(null)}
          />
        )}
      </Layout>
    );
  };

  return (
    <>
      <BackgroundVideo />
      {renderAuthContent()}
    </>
  );
};

const AdminQuickStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm">
    <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter mb-1">{label}</p>
    <p className="text-3xl font-extrabold text-blue-600">{value}</p>
  </div>
);

export default App;
