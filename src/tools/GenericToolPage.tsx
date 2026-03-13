import React, { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Info, HelpCircle, Star } from 'lucide-react';
import { TOOL_REGISTRY } from '../registry';
import { useTimer, cn } from '../App';

const GenericToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { favorites, toggleFavorite } = useTimer() as any;
  
  const tool = TOOL_REGISTRY.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-white/60 mb-8">The tool you are looking for doesn't exist or has been moved.</p>
        <Link to="/tools" className="glass px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
          Back to Hub
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(tool.path);
  const ToolComponent = tool.component;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Link 
            to="/tools" 
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={cn("text-sm font-bold uppercase tracking-widest opacity-60", tool.color)}>
                {tool.category}
              </span>
              <button 
                onClick={() => toggleFavorite(tool.path)}
                className={cn(
                  "p-1 rounded-lg transition-all",
                  isFavorite ? "text-yellow-400" : "text-white/20 hover:text-white"
                )}
              >
                <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{tool.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Tool Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[40px] p-8 md:p-12 min-h-[500px] flex items-center justify-center relative overflow-hidden"
          >
            <Suspense fallback={
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-glow rounded-full animate-spin" />
                <p className="text-white/40 font-medium">Loading tool...</p>
              </div>
            }>
              <ToolComponent />
            </Suspense>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <section className="glass rounded-[32px] p-8 border-white/5">
            <div className="flex items-center gap-3 mb-4 text-indigo-glow">
              <Info size={20} />
              <h2 className="text-xl font-bold">About this tool</h2>
            </div>
            <p className="text-white/60 leading-relaxed">
              {tool.explanation}
            </p>
          </section>

          <section className="glass rounded-[32px] p-8 border-white/5">
            <div className="flex items-center gap-3 mb-6 text-violet-glow">
              <HelpCircle size={20} />
              <h2 className="text-xl font-bold">FAQ</h2>
            </div>
            <div className="space-y-6">
              {tool.faq.map((item, i) => (
                <div key={i}>
                  <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-white/80">{item.q}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Quick Access Bar */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8">Quick Access</h2>
        <div className="flex flex-wrap gap-4">
          {TOOL_REGISTRY.slice(0, 8).map(t => (
            <Link
              key={t.id}
              to={t.path}
              className="glass px-6 py-3 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3 group"
            >
              <span className={cn("transition-transform group-hover:scale-110 group-hover:rotate-6", t.color)}>
                {t.icon}
              </span>
              <span className="font-medium">{t.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenericToolPage;
