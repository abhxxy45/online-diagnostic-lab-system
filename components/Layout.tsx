
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, User as UserIcon, Activity, ClipboardList, Database, CreditCard } from 'lucide-react';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header with Glassmorphism */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
              <Activity size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Swift<span className="text-blue-600">Lab</span></span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                  <span className="text-[10px] text-blue-600 uppercase font-bold tracking-widest">{user.role.replace('_', ' ')}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600">
                  <UserIcon size={20} />
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {user && (
          <aside className="w-full md:w-64 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl md:h-[calc(100vh-140px)] p-4 space-y-2 sticky top-24">
            <nav className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase px-3 py-2 tracking-widest">Main Menu</p>
              
              {user.role === UserRole.PATIENT && (
                <>
                  <NavItem icon={<Activity size={18} />} label="Health Dashboard" active />
                  <NavItem icon={<ClipboardList size={18} />} label="Appointments" />
                  <NavItem icon={<CreditCard size={18} />} label="Payments" />
                </>
              )}

              {user.role === UserRole.LAB_STAFF && (
                <>
                  <NavItem icon={<ClipboardList size={18} />} label="Sample Collection" active />
                  <NavItem icon={<Activity size={18} />} label="Process Tests" />
                  <NavItem icon={<Database size={18} />} label="Archive" />
                </>
              )}

              {user.role === UserRole.ADMIN && (
                <>
                  <NavItem icon={<Database size={18} />} label="Manage Users" active />
                  <NavItem icon={<Activity size={18} />} label="Lab Inventory" />
                  <NavItem icon={<CreditCard size={18} />} label="Financial Reports" />
                </>
              )}
            </nav>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <footer className="mt-auto bg-white/10 backdrop-blur-md border-t border-white/10 py-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SwiftLab Diagnostic Systems. All rights reserved.
      </footer>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-700 hover:bg-white/40'}`}>
    {icon}
    {label}
  </button>
);

export default Layout;
