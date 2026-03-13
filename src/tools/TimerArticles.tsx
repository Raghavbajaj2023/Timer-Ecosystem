import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const TimerArticles = () => {
  const articles = [
    { title: 'How Timers Improve Productivity', slug: 'how-timers-improve-productivity', desc: 'The science behind time-boxing and focus.' },
    { title: 'Best Timers for Studying', slug: 'best-timers-for-studying', desc: 'A guide to academic time management.' },
    { title: 'How Athletes Use Interval Timers', slug: 'how-athletes-use-interval-timers', desc: 'HIIT and the importance of precise timing.' },
    { title: 'How Countdown Timers Improve Focus', slug: 'how-countdown-timers-improve-focus', desc: 'Creating a sense of urgency to beat procrastination.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-6xl font-black tracking-tighter mb-8">Timer Content Library</h1>
      <p className="text-xl text-white/60 mb-16 max-w-2xl">
        Educational articles and guides on how to use timers effectively.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((a, i) => (
          <Link 
            key={i}
            to={`/learn/${a.slug}`}
            className="group block glass p-8 rounded-[40px] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 bg-blue-500/10 text-blue-500">
              <FileText size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{a.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TimerArticles;
