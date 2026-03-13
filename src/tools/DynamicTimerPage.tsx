import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home as HomeIcon, Heart, CheckCircle2, Clock } from 'lucide-react';
import { TimerEngine, useTimer, cn } from '../App';
import { CATEGORIES } from '../registry';
import TimerTemplate from '../components/TimerTemplate';

const DynamicTimerPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useTimer() as any;
  
  // Parse slug: e.g., "5-minute-study-timer"
  const parts = slug?.split('-') || [];
  const minutes = parseInt(parts[0] || '5');
  const activity = parts.slice(2, -1).join(' ') || 'Timer';
  
  const timerId = slug || `${minutes}-timer`;
  const isFavorite = favorites.includes(timerId);

  const seo = {
    title: `${minutes} Minute ${activity.charAt(0).toUpperCase() + activity.slice(1)} Timer – Free Online Countdown Timer`,
    description: `Optimize your ${activity} session with this specialized ${minutes} minute timer. Designed for peak productivity and focus.`,
    why: `Using a dedicated ${minutes} minute timer for ${activity} helps create a mental trigger, signaling to your brain that it's time to enter a specific state of performance.`,
    tips: [
      `Prepare your ${activity} environment before starting.`,
      `Use the ${minutes} minutes as a single, uninterrupted block.`,
      `Review your progress immediately after the timer ends.`
    ],
    faq: [
      { q: 'Does it work in the background?', a: 'Yes, our timer uses timestamp reconciliation to stay accurate even if you switch tabs.' },
      { q: 'Can I set multiple timers?', a: 'Currently, you can set one active timer per tab.' }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <HomeIcon size={16} /> Back to Hub
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
          {isFavorite ? 'Saved to Favorites' : 'Save Timer'}
        </button>
      </div>

      <TimerTemplate
        title={`${minutes} Minute ${activity.charAt(0).toUpperCase() + activity.slice(1)} Timer`}
        description={seo.description}
        explanation={{ title: `Why use a ${activity} timer?`, content: seo.why }}
        tips={seo.tips}
        faq={seo.faq}
        timerComponent={<TimerEngine initialSeconds={minutes * 60} type={activity} title={`${minutes}m ${activity}`} />}
        categoryColor="text-indigo-glow"
        categoryIcon={<Clock size={24} />}
        categoryLabel={activity}
      />
    </div>
  );
};

export default DynamicTimerPage;
