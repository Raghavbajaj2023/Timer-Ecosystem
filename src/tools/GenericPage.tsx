import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TimerEngine, useTimer, cn } from '../App';
import { Home as HomeIcon, Heart, Clock, Brain, Dumbbell, Coffee, Wind } from 'lucide-react';
import TimerTemplate from '../components/TimerTemplate';

const getActivityDefaults = (activity: string) => {
  const normalized = activity.toLowerCase();
  if (normalized.includes('study')) return { duration: 25, icon: <Brain size={24} />, color: 'text-indigo-glow' };
  if (normalized.includes('workout')) return { duration: 30, icon: <Dumbbell size={24} />, color: 'text-orange-400' };
  if (normalized.includes('cook')) return { duration: 20, icon: <Coffee size={24} />, color: 'text-yellow-400' };
  if (normalized.includes('meditat')) return { duration: 15, icon: <Wind size={24} />, color: 'text-blue-400' };
  return { duration: 10, icon: <Clock size={24} />, color: 'text-emerald-400' };
};

const GenericPage = () => {
  const { activity } = useParams<{ activity: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useTimer() as any;

  const safeActivity = activity || 'general';
  const { duration, icon, color } = getActivityDefaults(safeActivity);

  const timerId = `timer-for-${safeActivity}`;
  const isFavorite = favorites.includes(timerId);

  const titleActivity = safeActivity.charAt(0).toUpperCase() + safeActivity.slice(1).replace(/-/g, ' ');
  const pageTitle = `Timer for ${titleActivity}`;

  const seo = {
    title: `${pageTitle} – Free Online Countdown Timer`,
    description: `Optimize your ${titleActivity.toLowerCase()} session with this specialized ${duration} minute timer. Designed for peak productivity and focus.`,
    why: `Using a dedicated timer for ${titleActivity.toLowerCase()} helps create a mental trigger, signaling to your brain that it's time to enter a specific state of performance.`,
    tips: [
      `Prepare your ${titleActivity.toLowerCase()} environment before starting.`,
      `Use the ${duration} minutes as a single, uninterrupted block.`,
      `Review your progress immediately after the timer ends.`
    ],
    faq: [
      { q: 'How does this timer work?', a: `This is a ${duration} minute countdown timer specifically designed for ${titleActivity.toLowerCase()}. Simply click start and focus.` },
      { q: 'Can I pause the timer?', a: 'Yes, you can pause and resume the timer at any time.' },
      { q: 'Does the timer run in background tabs?', a: 'Yes, our timer uses timestamp reconciliation to stay accurate even if you switch tabs.' }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/timers')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <HomeIcon size={16} /> Timer Directory
        </button>
        <button
          onClick={() => toggleFavorite(timerId)}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-full border transition-all",
            isFavorite 
              ? "bg-indigo-glow/20 border-indigo-glow text-white" 
              : "bg-white/5 border-white/10 text-white/40 hover:text-white"
          )}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? 'Saved' : 'Save Timer'}
        </button>
      </div>

      <TimerTemplate
        title={pageTitle}
        description={seo.description}
        explanation={{ title: `What is this ${titleActivity.toLowerCase()} timer?`, content: seo.why }}
        tips={seo.tips}
        faq={seo.faq}
        timerComponent={<TimerEngine initialSeconds={duration * 60} type={safeActivity} title={`${duration}m ${titleActivity}`} />}
        categoryColor={color}
        categoryIcon={icon}
        categoryLabel={titleActivity}
      />
    </div>
  );
};

export default GenericPage;
