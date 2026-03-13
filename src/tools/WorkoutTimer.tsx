import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Dumbbell, Zap, Timer, Flame } from 'lucide-react';
import { cn } from '../App';

const WorkoutTimer = () => {
  const [exerciseTime, setExerciseTime] = useState(45);
  const [restTime, setRestTime] = useState(15);
  const [rounds, setRounds] = useState(10);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<'exercise' | 'rest' | 'complete'>('exercise');
  const [timeLeft, setTimeLeft] = useState(exerciseTime);
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
    if (phase === 'exercise') {
      setPhase('rest');
      setTimeLeft(restTime);
    } else {
      if (currentRound < rounds) {
        setCurrentRound(prev => prev + 1);
        setPhase('exercise');
        setTimeLeft(exerciseTime);
      } else {
        setPhase('complete');
        setIsRunning(false);
      }
    }
  };

  const startWorkout = () => {
    setIsConfiguring(false);
    setCurrentRound(1);
    setPhase('exercise');
    setTimeLeft(exerciseTime);
    setIsRunning(true);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4">Workout Timer</h1>
        <p className="text-white/40 text-xl">Themed intervals for your fitness routine.</p>
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
                  <div className="p-4 rounded-2xl bg-orange-400/10 text-orange-400">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Exercise</h3>
                    <p className="text-white/40">Active workout time</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setExerciseTime(Math.max(5, exerciseTime - 5))} className="glass w-10 h-10 rounded-full">-</button>
                  <span className="text-3xl font-bold w-16 text-center">{exerciseTime}s</span>
                  <button onClick={() => setExerciseTime(exerciseTime + 5)} className="glass w-10 h-10 rounded-full">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-blue-400/10 text-blue-400">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Rest</h3>
                    <p className="text-white/40">Recovery between sets</p>
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
                  <div className="p-4 rounded-2xl bg-yellow-400/10 text-yellow-400">
                    <Dumbbell size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Rounds</h3>
                    <p className="text-white/40">Total number of sets</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setRounds(Math.max(1, rounds - 1))} className="glass w-10 h-10 rounded-full">-</button>
                  <span className="text-3xl font-bold w-16 text-center">{rounds}</span>
                  <button onClick={() => setRounds(rounds + 1)} className="glass w-10 h-10 rounded-full">+</button>
                </div>
              </div>

              <button
                onClick={startWorkout}
                className="w-full bg-orange-400 text-black py-6 rounded-[32px] text-2xl font-black shadow-xl shadow-orange-400/20 hover:scale-[1.02] transition-all mt-6"
              >
                START WORKOUT
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "glass p-12 md:p-24 rounded-[60px] text-center relative overflow-hidden transition-all duration-500",
              phase === 'exercise' ? "bg-orange-400/5" : phase === 'rest' ? "bg-blue-400/5" : "bg-white/5"
            )}
          >
            <div className={cn(
              "absolute top-0 left-0 w-full h-2 transition-all duration-500",
              phase === 'exercise' ? "bg-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]" : phase === 'rest' ? "bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]" : "bg-white/20"
            )} />

            <div className="flex justify-between items-center mb-12">
              <div className="text-left">
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Round</div>
                <div className="text-4xl font-black">{currentRound} / {rounds}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white/40 uppercase tracking-widest">Total Time</div>
                <div className="text-4xl font-black">{formatTime((exerciseTime + restTime) * rounds)}</div>
              </div>
            </div>

            <div className="mb-12">
              <motion.div
                key={phase}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                  "text-3xl font-bold uppercase tracking-[0.3em] mb-4",
                  phase === 'exercise' ? "text-orange-400" : phase === 'rest' ? "text-blue-400" : "text-white"
                )}
              >
                {phase === 'exercise' ? 'GO!' : phase === 'rest' ? 'REST' : 'FINISHED'}
              </motion.div>
              <div className="text-[12rem] font-black tracking-tighter tabular-nums leading-none">
                {timeLeft}
              </div>
            </div>

            <div className="flex justify-center items-center gap-8">
              <button
                onClick={() => setIsConfiguring(true)}
                className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
              >
                <RotateCcw size={32} />
              </button>
              
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={phase === 'complete'}
                className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl",
                  isRunning 
                    ? "bg-white/10 text-white border border-white/20" 
                    : phase === 'exercise' ? "bg-orange-400 text-black" : "bg-blue-400 text-black"
                )}
              >
                {isRunning ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
              </button>

              <div className="w-[80px]" /> {/* Spacer */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutTimer;
