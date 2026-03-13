import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, SkipForward, Brain, Coffee, Award, Flame } from 'lucide-react';
import { cn } from '../App';

const PomodoroTimer = () => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleComplete = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setSessions(prev => prev + 1);
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const skipBreak = () => {
    setMode('focus');
    setTimeLeft(25 * 60);
    setIsRunning(false);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4">Pomodoro Timer</h1>
        <p className="text-white/40 text-xl">Focus and break cycles for peak productivity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="glass p-8 rounded-[40px] flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-red-400/10 text-red-400">
            <Flame size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Sessions</div>
            <div className="text-3xl font-black">{sessions}</div>
          </div>
        </div>
        <div className="glass p-8 rounded-[40px] flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-indigo-glow/10 text-indigo-glow">
            <Award size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Focus Time</div>
            <div className="text-3xl font-black">{sessions * 25}m</div>
          </div>
        </div>
        <div className="glass p-8 rounded-[40px] flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-emerald-400/10 text-emerald-400">
            <Brain size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Current Mode</div>
            <div className="text-3xl font-black capitalize">{mode}</div>
          </div>
        </div>
      </div>

      <div className={cn(
        "glass p-12 md:p-24 rounded-[60px] text-center relative overflow-hidden transition-all duration-700",
        mode === 'focus' ? "bg-red-400/5" : "bg-emerald-400/5"
      )}>
        <div className={cn(
          "absolute top-0 left-0 w-full h-2 transition-all duration-700",
          mode === 'focus' ? "bg-red-400 shadow-[0_0_20px_rgba(248,113,113,0.5)]" : "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
        )} />

        <div className="flex justify-center gap-4 mb-12">
          <div className={cn(
            "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest border transition-all",
            mode === 'focus' ? "bg-red-400/20 border-red-400 text-red-400" : "bg-white/5 border-white/10 text-white/20"
          )}>
            Focus
          </div>
          <div className={cn(
            "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest border transition-all",
            mode === 'break' ? "bg-emerald-400/20 border-emerald-400 text-emerald-400" : "bg-white/5 border-white/10 text-white/20"
          )}>
            Break
          </div>
        </div>

        <motion.div 
          key={timeLeft}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[10rem] md:text-[14rem] font-black tracking-tighter tabular-nums leading-none mb-12"
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className="flex justify-center items-center gap-8">
          <button
            onClick={() => setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60)}
            className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
          >
            <RotateCcw size={32} />
          </button>
          
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl",
              isRunning 
                ? "bg-white/10 text-white border border-white/20" 
                : mode === 'focus' ? "bg-red-400 text-black" : "bg-emerald-400 text-black"
            )}
          >
            {isRunning ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
          </button>

          {mode === 'break' && (
            <button
              onClick={skipBreak}
              className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
            >
              <SkipForward size={32} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
