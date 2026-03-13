import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Activity, Target } from 'lucide-react';
import { cn } from '../App';

const ScalableHubPage = () => {
  const { slug } = useParams();
  
  // Parse slug: e.g., "5-minute-timers", "study-timers", "pomodoro-timers", "best-timers-for-studying"
  const isCollection = slug?.startsWith('best-');
  const isDuration = slug?.includes('minute');
  const isMethod = slug?.includes('pomodoro') || slug?.includes('focus') || slug?.includes('interval');
  
  const title = slug?.replace(/-/g, ' ').replace('timers', 'Timers').replace(/\b\w/g, l => l.toUpperCase());

  const durations = [1, 5, 10, 15, 20, 25, 30, 45, 60];
  const activities = ['study', 'workout', 'meditation', 'reading', 'cooking', 'focus'];
  
  let items = [];
  if (isCollection) {
    const rawActivity = slug?.split('-').pop() || 'study';
    const activityMap: Record<string, string> = {
      'studying': 'study',
      'workouts': 'workout',
      'cooking': 'cooking',
      'meditation': 'meditation',
    };
    const activity = activityMap[rawActivity] || rawActivity;
    
    items = durations.map(d => ({
      d: d,
      a: activity,
      m: 'standard',
      path: `/timer/${d}-minute-${activity}-timer`
    }));
  } else if (isDuration) {
    const durationMatch = slug?.match(/(\d+)/);
    const duration = durationMatch ? parseInt(durationMatch[0]) : 5;
    items = activities.map(a => ({
      d: duration,
      a: a,
      m: 'standard',
      path: `/timer/${duration}-minute-${a}-timer`
    }));
  } else if (isMethod) {
    const method = slug?.split('-')[0] || 'pomodoro';
    items = durations.map(d => ({
      d: d,
      a: 'focus',
      m: method,
      path: `/timer/${d}-minute-focus-${method}-timer`
    }));
  } else {
    const activity = slug?.split('-')[0] || 'study';
    items = durations.map(d => ({
      d: d,
      a: activity,
      m: 'standard',
      path: `/timer/${d}-minute-${activity}-timer`
    }));
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-6xl font-black tracking-tighter mb-8">{title}</h1>
      <p className="text-xl text-white/60 mb-16 max-w-2xl">
        Explore our collection of {title?.toLowerCase()} designed to help you stay productive and focused.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <Link 
            key={i}
            to={item.path}
            className="group block glass p-8 rounded-[40px] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 h-full"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 bg-indigo-glow/10 text-indigo-glow")}>
              {isDuration ? <Clock size={24} /> : isMethod ? <Target size={24} /> : <Activity size={24} />}
            </div>
            <h3 className="text-2xl font-bold mb-2">{item.d} Minute {item.a.charAt(0).toUpperCase() + item.a.slice(1)} Timer</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              A dedicated {item.d} minute timer for {item.a}.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScalableHubPage;
