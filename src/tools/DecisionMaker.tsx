import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '../App';

const DecisionMaker = () => {
  const [options, setOptions] = useState<string[]>(() => {
    const saved = localStorage.getItem('productivity-decision-options');
    return saved ? JSON.parse(saved) : ['Lunch', 'Coffee', 'Walk', 'Work'];
  });
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const saveOptions = (newOptions: string[]) => {
    setOptions(newOptions);
    localStorage.setItem('productivity-decision-options', JSON.stringify(newOptions));
  };

  const addOption = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    saveOptions([...options, input.trim()]);
    setInput('');
  };

  const removeOption = (index: number) => {
    saveOptions(options.filter((_, i) => i !== index));
  };

  const decide = () => {
    if (options.length < 2) return;
    setIsSpinning(true);
    setResult(null);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setResult(options[randomIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <form onSubmit={addOption} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add an option..."
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-8 pr-20 text-xl focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all backdrop-blur-xl"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-pink-400 text-navy-900 shadow-lg shadow-pink-400/20 hover:scale-105 transition-all"
          >
            <Plus size={24} />
          </button>
        </form>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {options.map((opt, i) => (
            <div key={i} className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between group">
              <span className="font-medium">{opt}</span>
              <button
                onClick={() => removeOption(i)}
                className="p-2 rounded-lg text-white/0 group-hover:text-white/20 hover:text-red-400 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-12 py-12">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div
            animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 0 }}
            transition={isSpinning ? { duration: 1.5, ease: "easeInOut" } : { duration: 0 }}
            className="absolute inset-0 border-4 border-dashed border-pink-400/20 rounded-full"
          />
          
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="text-sm font-bold uppercase tracking-widest text-pink-400">The Decision</div>
                <div className="text-4xl font-black tracking-tighter">{result}</div>
                <CheckCircle2 className="mx-auto text-emerald-400" size={32} />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/10"
              >
                <RotateCw size={80} className={cn(isSpinning && "animate-spin")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={decide}
          disabled={isSpinning || options.length < 2}
          className="w-full py-6 rounded-[32px] bg-pink-400 text-navy-900 font-black text-2xl flex items-center justify-center gap-4 shadow-xl shadow-pink-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <RotateCw className={cn(isSpinning && "animate-spin")} />
          {isSpinning ? "Deciding..." : "Make a Decision"}
        </button>
        
        {options.length < 2 && (
          <p className="text-white/20 text-sm font-medium">Add at least 2 options to decide</p>
        )}
      </div>
    </div>
  );
};

export default DecisionMaker;
