import React from 'react';
import { 
  Timer, 
  TimerReset, 
  Brain, 
  AlarmClock, 
  Repeat, 
  Dumbbell, 
  Wind, 
  ShieldCheck,
  Type,
  Calculator,
  Calendar,
  CheckSquare,
  Hash,
  RotateCw,
  FileText,
  ListTodo,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

export type ToolCategory = 'Time' | 'Focus' | 'Planning' | 'Calculation' | 'Text' | 'Utility' | 'Study' | 'Workout' | 'Meditation';

export const CATEGORIES = [
  { id: 'Focus', label: 'Focus', icon: <Brain size={24} />, color: 'text-indigo-glow' },
  { id: 'Workout', label: 'Workout', icon: <Zap size={24} />, color: 'text-electric-blue' },
  { id: 'Meditation', label: 'Meditation', icon: <Wind size={24} />, color: 'text-blue-400' },
  { id: 'Study', label: 'Study', icon: <Timer size={24} />, color: 'text-emerald-400' }
];

export interface SeoVariation {
  id: string;
  name: string;
  description: string;
  params?: Record<string, any>;
  explanation: string;
  tips: string[];
  faq: { q: string; a: string }[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: React.ReactNode;
  path: string;
  color: string;
  explanation: string;
  faq: { q: string; a: string }[];
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  seoVariations?: SeoVariation[];
}

export const TOOL_REGISTRY: ToolDefinition[] = [
  // --- TIME TOOLS ---
  {
    id: 'timer',
    name: 'Timer',
    description: 'Simple countdown timer for any task.',
    category: 'Study',
    icon: <Timer size={24} />,
    path: '/tools/timer',
    color: 'text-indigo-glow',
    explanation: 'A high-precision countdown timer that works in the background. Perfect for cooking, studying, or any time-sensitive activity.',
    faq: [
      { q: 'Does it work in the background?', a: 'Yes, our timer uses timestamp reconciliation to stay accurate even if you switch tabs.' },
      { q: 'Can I set multiple timers?', a: 'Currently, you can set one active timer per tab.' }
    ],
    component: React.lazy(() => import('./tools/TimerTool')),
    seoVariations: [
      {
        id: '1-minute-timer',
        name: '1 Minute Timer',
        description: 'Quick 1 minute countdown timer.',
        params: { duration: 60 },
        explanation: 'A simple 1-minute timer for quick tasks, breathing exercises, or short breaks.',
        tips: ['Use this for quick focus sprints.', 'Great for short stretching breaks.'],
        faq: [{ q: 'Is it free?', a: 'Yes, all our tools are free.' }]
      },
      {
        id: '5-minute-timer',
        name: '5 Minute Timer',
        description: 'Standard 5 minute countdown timer.',
        params: { duration: 300 },
        explanation: 'A versatile 5-minute timer for various daily tasks.',
        tips: ['Perfect for quick cleanups.', 'Use for short meditation sessions.'],
        faq: [{ q: 'Can I pause it?', a: 'Yes, you can pause at any time.' }]
      }
    ]
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Precision time tracking with lap support.',
    category: 'Time',
    icon: <TimerReset size={24} />,
    path: '/tools/stopwatch',
    color: 'text-yellow-400',
    explanation: 'Track elapsed time with millisecond precision. Includes lap timing for split-second analysis.',
    faq: [
      { q: 'How many laps can I record?', a: 'You can record an unlimited number of laps during a single session.' },
      { q: 'Can I export my laps?', a: 'Lap data is currently stored locally in your session.' }
    ],
    component: React.lazy(() => import('./tools/Stopwatch'))
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    description: 'Focus and break cycles for peak productivity.',
    category: 'Focus',
    icon: <Brain size={24} />,
    path: '/tools/pomodoro',
    color: 'text-red-400',
    explanation: 'The Pomodoro Technique uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.',
    faq: [
      { q: 'What is the Pomodoro Technique?', a: 'It is a time management method developed by Francesco Cirillo in the late 1980s.' },
      { q: 'Can I customize the intervals?', a: 'Yes, you can adjust focus and break durations in the settings.' }
    ],
    component: React.lazy(() => import('./tools/PomodoroTimer'))
  },
  {
    id: 'alarm-clock',
    name: 'Alarm Clock',
    description: 'Never miss a beat with custom alerts.',
    category: 'Time',
    icon: <AlarmClock size={24} />,
    path: '/tools/alarm-clock',
    color: 'text-violet-glow',
    explanation: 'Set multiple alarms with custom labels. Perfect for wake-up calls or important reminders throughout the day.',
    faq: [
      { q: 'Will the alarm sound if my computer is asleep?', a: 'Most browsers require the tab to be active or the computer to be awake for the sound to play.' },
      { q: 'Can I choose different sounds?', a: 'Yes, you can select from various notification sounds in the settings.' }
    ],
    component: React.lazy(() => import('./tools/AlarmClock'))
  },
  {
    id: 'interval-timer',
    name: 'Interval Timer',
    description: 'Custom work and rest cycles for training.',
    category: 'Workout',
    icon: <Repeat size={24} />,
    path: '/tools/interval-timer',
    color: 'text-emerald-400',
    explanation: 'Highly configurable timer for HIIT, circuit training, or any activity requiring repeated work and rest intervals.',
    faq: [
      { q: 'What is HIIT?', a: 'High-Intensity Interval Training involves short bursts of intense exercise alternated with low-intensity recovery periods.' },
      { q: 'Can I save my workout routines?', a: 'Your last used settings are automatically saved for your next session.' }
    ],
    component: React.lazy(() => import('./tools/IntervalTimer'))
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Calm sessions with ambient sounds.',
    category: 'Meditation',
    icon: <Wind size={24} />,
    path: '/tools/meditation',
    color: 'text-blue-400',
    explanation: 'Find your inner peace with our guided meditation timer. Features soft ambient backgrounds and gentle alerts.',
    faq: [
      { q: 'How long should I meditate?', a: 'Even 5-10 minutes a day can have significant benefits for mental clarity and stress reduction.' },
      { q: 'Are there guided sessions?', a: 'This is a self-guided timer designed to provide a peaceful environment for your practice.' }
    ],
    component: React.lazy(() => import('./tools/MeditationTimer'))
  },

  // --- FOCUS TOOLS ---
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Build and maintain positive daily habits.',
    category: 'Focus',
    icon: <TrendingUp size={24} />,
    path: '/tools/habit-tracker',
    color: 'text-emerald-400',
    explanation: 'Track your daily progress and build long-term streaks. Consistency is the key to forming new habits.',
    faq: [
      { q: 'How long does it take to form a habit?', a: 'On average, it takes about 66 days for a new behavior to become automatic.' },
      { q: 'What happens if I miss a day?', a: 'Don\'t worry! The goal is long-term consistency, not perfection. Just start again the next day.' }
    ],
    component: React.lazy(() => import('./tools/HabitTracker'))
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: 'Minimalist interface for deep work.',
    category: 'Focus',
    icon: <ShieldCheck size={24} />,
    path: '/tools/focus-timer',
    color: 'text-electric-blue',
    explanation: 'A distraction-free timer designed for deep work sessions. No clutter, just you and your focus.',
    faq: [
      { q: 'What is Deep Work?', a: 'Deep work is the ability to focus without distraction on a cognitively demanding task.' },
      { q: 'Why is the interface so simple?', a: 'To minimize visual distractions and help you stay in the flow state.' }
    ],
    component: React.lazy(() => import('./tools/FocusTimer'))
  },

  // --- PLANNING TOOLS ---
  {
    id: 'task-list',
    name: 'Task List',
    description: 'Simple and effective to-do list manager.',
    category: 'Planning',
    icon: <ListTodo size={24} />,
    path: '/tools/task-list',
    color: 'text-indigo-glow',
    explanation: 'Manage your daily tasks with ease. Add, complete, and organize your to-dos in a clean, glassmorphic interface.',
    faq: [
      { q: 'Is my data saved?', a: 'Yes, all your tasks are stored locally in your browser\'s localStorage.' },
      { q: 'Can I categorize tasks?', a: 'Currently, it supports a single unified list for maximum simplicity.' }
    ],
    component: React.lazy(() => import('./tools/TaskList'))
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    description: 'Plan your day hour by hour.',
    category: 'Planning',
    icon: <Calendar size={24} />,
    path: '/tools/daily-planner',
    color: 'text-violet-glow',
    explanation: 'Schedule your day with precision. Time-blocking is one of the most effective ways to manage a busy schedule.',
    faq: [
      { q: 'What is time-blocking?', a: 'It is a productivity technique where you schedule every part of your day into specific blocks of time.' },
      { q: 'Can I print my schedule?', a: 'You can use your browser\'s print function to save a copy of your plan.' }
    ],
    component: React.lazy(() => import('./tools/DailyPlanner'))
  },

  // --- TEXT TOOLS ---
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Instant word and character counting.',
    category: 'Text',
    icon: <Type size={24} />,
    path: '/tools/word-counter',
    color: 'text-orange-400',
    explanation: 'Analyze your text in real-time. Get counts for words, characters, sentences, and paragraphs instantly.',
    faq: [
      { q: 'Is my text sent to a server?', a: 'No, all processing happens locally in your browser for maximum privacy.' },
      { q: 'Does it count spaces?', a: 'It provides both character counts with and without spaces.' }
    ],
    component: React.lazy(() => import('./tools/WordCounter'))
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Transform text case instantly.',
    category: 'Text',
    icon: <FileText size={24} />,
    path: '/tools/case-converter',
    color: 'text-blue-400',
    explanation: 'Quickly convert text between UPPERCASE, lowercase, Title Case, and more. Save time on manual editing.',
    faq: [
      { q: 'What cases are supported?', a: 'Upper, lower, title, sentence, and camel case.' },
      { q: 'Can I copy the result?', a: 'Yes, there is a one-click copy button for your convenience.' }
    ],
    component: React.lazy(() => import('./tools/CaseConverter'))
  },

  // --- CALCULATION TOOLS ---
  {
    id: 'time-calculator',
    name: 'Time Calculator',
    description: 'Add or subtract time durations.',
    category: 'Calculation',
    icon: <Clock size={24} />,
    path: '/tools/time-calculator',
    color: 'text-yellow-400',
    explanation: 'Easily calculate the sum or difference between time durations. Perfect for tracking work hours or planning schedules.',
    faq: [
      { q: 'Does it handle 24-hour time?', a: 'Yes, it works with standard time durations in hours, minutes, and seconds.' },
      { q: 'Can I add multiple durations?', a: 'Yes, you can add as many time blocks as you need.' }
    ],
    component: React.lazy(() => import('./tools/TimeCalculator'))
  },

  // --- UTILITY TOOLS ---
  {
    id: 'random-number',
    name: 'Random Number',
    description: 'Generate truly random numbers.',
    category: 'Utility',
    icon: <Hash size={24} />,
    path: '/tools/random-number',
    color: 'text-emerald-400',
    explanation: 'Generate random numbers within a custom range. Useful for games, decisions, or statistical sampling.',
    faq: [
      { q: 'Is it truly random?', a: 'It uses the browser\'s cryptographically strong random number generator.' },
      { q: 'Can I generate multiple numbers?', a: 'Yes, you can specify how many numbers you need at once.' }
    ],
    component: React.lazy(() => import('./tools/RandomNumber'))
  },
  {
    id: 'decision-maker',
    name: 'Decision Maker',
    description: 'Let fate decide your next move.',
    category: 'Utility',
    icon: <RotateCw size={24} />,
    path: '/tools/decision-maker',
    color: 'text-pink-400',
    explanation: 'Struggling to choose? Enter your options and let our randomizer pick for you. Perfect for lunch choices or quick decisions.',
    faq: [
      { q: 'How many options can I add?', a: 'You can add as many options as you like.' },
      { q: 'Can I save my lists?', a: 'Your current list is saved locally so you can reuse it later.' }
    ],
    component: React.lazy(() => import('./tools/DecisionMaker'))
  },
  {
    id: 'note-pad',
    name: 'Note Pad',
    description: 'Quick and simple scratchpad.',
    category: 'Utility',
    icon: <FileText size={24} />,
    path: '/tools/note-pad',
    color: 'text-indigo-glow',
    explanation: 'A simple, clean space to jot down quick notes, ideas, or reminders. Automatically saved as you type.',
    faq: [
      { q: 'Is there a character limit?', a: 'The limit is based on your browser\'s localStorage capacity, which is typically around 5MB.' },
      { q: 'Can I have multiple notes?', a: 'Currently, it provides one large persistent scratchpad.' }
    ],
    component: React.lazy(() => import('./tools/NotePad'))
  }
];
