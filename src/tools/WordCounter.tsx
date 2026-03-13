import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Type, Hash, AlignLeft, FileText } from 'lucide-react';
import { cn } from '../App';

const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

    setStats({ words, characters, charactersNoSpaces, sentences, paragraphs });
  }, [text]);

  const StatBox = ({ label, value, icon: Icon, color }: any) => (
    <div className="glass p-6 rounded-3xl border-white/5 flex flex-col items-center text-center">
      <div className={cn("p-3 rounded-2xl bg-white/5 mb-4", color)}>
        <Icon size={24} />
      </div>
      <div className="text-3xl font-black mb-1">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatBox label="Words" value={stats.words} icon={Type} color="text-orange-400" />
        <StatBox label="Chars" value={stats.characters} icon={Hash} color="text-blue-400" />
        <StatBox label="No Spaces" value={stats.charactersNoSpaces} icon={AlignLeft} color="text-emerald-400" />
        <StatBox label="Sentences" value={stats.sentences} icon={FileText} color="text-violet-glow" />
        <StatBox label="Paragraphs" value={stats.paragraphs} icon={AlignLeft} color="text-pink-400" />
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="w-full h-64 bg-white/5 border border-white/10 rounded-[32px] p-8 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all resize-none placeholder:text-white/10"
        />
        <div className="absolute bottom-6 right-8 text-white/20 text-sm font-mono">
          Real-time analysis
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setText('')}
          className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-bold text-white/40 hover:text-white"
        >
          Clear Text
        </button>
      </div>
    </div>
  );
};

export default WordCounter;
