import React, { useState } from 'react';
import { TimerEngine, cn } from '../App';
import { Timer, Clock, Play } from 'lucide-react';

const TimerTool = ({ duration }: { duration?: number }) => {
  const [minutes, setMinutes] = useState(duration ? duration / 60 : 5);
  const [isStarted, setIsStarted] = useState(!!duration);

  const presets = [1, 3, 5, 10, 15, 25, 30, 45, 60];

  if (isStarted) {
    return (
      <div className="w-full flex flex-col items-center">
        <TimerEngine 
          initialSeconds={minutes * 60} 
          onComplete={() => setIsStarted(false)}
          type="timer"
          title={`${minutes} Minute Timer`}
        />
        <button
          onClick={() => setIsStarted(false)}
          className="mt-12 text-white/40 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
        >
          Cancel Timer
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-12">
      <div className="text-center space-y-4">
        <div className="text-8xl font-black tracking-tighter text-indigo-glow">
          {minutes}<span className="text-4xl text-white/20 ml-2">min</span>
        </div>
        <input
          type="range"
          min="1"
          max="120"
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value))}
          className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-glow"
        />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {presets.map(p => (
          <button
            key={p}
            onClick={() => setMinutes(p)}
            className={cn(
              "glass py-4 rounded-2xl font-bold transition-all border-white/5",
              minutes === p ? "bg-indigo-glow text-white border-indigo-glow/50" : "hover:bg-white/10 text-white/60"
            )}
          >
            {p}m
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsStarted(true)}
        className="w-full py-6 rounded-[32px] bg-indigo-glow text-white font-black text-2xl flex items-center justify-center gap-4 shadow-xl shadow-indigo-glow/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Play fill="currentColor" /> Start Timer
      </button>
    </div>
  );
};

export default TimerTool;
