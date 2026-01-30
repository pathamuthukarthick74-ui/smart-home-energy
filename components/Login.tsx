
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', homeId: '', esp32Ip: '192.168.1.10' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.email && formData.homeId && formData.esp32Ip) {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md glass-panel p-10 rounded-[3rem] relative z-10 border border-white/5">
        <div className="flex items-center gap-4 mb-10 justify-center">
          <div className="w-14 h-14 bg-emerald-500 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">EcoSmart</h1>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white tracking-tight">Node Handshake</h2>
          <p className="text-slate-500 font-medium mt-1">Authenticate IoT system link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identity</label>
            <input 
              type="text" 
              required
              placeholder="System Username"
              className="w-full bg-white/[0.02] border border-white/5 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-700 font-medium"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Device IP Address</label>
            <div className="relative">
              <input 
                type="text" 
                required
                placeholder="192.168.1.XX"
                className="w-full bg-white/[0.02] border border-white/5 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-700 font-mono"
                value={formData.esp32Ip}
                onChange={(e) => setFormData({...formData, esp32Ip: e.target.value})}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-500 uppercase">Auto-Scan</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hub ID</label>
              <input 
                type="text" 
                required
                placeholder="ESP_NODE_01"
                className="w-full bg-white/[0.02] border border-white/5 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-700 text-sm font-bold"
                value={formData.homeId}
                onChange={(e) => setFormData({...formData, homeId: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Region</label>
              <input 
                type="text" 
                placeholder="US-EAST-1"
                readOnly
                className="w-full bg-white/5 border border-white/5 text-slate-400 px-5 py-4 rounded-2xl outline-none text-sm font-bold cursor-not-allowed"
                value="Global Cloud"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cloud Sync Email</label>
            <input 
              type="email" 
              required
              placeholder="auth@ecosmart.io"
              className="w-full bg-white/[0.02] border border-white/5 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all outline-none placeholder:text-slate-700 font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] mt-4 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Initiate Connection
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
           <div className="h-[1px] w-12 bg-white/10"></div>
           <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black">
             WPA3-AES Encrypted
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
