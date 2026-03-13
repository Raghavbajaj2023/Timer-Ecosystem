import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TimerEngine, useTimer, cn } from '../App';
import { Home as HomeIcon, Heart, Clock, ChevronRight } from 'lucide-react';
import TimerTemplate from '../components/TimerTemplate';

const parseSlug = (slug: string) => {
  // e.g. "5-minute-study-pomodoro" or "study" or "5-minute"
  const parts = slug.split('-');
  let duration = 5;
  let activity = 'General';
  let method = 'standard';

  const durationMatch = parts.find(p => !isNaN(parseInt(p)));
  if (durationMatch) {
    duration = parseInt(durationMatch);
  }

  const methodKeywords = ['pomodoro', 'focus', 'interval', 'deep-work'];
  const methodMatch = parts.find(p => methodKeywords.includes(p));
  if (methodMatch) {
    method = methodMatch;
  }

  const activityParts = parts.filter(p => isNaN(parseInt(p)) && p !== 'minute' && p !== 'timer' && !methodKeywords.includes(p));
  if (activityParts.length > 0) {
    activity = activityParts.join(' ');
  }

  return { duration, activity, method };
};

const ScalableTimerPage = ({ isCombination = false }: { isCombination?: boolean }) => {
  const { slug, duration: routeDuration, activity: routeActivity, method: routeMethod } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useTimer() as any;

  let duration = 5;
  let activity = 'General';
  let method = 'standard';

  if (routeDuration && routeActivity && routeMethod) {
    duration = parseInt(routeDuration) || 5;
    activity = routeActivity;
    method = routeMethod;
  } else if (slug) {
    const parsed = parseSlug(slug);
    duration = parsed.duration;
    activity = parsed.activity;
    method = parsed.method;
  }

  const timerId = `${duration}-${activity}-${method}`;
  const isFavorite = favorites.includes(timerId);

  const titleActivity = activity.charAt(0).toUpperCase() + activity.slice(1);
  const titleMethod = method !== 'standard' ? method.charAt(0).toUpperCase() + method.slice(1) : '';
  
  const pageTitle = `${duration} Minute ${titleActivity} ${titleMethod} Timer`.replace(/\s+/g, ' ').trim();

  const seo = {
    title: `${pageTitle} – Free Online Countdown Timer`,
    description: `Optimize your ${activity} session with this specialized ${duration} minute ${method} timer. Designed for peak productivity and focus.`,
    why: `Using a dedicated ${duration} minute timer for ${activity} helps create a mental trigger, signaling to your brain that it's time to enter a specific state of performance.`,
    tips: [
      `Prepare your ${activity} environment before starting.`,
      `Use the ${duration} minutes as a single, uninterrupted block.`,
      `Review your progress immediately after the timer ends.`
    ],
    faq: [
      { q: 'How does this timer work?', a: `This is a ${duration} minute countdown timer specifically designed for ${activity}. Simply click start and focus.` },
      { q: 'Can I pause the timer?', a: 'Yes, you can pause and resume the timer at any time.' },
      { q: 'Does the timer run in background tabs?', a: 'Yes, our timer uses timestamp reconciliation to stay accurate even if you switch tabs.' }
    ]
  };

  const relatedTimers = [
    { d: duration + 5, a: activity, m: method },
    { d: duration, a: activity, m: method === 'standard' ? 'pomodoro' : 'standard' },
    { d: duration === 25 ? 5 : 25, a: 'focus', m: 'pomodoro' },
    { d: duration + 10, a: activity, m: method }
  ];

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
        explanation={{ title: `What is this ${activity} timer?`, content: seo.why }}
        tips={seo.tips}
        faq={seo.faq}
        timerComponent={<TimerEngine initialSeconds={duration * 60} type={activity} title={`${duration}m ${activity}`} />}
        categoryColor="text-indigo-glow"
        categoryIcon={<Clock size={24} />}
        categoryLabel={activity}
      />

      <div className="mt-20">
        <h2 className="text-3xl font-bold mb-8">Related Timers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTimers.map((t, i) => (
            <Link 
              key={i}
              to={`/timer/${t.d}-minute-${t.a.replace(/\s+/g, '-')}${t.m !== 'standard' ? `-${t.m}` : ''}-timer`}
              className="group glass p-6 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 hover:-translate-y-1"
            >
              <div className="text-2xl font-bold mb-2">{t.d}m</div>
              <div className="text-sm text-white/60 capitalize">{t.a} {t.m !== 'standard' ? t.m : ''}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScalableTimerPage;
