import React, { useState } from 'react';
import { cn } from '../App';

const EmbedTimerGenerator = () => {
  const [duration, setDuration] = useState(10);
  const [activity, setActivity] = useState('Study');
  const [method, setMethod] = useState('standard');

  const embedCode = `<iframe src="${window.location.origin}/embed-timer?duration=${duration * 60}&activity=${activity}&method=${method}" width="300" height="400" frameborder="0"></iframe>`;

  return (
    <div className="p-12 space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">Embed Timer Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl space-y-6">
          <label className="block">
            <span className="text-sm font-bold uppercase tracking-widest text-white/40">Duration (min)</span>
            <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full mt-2 p-3 bg-white/5 rounded-xl text-white" />
          </label>
          <label className="block">
            <span className="text-sm font-bold uppercase tracking-widest text-white/40">Activity</span>
            <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full mt-2 p-3 bg-white/5 rounded-xl text-white" />
          </label>
        </div>
        <div className="glass p-8 rounded-3xl space-y-4">
          <h2 className="text-xl font-bold">Embed Code</h2>
          <pre className="bg-black/20 p-4 rounded-xl text-xs overflow-x-auto text-white/60">{embedCode}</pre>
        </div>
      </div>
    </div>
  );
};

export default EmbedTimerGenerator;
