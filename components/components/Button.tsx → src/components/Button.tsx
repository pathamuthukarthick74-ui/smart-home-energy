
import React, { useMemo } from 'react';
import { getHistoricalBills } from '../services/mockData';

const Billing: React.FC = () => {
  const history = getHistoricalBills();

  const currentEstimates = useMemo(() => {
    const units = 342; 
    let cost = 0;
    if (units <= 100) cost = units * 0.05;
    else if (units <= 400) cost = (100 * 0.05) + (units - 100) * 0.12;
    else cost = (100 * 0.05) + (300 * 0.12) + (units - 400) * 0.18;

    return { units, cost: cost.toFixed(2) };
  }, []);

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Billing Matrix</h1>
          <p className="text-slate-500 text-lg font-medium mt-2 tracking-tight">Advanced Electricity Board Tariff Engine</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Cycle Progress</p>
          <div className="flex items-center gap-4">
             <span className="text-2xl font-black text-white">72%</span>
             <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[72%] shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Bill Card */}
        <div className="lg:col-span-7 glass-panel p-10 rounded-[3rem] relative overflow-hidden border-emerald-500/20 emerald-glow">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.25em] mb-2">Statement Balance</p>
                <h2 className="text-7xl font-black text-white tracking-tighter">${currentEstimates.cost}</h2>
              </div>
              <div className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                Est. Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-auto">
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Units Consumed</p>
                 <p className="text-3xl font-black text-white tracking-tight">{currentEstimates.units} <span className="text-sm font-medium text-slate-500 uppercase">kWh</span></p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cycle Remaining</p>
                 <p className="text-3xl font-black text-white tracking-tight">12 <span className="text-sm font-medium text-slate-500 uppercase">Days</span></p>
               </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
              <button className="flex-1 bg-white text-black font-black uppercase text-xs tracking-widest py-4 rounded-2xl hover:bg-emerald-500 transition-all">
                Pay Statement
              </button>
              <button className="flex-1 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl hover:bg-white/10 transition-all">
                Detailed Log
              </button>
            </div>
          </div>
        </div>

        {/* Tariffs & Stats */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="glass-panel p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">EB Slabs</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Basic Slab', units: '0-100', price: '$0.05' },
                   { label: 'Standard Slab', units: '101-400', price: '$0.12', active: true },
                   { label: 'Premium Slab', units: '401+', price: '$0.18' }
                 ].map((slab, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${slab.active ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-white/[0.02] border border-white/5 opacity-50'}`}>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{slab.label}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-tighter">{slab.units} Units</p>
                      </div>
                      <span className="text-emerald-400 font-black text-lg">{slab.price}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-black">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                   <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
                 </div>
                 <h3 className="font-black uppercase tracking-widest text-sm">Efficiency Tip</h3>
              </div>
              <p className="font-bold text-sm leading-relaxed mb-4">You've hit Slab 2 early this month. Reducing HVAC usage by 15% tonight could save you $8.40.</p>
              <div className="h-[1px] bg-black/10 w-full mb-4"></div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Insight by Gemini 2.5</p>
           </div>
        </div>
      </div>

      {/* Simplified History Table */}
      <div className="glass-panel rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight">Ledger History</h3>
          <button className="text-xs font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-colors">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-10 py-5">Month Cycle</th>
                <th className="px-10 py-5">Meter Reading</th>
                <th className="px-10 py-5">Net Amount</th>
                <th className="px-10 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((bill, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-10 py-6 font-bold text-slate-200 group-hover:text-white">{bill.month}</td>
                  <td className="px-10 py-6 text-slate-400 font-mono">{bill.units} kWh</td>
                  <td className="px-10 py-6 text-emerald-400 font-black">${bill.cost.toFixed(2)}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${bill.status === 'Paid' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></span>
                      <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{bill.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
