import React, { useState, useEffect } from 'react';
import { FileText, Save, Trash2, Copy, Check } from 'lucide-react';
import { cn } from '../App';

const NotePad = () => {
  const [note, setNote] = useState(() => {
    return localStorage.getItem('productivity-note') || '';
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('productivity-note', note);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [note]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(note);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const clearNote = () => {
    if (window.confirm('Are you sure you want to clear your note?')) {
      setNote('');
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-white/40">
          <FileText size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">
            {isSaved ? "Auto-saved" : "Typing..."}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-indigo-glow transition-colors"
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            {isCopied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={clearNote}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Start typing your thoughts..."
          className="w-full h-[500px] bg-white/5 border border-white/10 rounded-[40px] p-12 text-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-glow/50 transition-all resize-none placeholder:text-white/5 font-medium"
        />
        <div className="absolute top-12 left-12 w-1 h-8 bg-indigo-glow/20 rounded-full group-focus-within:bg-indigo-glow transition-colors" />
      </div>

      <div className="text-center text-white/20 text-xs font-bold uppercase tracking-widest">
        Your notes are stored locally and never leave your browser.
      </div>
    </div>
  );
};

export default NotePad;
