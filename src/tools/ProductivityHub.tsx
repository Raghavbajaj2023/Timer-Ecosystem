import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, Star, LayoutGrid, ChevronRight } from 'lucide-react';
import { TOOL_REGISTRY, ToolCategory } from '../registry';
import { useTimer, cn } from '../App';

const CATEGORIES: ToolCategory[] = ['Time', 'Focus', 'Planning', 'Calculation', 'Text', 'Utility', 'Study', 'Workout', 'Meditation'];

const ProductivityHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const { favorites, toggleFavorite } = useTimer() as any;

  const filteredTools = TOOL_REGISTRY.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteTools = TOOL_REGISTRY.filter(tool => favorites.includes(tool.path));

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            Ecosystem
          </h1>
          <p className="text-white/40 text-xl max-w-2xl leading-relaxed">
            A massive suite of professional productivity tools. Grouped by category and designed for peak performance.
          </p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-16 pr-6 focus:border-violet-glow outline-none transition-all text-lg backdrop-blur-xl"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        <button
          onClick={() => setActiveCategory('All')}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold transition-all border",
            activeCategory === 'All' 
              ? "bg-white text-navy-900 border-white" 
              : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
          )}
        >
          All Tools
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold transition-all border",
              activeCategory === cat 
                ? "bg-indigo-glow text-white border-indigo-glow" 
                : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {favorites.length > 0 && !searchQuery && activeCategory === 'All' && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            <h2 className="text-3xl font-bold">Favorites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool, idx) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isFavorite={true} 
                onToggleFavorite={toggleFavorite}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {activeCategory === 'All' && !searchQuery ? (
        <div className="space-y-20">
          {CATEGORIES.map(cat => {
            const catTools = TOOL_REGISTRY.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            return (
              <section key={cat}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="text-white/20" size={24} />
                    <h2 className="text-3xl font-bold">{cat} Tools</h2>
                  </div>
                  <span className="text-white/20 font-bold uppercase tracking-widest text-xs">
                    {catTools.length} Tools
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {catTools.map((tool, idx) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      isFavorite={favorites.includes(tool.path)} 
                      onToggleFavorite={toggleFavorite}
                      index={idx}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <LayoutGrid className="text-white/40" size={24} />
            <h2 className="text-3xl font-bold">
              {searchQuery ? `Search Results (${filteredTools.length})` : `${activeCategory} Tools`}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool, idx) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isFavorite={favorites.includes(tool.path)} 
                onToggleFavorite={toggleFavorite}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {filteredTools.length === 0 && (
        <div className="text-center py-32 glass rounded-[60px] border-white/5">
          <Search size={64} className="mx-auto mb-6 text-white/10" />
          <h3 className="text-2xl font-bold mb-2">No tools found</h3>
          <p className="text-white/40">Try searching for something else like "timer" or "word".</p>
        </div>
      )}
    </div>
  );
};

const ToolCard = ({ tool, isFavorite, onToggleFavorite, index }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link 
        to={tool.path}
        className="group block relative glass p-8 rounded-[40px] hover:bg-white/10 transition-all h-full border border-white/5 hover:border-white/20 overflow-hidden"
      >
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
          tool.color.replace('text-', 'bg-')
        )} />

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(tool.path);
          }}
          className={cn(
            "absolute top-6 right-6 p-3 rounded-2xl transition-all z-10",
            isFavorite ? "bg-yellow-400/10 text-yellow-400" : "bg-white/5 text-white/20 hover:text-white"
          )}
        >
          <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-6",
          tool.color.replace('text-', 'bg-').replace('glow', 'glow/10')
        )}>
          <span className={tool.color}>{tool.icon}</span>
        </div>

        <div className="space-y-2">
          <div className={cn("text-[10px] font-black uppercase tracking-[0.2em]", tool.color)}>
            {tool.category}
          </div>
          <h3 className="text-2xl font-bold group-hover:text-white transition-colors">{tool.name}</h3>
          <p className="text-white/40 leading-relaxed text-sm">{tool.description}</p>
        </div>
        
        <div className="mt-8 flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-white/60">
          Launch Tool <ChevronRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductivityHub;
