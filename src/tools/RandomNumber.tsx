import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hash, RefreshCw, Settings2 } from 'lucide-react';
import { cn } from '../App';

const RandomNumber = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newResults = [];
      for (let i = 0; i < count; i++) {
        newResults.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      setResults(newResults);
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-2xl space-y-12">
      <div className="flex flex-wrap justify-center gap-6">
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            results.map((num, i) => (
              <motion.div
                key={`${num}-${i}`}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-32 h-32 glass rounded-full flex items-center justify-center text-5xl font-black text-emerald-400 shadow-lg shadow-emerald-400/10 border-emerald-400/20"
              >
                {num}
              </motion.div>
            ))
          ) : (
            <div className="w-32 h-32 glass rounded-full flex items-center justify-center text-5xl font-black text-white/5 border-dashed border-white/10">
              ?
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="glass rounded-[40px] p-8 space-y-8 border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Min Value</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Max Value</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">How Many?</label>
            <input
              type="number"
              value={count}
              min={1}
              max={10}
              onChange={(e) => setCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generate}
          disabled={isGenerating}
          className="w-full py-6 rounded-3xl bg-emerald-400 text-navy-900 font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-400/20 disabled:opacity-50"
        >
          <RefreshCw className={cn(isGenerating && "animate-spin")} />
          {isGenerating ? "Generating..." : "Generate Numbers"}
        </motion.button>
      </div>
    </div>
  );
};

export default RandomNumber;
