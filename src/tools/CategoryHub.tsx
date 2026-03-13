import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, LayoutGrid, Timer } from 'lucide-react';
import { TOOL_REGISTRY, CATEGORIES } from '../registry';
import { cn } from '../App';

const CategoryHub = () => {
  const { category } = useParams<{ category: string }>();
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const tools = TOOL_REGISTRY.filter(t => t.category === cat.id);

  const extraLinks = cat.id === 'Study' ? [
    { id: '5-min', name: '5 Minute Study', description: 'Quick focus session', path: '/timer/5-minute/study', color: 'emerald' },
    { id: '25-min', name: '25 Minute Study', description: 'Standard Pomodoro', path: '/timer/25-minute/study', color: 'emerald' },
    { id: '50-min', name: '50 Minute Study', description: 'Deep work session', path: '/timer/50-minute/study', color: 'emerald' },
  ] : cat.id === 'Workout' ? [
    { id: '10-min', name: '10 Minute Workout', description: 'Quick HIIT session', path: '/timer/10-minute/workout', color: 'electric-blue' },
    { id: '20-min', name: '20 Minute Workout', description: 'Standard interval', path: '/timer/20-minute/workout', color: 'electric-blue' },
    { id: '30-min', name: '30 Minute Workout', description: 'Full body session', path: '/timer/30-minute/workout', color: 'electric-blue' },
  ] : [];

  const getLinkColorClasses = (color: string) => {
    if (color === 'emerald') return { bg: 'bg-emerald-glow/10', text: 'text-emerald-400' };
    if (color === 'electric-blue') return { bg: 'bg-electric-blue-glow/10', text: 'text-electric-blue' };
    return { bg: 'bg-white/10', text: 'text-white' };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <Link 
          to="/tools" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={20} /> Back to Hub
        </Link>
        <div className="flex items-center gap-6">
          <div className={cn("p-6 rounded-[32px] bg-white/5", cat.color)}>
            {React.cloneElement(cat.icon as React.ReactElement, { size: 48 })}
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter">{cat.label} Tools</h1>
        </div>
      </div>

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
        {extraLinks.map((link, idx) => {
          const classes = getLinkColorClasses(link.color);
          return (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (tools.length + idx) * 0.05 }}
            >
              <Link 
                to={link.path}
                className="group block glass p-8 rounded-[40px] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 h-full"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6", classes.bg)}>
                  <Timer className={classes.text} size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{link.name}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{link.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryHub;
