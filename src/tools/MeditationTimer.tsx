import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Wind, Volume2, VolumeX, Leaf } from 'lucide-react';
import { cn } from '../App';

const MeditationTimer = () => {
  const [duration, setDuration] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
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
  }, [isRunning]);

  const handleDurationChange = (m: number) => {
    setDuration(m);
    setTimeLeft(m * 60);
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
        <h1 className="text-6xl font-bold mb-4">Meditation</h1>
        <p className="text-white/40 text-xl">Calm sessions with ambient sounds.</p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        {[5, 10, 20, 30].map(m => (
          <button
            key={m}
            onClick={() => handleDurationChange(m)}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold transition-all border",
              duration === m 
                ? "bg-blue-400/20 border-blue-400 text-blue-400" 
                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
            )}
          >
            {m}m
          </button>
        ))}
      </div>

      <div className="glass p-12 md:p-24 rounded-[60px] text-center relative overflow-hidden bg-blue-400/5">
        <motion.div 
          animate={{ 
            scale: isRunning ? [1, 1.1, 1] : 1,
            opacity: isRunning ? [0.3, 0.5, 0.3] : 0.3
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent pointer-events-none"
        />
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ rotate: isRunning ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="text-blue-400/40"
            >
              <Wind size={64} />
            </motion.div>
          </div>

          <div className="text-[10rem] md:text-[14rem] font-black tracking-tighter tabular-nums leading-none mb-12 text-blue-100">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center items-center gap-8">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
            >
              {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
            </button>
            
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl bg-blue-400 text-black shadow-blue-400/20"
              )}
            >
              {isRunning ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
            </button>

            <button
              onClick={() => setTimeLeft(duration * 60)}
              className="glass p-6 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white"
            >
              <RotateCcw size={32} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-[40px] text-center">
          <Leaf className="mx-auto mb-4 text-blue-400" size={32} />
          <h3 className="text-xl font-bold mb-2">Mindful Breathing</h3>
          <p className="text-white/40">Focus on your breath as it enters and leaves your body.</p>
        </div>
        <div className="glass p-8 rounded-[40px] text-center">
          <Wind className="mx-auto mb-4 text-blue-400" size={32} />
          <h3 className="text-xl font-bold mb-2">Ambient Sound</h3>
          <p className="text-white/40">Soft background noise to help you stay in the moment.</p>
        </div>
        <div className="glass p-8 rounded-[40px] text-center">
          <Play className="mx-auto mb-4 text-blue-400" size={32} />
          <h3 className="text-xl font-bold mb-2">Guided Start</h3>
          <p className="text-white/40">A soft bell marks the beginning and end of your session.</p>
        </div>
      </div>
    </div>
  );
};

export default MeditationTimer;
