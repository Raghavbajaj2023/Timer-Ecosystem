import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../App';

interface TimerTemplateProps {
  title: string;
  description: string;
  explanation: { title: string; content: string };
  tips: string[];
  faq: { q: string; a: string }[];
  timerComponent: React.ReactNode;
  categoryColor: string;
  categoryIcon: React.ReactNode;
  categoryLabel: string;
}

const TimerTemplate: React.FC<TimerTemplateProps> = ({
  title,
  description,
  explanation,
  tips,
  faq,
  timerComponent,
  categoryColor,
  categoryIcon,
  categoryLabel
}) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-8 font-bold tracking-widest uppercase text-sm", categoryColor)}
        >
          {categoryIcon} {categoryLabel} Mode
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">{title}</h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="glass p-12 md:p-24 rounded-[60px] mb-20 relative overflow-hidden">
        <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50", categoryColor)} />
        {timerComponent}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <section className="glass p-10 rounded-[40px]">
          <h2 className="text-3xl font-bold mb-6">{explanation.title}</h2>
          <p className="text-white/50 leading-relaxed text-lg">{explanation.content}</p>
        </section>
        <section className="glass p-10 rounded-[40px]">
          <h2 className="text-3xl font-bold mb-6">Expert Tips</h2>
          <ul className="space-y-4">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-white/50 text-lg">
                <div className={cn("mt-1 shrink-0 w-2 h-2 rounded-full", categoryColor.replace('text-', 'bg-'))} />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass p-10 rounded-[40px]">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faq.map((item, i) => (
            <div key={i} className="space-y-2">
              <h3 className="font-bold text-white/90">{item.q}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TimerTemplate;
