import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { CONTENT_REGISTRY } from '../contentRegistry';

const LearnHub = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-12">Learn</h1>
      <p className="text-2xl text-white/60 mb-20 max-w-3xl leading-relaxed">
        Master productivity methods and get the most out of your tools with our educational resources.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CONTENT_REGISTRY.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link 
              to={`/learn/${article.id}`}
              className="group block glass p-10 rounded-[40px] hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 h-full"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-indigo-glow/10">
                <BookOpen className="text-indigo-glow" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{article.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm mb-8">{article.description}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-glow">
                Read Article <ChevronRight size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearnHub;
