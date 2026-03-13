import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, TrendingUp, Flame, Calendar } from 'lucide-react';
import { cn } from '../App';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  lastCompleted: number | null;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('productivity-habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('productivity-habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: input.trim(),
      streak: 0,
      completedToday: false,
      lastCompleted: null
    };
    
    setHabits([...habits, newHabit]);
    setInput('');
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        if (h.completedToday) {
          return { ...h, completedToday: false, streak: Math.max(0, h.streak - 1) };
        } else {
          return { ...h, completedToday: true, streak: h.streak + 1, lastCompleted: today };
        }
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <form onSubmit={addHabit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What habit do you want to build?"
          className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-8 pr-20 text-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all backdrop-blur-xl"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-emerald-400 text-navy-900 shadow-lg shadow-emerald-400/20 hover:scale-105 transition-all"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "group glass p-6 rounded-[32px] border-white/5 flex flex-col gap-6 transition-all",
                habit.completedToday ? "bg-emerald-400/5 border-emerald-400/20" : "hover:bg-white/10"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{habit.name}</h3>
                  <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                    <Flame size={14} className={habit.streak > 0 ? "text-orange-400" : ""} />
                    {habit.streak} Day Streak
                  </div>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-2 rounded-xl text-white/0 group-hover:text-white/20 hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <button
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all",
                  habit.completedToday 
                    ? "bg-emerald-400 text-navy-900 shadow-lg shadow-emerald-400/20" 
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {habit.completedToday ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                {habit.completedToday ? "Completed Today" : "Mark as Done"}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {habits.length === 0 && (
        <div className="text-center py-20 text-white/10">
          <TrendingUp size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-xl font-bold">No habits tracked yet</p>
          <p className="text-sm">Consistency is the key to success</p>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
