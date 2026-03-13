import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Flag, Trash2 } from 'lucide-react';
import { cn } from '../App';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      h: hours.toString().padStart(2, '0'),
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0')
    };
  };

  const t = formatTime(time);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps(prev => [time, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4">Stopwatch</h1>
        <p className="text-white/40 text-xl">Precision time tracking with lap support.</p>
      </div>

      <div className="glass p-12 md:p-24 rounded-[60px] mb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
        
        <div className="flex justify-center items-baseline gap-2 mb-12">
          <motion.span 
            key={t.h}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-9xl font-bold tracking-tighter tabular-nums"
          >
            {t.h}
          </motion.span>
          <span className="text-4xl md:text-6xl font-bold text-white/20">:</span>
          <motion.span 
            key={t.m}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-9xl font-bold tracking-tighter tabular-nums"
          >
            {t.m}
          </motion.span>
          <span className="text-4xl md:text-6xl font-bold text-white/20">:</span>
          <motion.span 
            key={t.s}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl md:text-9xl font-bold tracking-tighter tabular-nums"
          >
            {t.s}
          </motion.span>
          <span className="text-2xl md:text-4xl font-bold text-white/20 ml-2 tabular-nums">.{t.ms}</span>
        </div>

        <div className="flex justify-center items-center gap-6">
          <button
            onClick={handleReset}
            className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
          >
            <RotateCcw size={32} />
          </button>
          
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl",
              isRunning 
                ? "bg-white/10 text-white border border-white/20" 
                : "bg-yellow-400 text-black shadow-yellow-400/20"
            )}
          >
            {isRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning && time === 0}
            className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white disabled:opacity-20"
          >
            <Flag size={32} />
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[40px] overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold">Laps</h2>
            <button 
              onClick={() => setLaps([])}
              className="text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {laps.map((lapTime, index) => {
              const lt = formatTime(lapTime);
              return (
                <div 
                  key={laps.length - index}
                  className="px-8 py-4 flex justify-between items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <span className="text-white/40 font-mono">Lap {laps.length - index}</span>
                  <span className="text-xl font-bold tabular-nums">
                    {lt.h}:{lt.m}:{lt.s}.{lt.ms}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Stopwatch;
