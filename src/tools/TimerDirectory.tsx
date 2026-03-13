import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { TOOL_REGISTRY, CATEGORIES } from '../registry';
import { cn } from '../App';
import { Clock, Activity, Target } from 'lucide-react';

const TimerDirectory = () => {
  const durationHubs = [5, 10, 15, 25, 30, 45, 60];
  const activityHubs = ['study', 'workout', 'meditation', 'cooking', 'reading'];
  const methodHubs = ['pomodoro', 'focus', 'interval'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-6xl font-black tracking-tighter mb-16">Timer Directory</h1>
      
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <Clock className="text-indigo-glow" /> Duration Timers
        </h2>
        <div className="flex flex-wrap gap-4">
          {durationHubs.map(d => (
            <Link key={d} to={`/${d}-minute-timers`} className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 font-bold hover:-translate-y-1">
              {d} Minute Timers
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <Activity className="text-violet-glow" /> Activity Timers
        </h2>
        <div className="flex flex-wrap gap-4">
          {activityHubs.map(a => (
            <Link key={a} to={`/timer-for-${a}`} className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 font-bold capitalize hover:-translate-y-1">
              {a} Timer
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <Target className="text-emerald-400" /> Method Timers
        </h2>
        <div className="flex flex-wrap gap-4">
          {methodHubs.map(m => (
            <Link key={m} to={`/${m}-timers`} className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 font-bold capitalize hover:-translate-y-1">
              {m} Timers
            </Link>
          ))}
        </div>
      </section>

      <div className="space-y-16">
        {CATEGORIES.map(cat => {
          const tools = TOOL_REGISTRY.filter(t => t.category === cat.id);
          if (tools.length === 0) return null;
          
          return (
            <section key={cat.id}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                <span className={cat.color}>{cat.icon}</span>
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {tools.map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      to={tool.path}
                      className="group block glass p-8 rounded-[40px] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 h-full"
                    >
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6", tool.color.replace('text-', 'bg-').replace('glow', 'glow/10'))}>
                        <span className={tool.color}>{tool.icon}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{tool.description}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default TimerDirectory;
