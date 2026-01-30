
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { generateRealTimeData, mockAlerts } from '../services/mockData';
import { getEnergyAdvice } from '../services/geminiService';
import { EnergyData, User } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'error' | 'success';
}

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<EnergyData[]>([]);
  const [currentData, setCurrentData] = useState<EnergyData | null>(null);
  const [deviceStates, setDeviceStates] = useState<Record<string, boolean>>({
    'Air Conditioner': true,
    'Refrigerator': true,
    'Washing Machine': false,
    'Lighting': true,
    'Home Theater': false
  });
  const [selectedAppliance, setSelectedAppliance] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<{tips: string[], potentialSavings: string} | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('eco_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const updateData = () => {
      // Pass current toggle states to generator
      const newData = generateRealTimeData(deviceStates);
      setCurrentData(newData);
      setHistory(prev => [...prev.slice(-29), newData]);
      
      // Auto alerts for high consumption
      if (newData.totalPower > 3000) {
        addToast("Alert: High Household Consumption! Consider disabling high-load nodes.", "warning");
      }
    };

    updateData();
    const interval = setInterval(updateData, 2500);
    return () => clearInterval(interval);
  }, [deviceStates]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const toggleDevice = (name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the graph when toggling
    const newState = !deviceStates[name];
    setDeviceStates(prev => ({ ...prev, [name]: newState }));
    addToast(`${name} has been remotely ${newState ? 'activated' : 'deactivated'}.`, newState ? 'success' : 'info');
  };

  useEffect(() => {
    if (history.length === 15 && !aiInsights) {
      setIsLoadingInsights(true);
      getEnergyAdvice(history).then(res => {
        setAiInsights(res);
        setIsLoadingInsights(false);
      });
    }
  }, [history.length, aiInsights]);

  const stats = useMemo(() => {
    if (!currentData) return { totalPower: 0, activeCount: 0 };
    return {
      totalPower: currentData.totalPower,
      activeCount: currentData.appliances.filter(a => a.isOn).length
    };
  }, [currentData]);

  if (!currentData) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Dynamic Notifications */}
      <div className="fixed top-24 right-6 z-[100] space-y-3 w-80 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`p-4 rounded-2xl glass-panel border-l-4 flex items-start gap-3 animate-in slide-in-from-right duration-300 pointer-events-auto shadow-2xl ${
            toast.type === 'warning' ? 'border-l-amber-500 bg-amber-500/10' : 
            toast.type === 'error' ? 'border-l-red-500 bg-red-500/10' : 
            toast.type === 'success' ? 'border-l-emerald-500 bg-emerald-500/10' : 'border-l-blue-500 bg-blue-500/10'
          }`}>
             <div className={`mt-1 rounded-full p-1 ${
               toast.type === 'warning' ? 'text-amber-500' : 
               toast.type === 'error' ? 'text-red-500' : 
               toast.type === 'success' ? 'text-emerald-500' : 'text-blue-500'
             }`}>
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
             </div>
             <p className="text-[11px] font-bold text-slate-100">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* Main Header / Global Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-emerald-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white italic tracking-tighter">NODE OVERSEER</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">ESP32 Handshake Active</span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">{user?.esp32Ip}</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Demand</p>
              <p className="text-4xl font-black text-white italic">{(stats.totalPower / 1000).toFixed(2)}<span className="text-sm font-bold text-emerald-500 ml-1">KW</span></p>
            </div>
            <div className="w-[1px] h-12 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Nodes</p>
              <p className="text-4xl font-black text-white italic">{stats.activeCount}<span className="text-sm font-bold text-slate-500 ml-1">/5</span></p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-emerald-500/5 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-sm font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Grid Health</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Current Load Stability</span>
              <span className="text-xs font-bold text-emerald-500">98.4%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" style={{ width: '98.4%' }}></div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-4 italic">No abnormal frequency spikes detected.</p>
          </div>
        </div>
      </div>

      {/* Appliance Control Center - Re-arranged for better usability */}
      <section className="glass-panel p-8 rounded-[3rem]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Appliance Control Center</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Manual Overrides Enabled</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {currentData.appliances.map((app, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedAppliance(app.name === selectedAppliance ? null : app.name)}
              className={`group p-6 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden ${
                selectedAppliance === app.name 
                  ? 'bg-emerald-500/10 border-emerald-500' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
              }`}
            >
              {/* Toggle Switch */}
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={(e) => toggleDevice(app.name, e)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${app.isOn ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${app.isOn ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-xs font-black shadow-inner transition-transform group-hover:scale-110 ${app.isOn ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  {app.name.substring(0,2).toUpperCase()}
                </div>
                
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{app.name}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-2xl font-black transition-colors ${app.isOn ? 'text-white' : 'text-slate-700'}`}>
                    {app.isOn ? app.power : 'OFF'}
                  </span>
                  {app.isOn && <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Watts</span>}
                </div>

                <div className="mt-auto flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'} ${app.status === 'online' && 'animate-pulse'}`}></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{app.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics Core */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Flux History */}
          <div className="glass-panel p-8 rounded-[3rem] border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Household Consumption Flux</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Stream</span>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="mainFlux" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} hide />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid #10b98130', borderRadius: '20px', fontSize: '12px' }}
                    itemStyle={{ color: '#10b981', fontWeight: '900' }}
                  />
                  <Area type="monotone" dataKey="totalPower" stroke="#10b981" fillOpacity={1} fill="url(#mainFlux)" strokeWidth={4} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Individual Analytics Drilldown (Conditional) */}
          {selectedAppliance && (
            <div className="glass-panel p-8 rounded-[3rem] border-emerald-500/20 bg-emerald-500/[0.02] animate-in slide-in-from-top duration-500">
               <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Isolated Analytics: {selectedAppliance}</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Direct ESP32 Feedback Loop</p>
                </div>
                <button onClick={() => setSelectedAppliance(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history.map(h => ({ timestamp: h.timestamp, power: h.appliances.find(a => a.name === selectedAppliance)?.power || 0 }))}>
                    <defs>
                      <linearGradient id="nodeDrill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                    <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                    <Area type="stepBefore" dataKey="power" stroke="#10b981" fillOpacity={1} fill="url(#nodeDrill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-panel p-8 rounded-[3rem] relative overflow-hidden bg-gradient-to-br from-emerald-950/20 to-black border-emerald-500/10 h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">AI Insight</h3>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Neural Pattern Analysis</p>
              </div>
            </div>
            
            {isLoadingInsights ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Crunching Power Packets...</p>
              </div>
            ) : aiInsights ? (
              <div className="space-y-6">
                <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Potential Monthly Yield</p>
                  <p className="text-5xl font-black text-white tracking-tighter">{aiInsights.potentialSavings}</p>
                </div>
                <div className="space-y-3">
                  {aiInsights.tips.map((tip, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group">
                      <span className="text-emerald-500 font-black text-sm italic opacity-40 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                      <p className="text-xs text-slate-300 font-bold leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xs text-slate-600 font-black uppercase tracking-widest leading-loose italic">
                  Aggregating high-fidelity data from ESP32 nodes.<br/>Actionable intelligence incoming.
                </p>
              </div>
            )}
          </div>

          {/* Billing Overview Widget */}
          <div className="glass-panel p-8 rounded-[3rem] border-white/5 bg-white/[0.01]">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Financial Status</h3>
               <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Ledger</div>
             </div>
             <div className="space-y-4">
               <div className="flex justify-between items-center p-4 rounded-2xl bg-black/40 border border-white/5">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rate Slab</span>
                 <span className="text-sm font-black text-emerald-400">Slab 02</span>
               </div>
               <div className="flex justify-between items-center p-4 rounded-2xl bg-black/40 border border-white/5">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accrued Cost</span>
                 <span className="text-sm font-black text-white">$42.85</span>
               </div>
             </div>
             <button className="w-full mt-8 py-5 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.25em] hover:bg-emerald-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                Analyze Billing Matrix
             </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
