import React, { useState } from 'react';
import { FileText, Copy, Check, Type } from 'lucide-react';
import { cn } from '../App';

const CaseConverter = () => {
  const [text, setText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const convert = (type: string) => {
    let result = text;
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title':
        result = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
    }
    setText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { id: 'upper', label: 'UPPERCASE' },
          { id: 'lower', label: 'lowercase' },
          { id: 'title', label: 'Title Case' },
          { id: 'sentence', label: 'Sentence case' },
          { id: 'camel', label: 'camelCase' },
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => convert(btn.id)}
            className="glass px-6 py-3 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-widest border-white/5"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert..."
          className="w-full h-64 bg-white/5 border border-white/10 rounded-[32px] p-8 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all resize-none placeholder:text-white/10"
        />
        <button
          onClick={copyToClipboard}
          className="absolute bottom-6 right-8 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/10"
        >
          {isCopied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
        </button>
      </div>

      <div className="flex justify-between items-center px-4">
        <div className="text-white/20 text-xs font-bold uppercase tracking-widest">
          {text.length} characters
        </div>
        <button
          onClick={() => setText('')}
          className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default CaseConverter;
