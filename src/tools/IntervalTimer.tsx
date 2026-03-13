import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Settings2, Activity, Zap, Coffee } from 'lucide-react';
import { cn } from '../App';

const IntervalTimer = () => {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [cycles, setCycles] = useState(8);
  
  const [currentCycle, setCurrentCycle] = useState(1);
  const [phase, setPhase] = useState<'work' | 'rest' | 'complete'>('work');
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && phase !== 'complete') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
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
  }, [isRunning, phase]);

  const handlePhaseComplete = () => {
    if (phase === 'work') {
      setPhase('rest');
      setTimeLeft(restTime);
    } else {
      if (currentCycle < cycles) {
        setCurrentCycle(prev => prev + 1);
        setPhase('work');
        setTimeLeft(workTime);
      } else {
        setPhase('complete');
        setIsRunning(false);
      }
    }
  };

  const startSession = () => {
    setIsConfiguring(false);
    setCurrentCycle(1);
    setPhase('work');
    setTimeLeft(workTime);
    setIsRunning(true);
  };

  const resetSession = () => {
    setIsRunning(false);
    setIsConfiguring(true);
    setCurrentCycle(1);
    setPhase('work');
    setTimeLeft(workTime);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4">Interval Timer</h1>
        <p className="text-white/40 text-xl">Custom work and rest cycles for training.</p>
      </div>

      <AnimatePresence mode="wait">
        {isConfiguring ? (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 rounded-[60px] max-w-2xl mx-auto"
          >
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-400/10 text-emerald-400">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Work Interval</h3>
                    <p className="text-white/40">High intensity phase</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setWorkTime(Math.max(5, workTime - 5))} className="glass w-10 h-10 rounded-full">-</button>
                  <span className="text-3xl font-bold w-16 text-center">{workTime}s</span>
                  <button onClick={() => setWorkTime(workTime + 5)} className="glass w-10 h-10 rounded-full">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-blue-400/10 text-blue-400">
                    <Coffee size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Rest Interval</h3>
                    <p className="text-white/40">Recovery phase</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setRestTime(Math.max(5, restTime - 5))} className="glass w-10 h-10 rounded-full">-</button>
                  <span className="text-3xl font-bold w-16 text-center">{restTime}s</span>
                  <button onClick={() => setRestTime(restTime + 5)} className="glass w-10 h-10 rounded-full">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-violet-glow/10 text-violet-glow">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Cycles</h3>
                    <p className="text-white/40">Number of repetitions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setCycles(Math.max(1, cycles - 1))} className="glass w-10 h-10 rounded-full">-</button>
                  <span className="text-3xl font-bold w-16 text-center">{cycles}</span>
                  <button onClick={() => setCycles(cycles + 1)} className="glass w-10 h-10 rounded-full">+</button>
                </div>
              </div>

              <button
                onClick={startSession}
                className="w-full bg-emerald-400 text-black py-6 rounded-[32px] text-2xl font-black shadow-xl shadow-emerald-400/20 hover:scale-[1.02] transition-all mt-6"
              >
                START SESSION
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "glass p-12 md:p-24 rounded-[60px] text-center relative overflow-hidden transition-colors duration-500",
              phase === 'work' ? "bg-emerald-400/5" : phase === 'rest' ? "bg-blue-400/5" : "bg-white/5"
            )}
          >
            <div className={cn(
              "absolute top-0 left-0 w-full h-2 transition-all duration-500",
              phase === 'work' ? "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]" : phase === 'rest' ? "bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]" : "bg-white/20"
            )} />

            <div className="mb-8">
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/40">Cycle</span>
              <div className="text-4xl font-black">{currentCycle} / {cycles}</div>
            </div>

            <div className="mb-12">
              <motion.div
                key={phase}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                  "text-2xl font-bold uppercase tracking-widest mb-4",
                  phase === 'work' ? "text-emerald-400" : phase === 'rest' ? "text-blue-400" : "text-white"
                )}
              >
                {phase === 'work' ? 'Work' : phase === 'rest' ? 'Rest' : 'Complete!'}
              </motion.div>
              <div className="text-9xl font-black tracking-tighter tabular-nums">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex justify-center items-center gap-6">
              <button
                onClick={resetSession}
                className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <RotateCcw size={32} />
              </button>
              
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={phase === 'complete'}
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl",
                  isRunning 
                    ? "bg-white/10 text-white border border-white/20" 
                    : phase === 'work' ? "bg-emerald-400 text-black" : "bg-blue-400 text-black"
                )}
              >
                {isRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
              </button>

              <button
                onClick={() => setIsConfiguring(true)}
                className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <Settings2 size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntervalTimer;
