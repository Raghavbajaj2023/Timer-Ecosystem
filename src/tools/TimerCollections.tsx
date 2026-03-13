import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react';

const TimerCollections = () => {
  const collections = [
    { title: 'Best Timers for Studying', slug: 'best-timers-for-studying', desc: 'Curated list of timers to boost your academic performance.' },
    { title: 'Best Timers for Workouts', slug: 'best-timers-for-workouts', desc: 'High-intensity interval timers and workout trackers.' },
    { title: 'Best Meditation Timers', slug: 'best-meditation-timers', desc: 'Peaceful, distraction-free timers for mindfulness.' },
    { title: 'Best Cooking Timers', slug: 'best-cooking-timers', desc: 'Reliable countdowns for the kitchen.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-6xl font-black tracking-tighter mb-8">Timer Collections</h1>
      <p className="text-xl text-white/60 mb-16 max-w-2xl">
        Curated lists of the best timers for specific use cases.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map((c, i) => (
          <Link 
            key={i}
            to={`/collections/${c.slug}`}
            className="group block glass p-8 rounded-[40px] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 bg-yellow-500/10 text-yellow-500">
              <Star size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{c.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TimerCollections;
