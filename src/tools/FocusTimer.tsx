import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ShieldCheck } from 'lucide-react';
import { cn } from '../App';

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
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

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-blue/10 text-electric-blue border border-electric-blue/20 mb-6">
          <ShieldCheck size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Deep Focus Mode</span>
        </div>
        <h1 className="text-4xl font-bold text-white/40">Distraction-free focus session.</h1>
      </motion.div>

      <div className="text-center relative">
        <motion.div
          animate={{ 
            scale: isRunning ? [1, 1.02, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-[14rem] md:text-[20rem] font-black tracking-tighter tabular-nums leading-none mb-12 text-white selection:bg-electric-blue/30"
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className="flex justify-center items-center gap-12">
          <button
            onClick={() => setTimeLeft(25 * 60)}
            className="text-white/20 hover:text-white transition-all"
          >
            <RotateCcw size={40} />
          </button>
          
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center transition-all border-2",
              isRunning 
                ? "border-white/10 text-white/40 hover:text-white hover:border-white/20" 
                : "border-electric-blue text-electric-blue shadow-[0_0_40px_rgba(0,242,255,0.2)]"
            )}
          >
            {isRunning ? <Pause size={56} fill="currentColor" /> : <Play size={56} fill="currentColor" className="ml-2" />}
          </button>

          <div className="w-[40px]" /> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
