import React from 'react';
import { BookOpen, Zap, Brain, Clock, ShieldCheck, FileText } from 'lucide-react';

export interface ContentVariation {
  id: string;
  title: string;
  description: string;
  content: string;
  tips: string[];
  faq: { q: string; a: string }[];
  relatedTools: string[];
  relatedArticles: string[];
}

export const CONTENT_REGISTRY: ContentVariation[] = [
  {
    id: 'pomodoro-technique',
    title: 'Pomodoro Technique Guide',
    description: 'Master the art of focus with the Pomodoro technique.',
    content: 'The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.',
    tips: ['Stick to the 25-minute focus blocks.', 'Take short, meaningful breaks.'],
    faq: [{ q: 'What is the Pomodoro Technique?', a: 'It is a time management method developed by Francesco Cirillo in the late 1980s.' }],
    relatedTools: ['pomodoro'],
    relatedArticles: ['deep-work-method']
  },
  {
    id: 'deep-work-method',
    title: 'Deep Work Method',
    description: 'Achieve more in less time with Deep Work.',
    content: 'Deep work is the ability to focus without distraction on a cognitively demanding task.',
    tips: ['Schedule deep work blocks.', 'Eliminate all distractions.'],
    faq: [{ q: 'Why is Deep Work important?', a: 'It helps you achieve higher quality results in less time.' }],
    relatedTools: ['focus-timer'],
    relatedArticles: ['pomodoro-technique']
  }
];
