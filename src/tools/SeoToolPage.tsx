import React, { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Info, HelpCircle, Star, CheckCircle2 } from 'lucide-react';
import { TOOL_REGISTRY } from '../registry';
import { useTimer, cn } from '../App';

const SeoToolPage = () => {
  const { toolId, seoVariation } = useParams<{ toolId: string; seoVariation: string }>();
  const { favorites, toggleFavorite } = useTimer() as any;
  
  const tool = TOOL_REGISTRY.find(t => t.id === toolId);
  const variation = tool?.seoVariations?.find(v => v.id === seoVariation);

  if (!tool || !variation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-white/60 mb-8">The page you are looking for doesn't exist.</p>
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
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{variation.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Tool Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[40px] p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden"
          >
            <Suspense fallback={
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-glow rounded-full animate-spin" />
                <p className="text-white/40 font-medium">Loading tool...</p>
              </div>
            }>
              <ToolComponent {...variation.params} />
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
              {variation.explanation}
            </p>
          </section>

          <section className="glass rounded-[32px] p-8 border-white/5">
            <div className="flex items-center gap-3 mb-6 text-violet-glow">
              <HelpCircle size={20} />
              <h2 className="text-xl font-bold">FAQ</h2>
            </div>
            <div className="space-y-6">
              {variation.faq.map((item, i) => (
                <div key={i}>
                  <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-white/80">{item.q}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Tips Section */}
      <section className="mt-20 glass rounded-[40px] p-12 border-white/5">
        <h2 className="text-3xl font-bold mb-8">Expert Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {variation.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
              <p className="text-white/60">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SeoToolPage;
