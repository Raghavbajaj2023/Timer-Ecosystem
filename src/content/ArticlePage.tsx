import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Info, HelpCircle, CheckCircle2 } from 'lucide-react';
import { CONTENT_REGISTRY } from '../contentRegistry';
import { TOOL_REGISTRY } from '../registry';
import { cn } from '../App';

const ArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = CONTENT_REGISTRY.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <Link to="/learn" className="glass px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
          Back to Learn
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <Link to="/learn" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12">
        <ChevronLeft size={20} /> Back to Learn
      </Link>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-7xl font-black tracking-tighter mb-8"
      >
        {article.title}
      </motion.h1>
      
      <p className="text-2xl text-white/60 mb-16 leading-relaxed">{article.description}</p>

      <div className="glass p-12 rounded-[40px] mb-16 border-white/5">
        <p className="text-xl text-white/80 leading-relaxed">{article.content}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <section className="glass p-10 rounded-[40px]">
          <h2 className="text-3xl font-bold mb-6">Tips</h2>
          <ul className="space-y-4">
            {article.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-white/50 text-lg">
                <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                {tip}
              </li>
            ))}
          </ul>
        </section>
        <section className="glass p-10 rounded-[40px]">
          <h2 className="text-3xl font-bold mb-6">FAQ</h2>
          <div className="space-y-6">
            {article.faq.map((item, i) => (
              <div key={i}>
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-white/80">{item.q}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {article.relatedTools.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Related Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.relatedTools.map(toolId => {
              const tool = TOOL_REGISTRY.find(t => t.id === toolId);
              if (!tool) return null;
              return (
                <Link key={tool.id} to={tool.path} className="glass p-8 rounded-3xl hover:bg-white/10 transition-all">
                  <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                  <p className="text-white/40 text-sm">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticlePage;
