
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Billing', path: '/billing', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-3 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tighter text-white uppercase italic">ECOSMART</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === item.path 
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">LOCAL LINK</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{user.esp32Ip}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10 hidden lg:block"></div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{user.username}</p>
               <button 
                 onClick={onLogout}
                 className="text-[10px] font-black text-red-500 uppercase hover:text-red-400 transition-colors tracking-tighter"
               >
                 Disconnect
               </button>
             </div>
             <div className="w-9 h-9 rounded-xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-black text-xs uppercase shadow-inner text-white">
               {user.username.charAt(0)}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10">
        <Outlet />
      </main>

      {/* Footer Ticker */}
      <footer className="glass-panel border-t border-white/5 py-3 px-6 text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
          DATA SYNC: <span className="text-emerald-500">ACTIVE</span> &nbsp; | &nbsp; 
          ESP32 STATUS: <span className="text-emerald-500">ONLINE</span> &nbsp; | &nbsp; 
          ENCRYPTION: <span className="text-emerald-500">AES-256</span>
        </p>
      </footer>
    </div>
  );
};

export default Layout;
