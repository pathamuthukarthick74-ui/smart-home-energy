import React from 'react';

const Billing: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem]">
        <h1 className="text-4xl font-black text-white italic tracking-tighter">
          BILLING
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Energy consumption and billing overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Rate Slab
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            Slab 02
          </p>
        </div>

        <div className="glass-panel p-6 rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Accrued Cost
          </p>
          <p className="text-2xl font-black text-white mt-2">
            $42.85
          </p>
        </div>

        <div className="glass-panel p-6 rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Status
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            ACTIVE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Billing;