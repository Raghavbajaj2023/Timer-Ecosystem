import React, { useState } from 'react';
import { Clock, Plus, Minus, RotateCcw, Calculator } from 'lucide-react';
import { cn } from '../App';

const TimeCalculator = () => {
  const [rows, setRows] = useState([{ h: 0, m: 0, s: 0, op: '+' }]);

  const addRow = () => setRows([...rows, { h: 0, m: 0, s: 0, op: '+' }]);
  const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index));
  
  const updateRow = (index: number, field: string, value: any) => {
    const newRows = [...rows];
    (newRows[index] as any)[field] = value;
    setRows(newRows);
  };

  const calculateTotal = () => {
    let totalSeconds = 0;
    rows.forEach(row => {
      const rowSeconds = (row.h * 3600) + (row.m * 60) + row.s;
      if (row.op === '+') totalSeconds += rowSeconds;
      else totalSeconds -= rowSeconds;
    });

    const isNegative = totalSeconds < 0;
    totalSeconds = Math.abs(totalSeconds);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return { h, m, s, isNegative };
  };

  const total = calculateTotal();

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
            <div className="flex-1 glass p-4 rounded-2xl border-white/5 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={row.h}
                  onChange={(e) => updateRow(i, 'h', parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                <span className="text-xs font-bold text-white/40 uppercase">h</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={row.m}
                  onChange={(e) => updateRow(i, 'm', parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                <span className="text-xs font-bold text-white/40 uppercase">m</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={row.s}
                  onChange={(e) => updateRow(i, 's', parseInt(e.target.value) || 0)}
                  className="w-16 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
                <span className="text-xs font-bold text-white/40 uppercase">s</span>
              </div>
              
              <div className="flex-1" />

              <button
                onClick={() => updateRow(i, 'op', row.op === '+' ? '-' : '+')}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  row.op === '+' ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                )}
              >
                {row.op === '+' ? <Plus size={18} /> : <Minus size={18} />}
              </button>
            </div>
            
            {rows.length > 1 && (
              <button
                onClick={() => removeRow(i)}
                className="p-3 rounded-xl bg-white/5 hover:bg-red-400/10 text-white/20 hover:text-red-400 transition-all"
              >
                <Minus size={20} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={addRow}
          className="glass px-8 py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 font-bold text-yellow-400"
        >
          <Plus size={20} /> Add Duration
        </button>
        <button
          onClick={() => setRows([{ h: 0, m: 0, s: 0, op: '+' }])}
          className="glass px-8 py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 font-bold text-white/40"
        >
          <RotateCcw size={20} /> Reset
        </button>
      </div>

      <div className="glass rounded-[40px] p-12 text-center space-y-4 border-white/10 shadow-2xl shadow-yellow-400/5">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Total Result</div>
        <div className={cn(
          "text-7xl md:text-8xl font-black tracking-tighter",
          total.isNegative ? "text-red-400" : "text-yellow-400"
        )}>
          {total.isNegative && "-"}
          {total.h.toString().padStart(2, '0')}:
          {total.m.toString().padStart(2, '0')}:
          {total.s.toString().padStart(2, '0')}
        </div>
        <div className="text-white/20 font-medium">
          {total.h} hours, {total.m} minutes, {total.s} seconds
        </div>
      </div>
    </div>
  );
};

export default TimeCalculator;
