import React from 'react';
import { Link } from 'react-router-dom';

const TimerHub = () => {
  const durations = [5, 10, 15, 20, 25, 30, 45, 60];
  const activities = ['study', 'workout', 'meditation', 'reading', 'cooking', 'focus'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-6xl font-black tracking-tighter mb-16">Timer Hub</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {durations.map(d => activities.map(a => (
          <Link 
            key={`${d}-${a}`}
            to={`/timer/${d}-minute-${a}-timer`}
            className="glass p-6 rounded-2xl hover:bg-white/10 transition-all text-center"
          >
            <div className="text-2xl font-bold">{d}m</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">{a}</div>
          </Link>
        )))}
      </div>
    </div>
  );
};

export default TimerHub;
