import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Plus, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '../App';

interface PlanItem {
  id: string;
  time: string;
  task: string;
}

const DailyPlanner = () => {
  const [plan, setPlan] = useState<PlanItem[]>(() => {
    const saved = localStorage.getItem('productivity-plan');
    return saved ? JSON.parse(saved) : [];
  });
  const [time, setTime] = useState('09:00');
  const [task, setTask] = useState('');

  useEffect(() => {
    localStorage.setItem('productivity-plan', JSON.stringify(plan));
  }, [plan]);

  const addToPlan = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!task.trim()) return;
    
    const newItem: PlanItem = {
      id: Date.now().toString(),
      time,
      task: task.trim()
    };
    
    const newPlan = [...plan, newItem].sort((a, b) => a.time.localeCompare(b.time));
    setPlan(newPlan);
    setTask('');
  };

  const removeFromPlan = (id: string) => {
    setPlan(plan.filter(item => item.id !== id));
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <form onSubmit={addToPlan} className="glass p-8 rounded-[40px] border-white/5 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-3 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-glow/50 transition-all"
          />
        </div>
        <div className="flex-[2] space-y-3 w-full">
          <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">Task / Activity</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-glow/50 transition-all"
          />
        </div>
        <button
          type="submit"
          className="p-4 rounded-2xl bg-violet-glow text-white shadow-lg shadow-violet-glow/20 hover:scale-105 transition-all w-full md:w-auto"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-4">
        {plan.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group glass p-6 rounded-3xl border-white/5 flex items-center gap-6 hover:bg-white/10 transition-all"
          >
            <div className="w-24 text-2xl font-black text-violet-glow tracking-tighter">
              {item.time}
            </div>
            <div className="flex-1 font-medium text-lg">
              {item.task}
            </div>
            <button
              onClick={() => removeFromPlan(item.id)}
              className="p-2 rounded-xl text-white/0 group-hover:text-white/20 hover:text-red-400 transition-all"
            >
              <Trash2 size={20} />
            </button>
          </motion.div>
        ))}

        {plan.length === 0 && (
          <div className="text-center py-20 text-white/10">
            <Calendar size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold">Your schedule is clear</p>
            <p className="text-sm">Plan your day to maximize productivity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPlanner;
