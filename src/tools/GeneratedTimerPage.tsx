import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { TimerEngine, cn } from '../App';
import { DURATIONS, ACTIVITIES, METHODS } from '../timerData';
import TimerTemplate from '../components/TimerTemplate';
import { Timer, Zap, Brain, Wind, Coffee, BookOpen, Dumbbell, Sparkles } from 'lucide-react';

const GeneratedTimerPage = () => {
  const { duration, activity, method } = useParams<{ duration: string; activity: string; method: string }>();

  const dur = DURATIONS.find(d => d.id === duration) || DURATIONS[3]; // Default to 5m
  const act = ACTIVITIES.find(a => a.id === activity) || ACTIVITIES[0];
  const meth = METHODS.find(m => m.id === method) || METHODS[0];

  const title = `${dur.label} ${act.label} Timer (${meth.label})`;
  const description = `Optimize your ${act.label.toLowerCase()} session with this specialized ${dur.label} ${meth.label} timer. Designed for peak productivity and focus.`;
  
  const explanation = {
    title: `Why use a ${dur.label} ${act.label} timer?`,
    content: `Using a dedicated ${dur.label} timer for ${act.label.toLowerCase()} helps create a mental trigger, signaling to your brain that it's time to enter a specific state of performance using the ${meth.label} method.`
  };

  const tips = [
    `Prepare your ${act.label.toLowerCase()} environment before starting.`,
    `Use the ${dur.label} as a single, uninterrupted block.`,
    `Review your progress immediately after the timer ends.`
  ];

  const faq = [
    { q: 'How do I use this timer?', a: 'Simply click the start button to begin your session.' },
    { q: 'Can I pause the timer?', a: 'Yes, you can pause and resume the timer at any time.' },
    { q: 'Does it work in background tabs?', a: 'Yes, our timer uses timestamp reconciliation to stay accurate even if you switch tabs.' }
  ];

  const getIcon = (activity: string) => {
    switch (activity) {
      case 'study': return <BookOpen size={24} />;
      case 'workout': return <Dumbbell size={24} />;
      case 'meditation': return <Wind size={24} />;
      case 'cooking': return <Coffee size={24} />;
      default: return <Timer size={24} />;
    }
  };

  return (
    <TimerTemplate
      title={title}
      description={description}
      explanation={explanation}
      tips={tips}
      faq={faq}
      timerComponent={<TimerEngine initialSeconds={dur.seconds} type={act.id} title={title} category={act.id} />}
      categoryColor="text-indigo-glow"
      categoryIcon={getIcon(act.id)}
      categoryLabel={act.label}
    />
  );
};

export default GeneratedTimerPage;
