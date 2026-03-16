/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate, 
  useLocation,
  Navigate,
  Outlet
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageWrapper from './components/LanguageWrapper';
import { LocalizedLink } from './components/LocalizedLink';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Settings, 
  History, 
  Plus, 
  ChevronRight, 
  Home as HomeIcon,
  Coffee,
  Brain,
  Timer as TimerIcon,
  Palette,
  Bell,
  BellOff,
  Heart,
  AlarmClock,
  Repeat,
  Dumbbell,
  Wind,
  LayoutGrid,
  Search,
  Trash2,
  PlusCircle,
  TimerReset,
  Activity,
  Award,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Types & Constants ---

type Theme = 'default' | 'minimal' | 'neon' | 'soft-glow' | 'dark-focus';
type Sound = 'bell' | 'beep' | 'silent';

interface TimerSession {
  id: string;
  duration: number;
  timestamp: number;
  type: string;
  category?: string;
}

interface TimerSettings {
  theme: Theme;
  sound: Sound;
  isMuted: boolean;
}

interface UserAnalytics {
  mostUsedDurations: Record<number, number>;
  totalSessions: number;
  lastUsedCategory?: string;
  toolUsage: Record<string, number>;
  totalFocusMinutes: number;
}

export interface ProductivityTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  description: string;
}

export const PRODUCTIVITY_TOOLS: ProductivityTool[] = [
  { id: 'timers', name: 'Timers', icon: <TimerIcon size={24} />, path: '/timers', color: 'text-indigo-glow', description: 'Specialized countdown tools for any task.' },
  { id: 'stopwatch', name: 'Stopwatch', icon: <TimerReset size={24} />, path: '/stopwatch', color: 'text-yellow-400', description: 'Precision time tracking with lap support.' },
  { id: 'pomodoro', name: 'Pomodoro', icon: <Brain size={24} />, path: '/pomodoro-timer', color: 'text-red-400', description: 'Focus and break cycles for peak productivity.' },
  { id: 'alarm', name: 'Alarm Clock', icon: <AlarmClock size={24} />, path: '/alarm-clock', color: 'text-violet-glow', description: 'Never miss a beat with custom alerts.' },
  { id: 'interval', name: 'Interval Timer', icon: <Repeat size={24} />, path: '/interval-timer', color: 'text-emerald-400', description: 'Custom work and rest cycles for training.' },
  { id: 'workout', name: 'Workout Timer', icon: <Dumbbell size={24} />, path: '/workout-timer', color: 'text-orange-400', description: 'Themed intervals for your fitness routine.' },
  { id: 'meditation', name: 'Meditation', icon: <Wind size={24} />, path: '/meditation-timer', color: 'text-blue-400', description: 'Calm sessions with ambient sounds.' },
  { id: 'focus', name: 'Focus Timer', icon: <ShieldCheck size={24} />, path: '/focus-timer', color: 'text-electric-blue', description: 'Minimalist interface for deep work.' },
];

const CATEGORIES = [
  { id: 'study', label: 'Study', icon: <Brain size={20} />, color: 'text-indigo-glow' },
  { id: 'workout', label: 'Workout', icon: <Zap size={20} />, color: 'text-yellow-400' },
  { id: 'meditation', label: 'Meditation', icon: <TimerIcon size={20} />, color: 'text-violet-glow' },
  { id: 'focus', label: 'Focus', icon: <ShieldCheck size={20} />, color: 'text-electric-blue' },
  { id: 'cooking', label: 'Cooking', icon: <Coffee size={20} />, color: 'text-orange-400' },
  { id: 'exercise', label: 'Exercise', icon: <Zap size={20} />, color: 'text-green-400' },
  { id: 'reading', label: 'Reading', icon: <Clock size={20} />, color: 'text-blue-400' },
  { id: 'cleaning', label: 'Cleaning', icon: <RotateCcw size={20} />, color: 'text-pink-400' },
  { id: 'productivity', label: 'Productivity', icon: <Zap size={20} />, color: 'text-indigo-400' },
];

const PRESETS = [1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60];

// Utility for tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Context ---

const TimerContext = createContext<{
  settings: TimerSettings;
  setSettings: React.Dispatch<React.SetStateAction<TimerSettings>>;
  history: TimerSession[];
  addHistory: (duration: number, type: string, category?: string) => void;
  clearHistory: () => void;
  favorites: string[];
  toggleFavorite: (timerId: string) => void;
  analytics: UserAnalytics;
} | null>(null);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used within TimerProvider');
  return context;
};

import { TOOL_REGISTRY } from './registry';

const Stopwatch = React.lazy(() => import('./tools/Stopwatch'));
const AlarmClockTool = React.lazy(() => import('./tools/AlarmClock'));
const IntervalTimer = React.lazy(() => import('./tools/IntervalTimer'));
const PomodoroTimer = React.lazy(() => import('./tools/PomodoroTimer'));
const WorkoutTimer = React.lazy(() => import('./tools/WorkoutTimer'));
const MeditationTimer = React.lazy(() => import('./tools/MeditationTimer'));
const FocusTimer = React.lazy(() => import('./tools/FocusTimer'));
const ProductivityHub = React.lazy(() => import('./tools/ProductivityHub'));
const GenericToolPage = React.lazy(() => import('./tools/GenericToolPage'));
const SeoToolPage = React.lazy(() => import('./tools/SeoToolPage'));
const DynamicTimerPage = React.lazy(() => import('./tools/DynamicTimerPage'));
const GeneratedTimerPage = React.lazy(() => import('./tools/GeneratedTimerPage'));
const GenericPage = React.lazy(() => import('./tools/GenericPage'));
const CategoryHub = React.lazy(() => import('./tools/CategoryHub'));
const TimerDirectory = React.lazy(() => import('./tools/TimerDirectory'));
const LearnHub = React.lazy(() => import('./content/LearnHub'));
const EmbedTimerGenerator = React.lazy(() => import('./tools/EmbedTimerGenerator'));
const EmbedTimer = React.lazy(() => import('./tools/EmbedTimer'));
const TimerHub = React.lazy(() => import('./tools/TimerHub'));
const SlugResolver = React.lazy(() => import('./tools/SlugResolver'));
const ScalableTimerPage = React.lazy(() => import('./tools/ScalableTimerPage'));
const ScalableHubPage = React.lazy(() => import('./tools/ScalableHubPage'));
const TimerCollections = React.lazy(() => import('./tools/TimerCollections'));
const TimerArticles = React.lazy(() => import('./tools/TimerArticles'));
const ArticlePage = React.lazy(() => import('./content/ArticlePage'));

// --- Components ---

const Background = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);
  const { settings } = useTimer();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only update occasionally for performance
      if (Math.random() > 0.5) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getAuroraColors = () => {
    if (settings.theme === 'neon') return 'from-neon-pink/20 via-transparent to-neon-cyan/20';
    if (settings.theme === 'minimal') return 'from-white/5 via-transparent to-white/5';
    if (settings.theme === 'soft-glow') return 'from-orange-400/10 via-transparent to-violet-glow/10';
    if (settings.theme === 'dark-focus') return 'from-black via-navy-900 to-black';
    return 'from-indigo-glow/20 via-transparent to-electric-blue/20';
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-navy-900">
      {/* Aurora Layer */}
      <motion.div 
        style={{ y: y1 }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={cn("aurora-layer absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br bg-[length:200%_200%]", getAuroraColors())}
      />
      
      {/* Glow Blobs */}
      <motion.div 
        style={{ y: y2 }}
        className={cn(
          "absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px]",
          settings.theme === 'neon' ? "bg-neon-pink/20" : "bg-indigo-glow/30"
        )}
      />
      <motion.div 
        style={{ y: y3 }}
        className={cn(
          "absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full blur-[150px]",
          settings.theme === 'neon' ? "bg-neon-cyan/10" : "bg-violet-glow/20"
        )}
      />
      
      {/* Particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(window.innerWidth < 768 ? 10 : 30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            initial={{ 
              x: Math.random() * 100 + 'vw', 
              y: Math.random() * 100 + 'vh',
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              y: ['-10vh', '110vh'],
              x: `calc(${Math.random() * 100}vw + ${mousePos.x * (Math.random() * 2 - 1)}px)`,
              opacity: [0, 1, 0]
            }}
            transition={{
              y: { duration: Math.random() * 15 + 15, repeat: Infinity, ease: "linear" },
              x: { duration: 2, ease: "easeOut" },
              opacity: { duration: Math.random() * 15 + 15, repeat: Infinity, ease: "linear" }
            }}
          />
        ))}
      </div>
    </div>
  );
};

const CircularProgress = ({ progress, time, theme, isActive, isFinished }: { progress: number; time: string; theme: Theme; isActive: boolean; isFinished: boolean }) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColors = () => {
    if (theme === 'neon') return { stop1: '#ff007f', stop2: '#00ffff', text: 'text-glow-pink' };
    if (theme === 'minimal') return { stop1: '#ffffff', stop2: '#ffffff', text: '' };
    if (theme === 'soft-glow') return { stop1: '#f6ad55', stop2: '#805ad5', text: 'text-orange-400' };
    if (theme === 'dark-focus') return { stop1: '#4a5568', stop2: '#2d3748', text: 'text-white/20' };
    return { stop1: '#4f46e5', stop2: '#00d2ff', text: 'text-glow' };
  };

  const colors = getColors();

  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-indigo-glow/10 blur-2xl"
        />
      )}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-4 border-indigo-glow/50 blur-md"
        />
      )}
      <svg className="w-full h-full transform -rotate-90 relative z-10">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke={`url(#gradient-${theme})`}
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "linear" }}
          strokeLinecap="round"
          fill="transparent"
        />
        <defs>
          <linearGradient id={`gradient-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.stop1} />
            <stop offset="100%" stopColor={colors.stop2} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.span 
          key={time}
          initial={{ opacity: 0, scale: isActive ? 1.1 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn("text-6xl md:text-7xl font-bold tracking-tighter", colors.text)}
        >
          {time}
        </motion.span>
      </div>
    </div>
  );
};

export const TimerEngine = ({ 
  initialSeconds, 
  onComplete, 
  type = 'timer',
  title = 'Timer',
  category
}: { 
  initialSeconds: number; 
  onComplete?: () => void;
  type?: string;
  title?: string;
  category?: string;
}) => {
  const { settings, addHistory } = useTimer();
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsActive(false);
    setIsFinished(false);
    endTimeRef.current = null;
  }, [initialSeconds]);

  const playSound = useCallback(() => {
    if (settings.isMuted || settings.sound === 'silent') return;
    
    const sounds = {
      bell: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      beep: 'https://assets.mixkit.co/active_storage/sfx/1003/1003-preview.mp3'
    };
    
    const audio = new Audio(sounds[settings.sound as keyof typeof sounds] || sounds.bell);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, [settings]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    playSound();
    addHistory(initialSeconds, type, category);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: settings.theme === 'neon' ? ['#ff007f', '#00ffff'] : ['#4f46e5', '#00d2ff', '#8b5cf6']
    });
    if (onComplete) onComplete();
  }, [playSound, initialSeconds, type, category, addHistory, onComplete, settings.theme]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current! - Date.now()) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleComplete();
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      endTimeRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, handleComplete]);

  const toggleTimer = () => {
    if (isFinished) {
      resetTimer();
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
    setIsFinished(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialSeconds);
    setIsFinished(false);
    endTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / initialSeconds) * 100;

  return (
    <div className="flex flex-col items-center gap-12">
      <CircularProgress progress={progress} time={formatTime(timeLeft)} theme={settings.theme} isActive={isActive} isFinished={isFinished} />
      
      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-2xl font-bold text-electric-blue flex items-center gap-2"
          >
            <CheckCircle2 /> Time's up.
          </motion.div>
        ) : (
          <div className="flex items-center gap-4">
            <MagneticButton
              onClick={toggleTimer}
              className={cn(
                "px-8 h-16 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-lg",
                isActive ? "bg-white/10 text-white hover:bg-white/20" : "bg-indigo-glow text-white shadow-lg shadow-indigo-glow/20 hover:bg-indigo-500"
              )}
            >
              {isActive ? (
                <><Pause size={24} /> Pause</>
              ) : (
                <><Play size={24} /> {timeLeft === initialSeconds ? 'Start' : 'Resume'}</>
              )}
            </MagneticButton>
            
            <MagneticButton
              onClick={resetTimer}
              className="px-6 h-16 rounded-2xl bg-white/5 flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 font-bold text-lg text-white/80 hover:text-white"
            >
              <RotateCcw size={20} /> Reset
            </MagneticButton>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Pages ---

const Home = () => {
  const { history, clearHistory, favorites, analytics } = useTimer();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const parsedDurationMatch = searchQuery.match(/(\d+)\s*(min|minute|m)/i);
  const parsedDuration = parsedDurationMatch ? parseInt(parsedDurationMatch[1]) : null;
  
  const isTimerQuery = searchQuery.toLowerCase().includes('timer');
  
  const dynamicTimerResult = (parsedDuration || isTimerQuery) && searchQuery.length > 2 ? {
    id: 'dynamic-search-timer',
    name: `${parsedDuration || 5} Minute Timer`,
    description: `Custom ${parsedDuration || 5} minute countdown timer`,
    path: `/timer/${parsedDuration || 5}-minute-timer`,
    category: 'timer',
    icon: <TimerIcon size={24} />,
    color: 'text-indigo-glow'
  } : null;

  const filteredTools = TOOL_REGISTRY.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);
  
  const allResults = dynamicTimerResult ? [dynamicTimerResult, ...filteredTools] : filteredTools;

  // Interactive Cursor Effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const quickActions = [
    { d: 1, label: '1 Minute Timer', path: '/timer/1-minute-timer' },
    { d: 5, label: '5 Minute Timer', path: '/timer/5-minute-timer' },
    { d: 10, label: '10 Minute Timer', path: '/timer/10-minute-timer' },
    { d: 25, label: '25 Minute Pomodoro', path: '/timer/25-minute-focus-pomodoro-timer' },
    { d: 30, label: '30 Minute Focus', path: '/timer/30-minute-focus-timer' },
  ];

  const features = [
    { title: 'Beautiful countdown timers', icon: <TimerIcon size={24} />, color: 'text-indigo-glow' },
    { title: 'Pomodoro focus timers', icon: <Brain size={24} />, color: 'text-red-400' },
    { title: 'Workout interval timers', icon: <Dumbbell size={24} />, color: 'text-orange-400' },
    { title: 'Meditation timers', icon: <Wind size={24} />, color: 'text-blue-400' },
    { title: 'Thousands of variations', icon: <LayoutGrid size={24} />, color: 'text-violet-glow' },
  ];

  const categories = [
    { name: 'Study', icon: <Brain size={24} />, path: '/timer-for-studying', color: 'text-indigo-glow' },
    { name: 'Workout', icon: <Dumbbell size={24} />, path: '/timer-for-workouts', color: 'text-orange-400' },
    { name: 'Meditation', icon: <Wind size={24} />, path: '/timer-for-meditation', color: 'text-blue-400' },
    { name: 'Cooking', icon: <Coffee size={24} />, path: '/timer-for-cooking', color: 'text-yellow-400' },
    { name: 'Focus', icon: <ShieldCheck size={24} />, path: '/timer-for-focus', color: 'text-electric-blue' },
  ];

  const trendingTimers = [
    { d: 5, label: '5 Minute Timer', path: '/timer/5-minute-timer' },
    { d: 10, label: '10 Minute Timer', path: '/timer/10-minute-timer' },
    { d: 25, label: '25 Minute Pomodoro', path: '/timer/25-minute-focus-pomodoro-timer' },
    { d: 30, label: '30 Minute Workout', path: '/timer/30-minute-workout-timer' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Interactive Cursor Glow (hidden on mobile) */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.05), transparent 40%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* HERO SECTION */}
        <header className="min-h-[80vh] flex flex-col items-center justify-center text-center relative mb-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-glow/5 blur-[120px] -z-10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 blur-[100px] -z-10 rounded-full" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 w-full max-w-2xl mx-auto"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass p-8 rounded-[48px] border border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group hero-timer-container"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <TimerEngine initialSeconds={300} type="hero" title="5m Timer" />
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
          >
            The Most Beautiful<br />Online Timer
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Start a 5 minute timer instantly or explore thousands of timers designed for deep work and precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <MagneticButton 
              onClick={() => {
                const timerPlayBtn = document.querySelector('.hero-timer-container button') as HTMLButtonElement;
                if (timerPlayBtn) timerPlayBtn.click();
              }}
              className="px-8 py-4 rounded-full bg-white text-navy-900 font-bold text-lg shadow-xl shadow-white/10 flex items-center gap-2"
            >
              <Play size={20} /> Start Timer
            </MagneticButton>
            <Link to="/timers">
              <MagneticButton 
                className="px-8 py-4 rounded-full glass text-white font-bold text-lg border border-white/10 flex items-center gap-2"
              >
                Browse Timers <ChevronRight size={20} />
              </MagneticButton>
            </Link>
          </motion.div>
        </header>

        {/* QUICK ACTIONS */}
        <motion.section 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.path}>
                <MagneticButton
                  className="px-6 py-3 rounded-full glass border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-indigo-glow/10 text-sm font-medium flex items-center gap-2"
                >
                  <Clock size={16} className="text-indigo-glow" />
                  {action.label}
                </MagneticButton>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* SEARCH SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto mb-32 relative z-20"
        >
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-white/20">
            <Search size={28} />
          </div>
          <input 
            type="text"
            placeholder="Search ecosystem (e.g. '15 minute timer', 'pomodoro'...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-[40px] py-8 pl-20 pr-10 text-2xl focus:outline-none focus:ring-4 focus:ring-indigo-glow/20 transition-all backdrop-blur-2xl shadow-2xl"
          />
          
          <AnimatePresence>
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-6 glass rounded-[40px] p-6 z-50 border border-white/10 shadow-3xl backdrop-blur-3xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allResults.map((t, i) => (
                    <button
                      key={t.id || i}
                      onClick={() => navigate(t.path)}
                      className="w-full flex items-center gap-6 p-6 hover:bg-white/5 rounded-3xl transition-all group text-left"
                    >
                      <div className={cn("p-4 rounded-2xl bg-white/5 transition-transform group-hover:scale-110 group-hover:rotate-6", t.color)}>
                        {t.icon}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{t.name}</div>
                        <div className="text-sm text-white/40">{t.category} Tool</div>
                      </div>
                      <ChevronRight size={20} className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
                {allResults.length === 0 && (
                  <div className="text-center py-12 text-white/20 font-bold uppercase tracking-widest">
                    No tools found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* FEATURES SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Platform Features</h2>
            <p className="text-xl text-white/40">Everything you need to master your time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((feature, idx) => (
              <TiltCard
                key={idx}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all hover:shadow-2xl hover:bg-white/5 flex flex-col items-center text-center group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] pointer-events-none" />
                <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6", feature.color)}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg leading-tight">{feature.title}</h3>
              </TiltCard>
            ))}
          </div>
        </motion.section>

        {/* CATEGORIES SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black tracking-tighter">Timer Categories</h2>
            <Link to="/timers" className="text-indigo-glow hover:text-white transition-colors flex items-center gap-2 font-bold">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} to={cat.path}>
                <TiltCard
                  className="group glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all hover:shadow-2xl hover:bg-white/5 relative overflow-hidden h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] pointer-events-none" />
                  <div className={cn("absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500", cat.color.replace('text-', 'bg-'))} />
                  <div className={cn("mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6", cat.color)}>
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{cat.name}</h3>
                  <div className="mt-4 flex items-center gap-2 text-sm text-white/40 group-hover:text-white transition-colors">
                    Explore <ChevronRight size={14} />
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* TRENDING TIMERS */}
        <motion.section 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="flex items-center gap-4 mb-12">
            <Flame className="text-orange-500" size={32} />
            <h2 className="text-4xl font-black tracking-tighter">Trending Timers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingTimers.map((timer, idx) => (
              <Link key={idx} to={timer.path}>
                <TiltCard
                  className="group glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all hover:shadow-2xl hover:bg-white/5 flex flex-col justify-between h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] pointer-events-none" />
                  <div>
                    <div className="text-5xl font-black mb-2 text-white group-hover:text-indigo-glow transition-colors">{timer.d}m</div>
                    <div className="text-lg text-white/60 font-medium">{timer.label}</div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-glow group-hover:text-white transition-all group-hover:rotate-12">
                      <Play size={16} className="ml-1" />
                    </div>
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* INSIGHTS SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-32"
        >
          <div className="flex items-center gap-4 mb-12">
            <Activity className="text-indigo-glow" size={32} />
            <h2 className="text-4xl font-black tracking-tighter">Your Productivity Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TiltCard className="glass p-10 rounded-[48px] border-white/5 hover:border-white/10 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] pointer-events-none" />
              <div className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Total Focus</div>
              <div className="text-6xl font-black text-indigo-glow tracking-tighter">
                {Math.round(analytics.totalFocusMinutes || 0)}<span className="text-2xl ml-2">m</span>
              </div>
            </TiltCard>
            <TiltCard className="glass p-10 rounded-[48px] border-white/5 hover:border-white/10 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] pointer-events-none" />
              <div className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Sessions</div>
              <div className="text-6xl font-black text-violet-glow tracking-tighter">
                {analytics.totalSessions || 0}
              </div>
            </TiltCard>
            <TiltCard className="glass p-10 rounded-[48px] border-white/5 hover:border-white/10 transition-colors group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] pointer-events-none" />
              <div className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Most Used</div>
              <div className="text-3xl font-black text-emerald-400 tracking-tighter uppercase">
                {analytics.lastUsedCategory || 'None'}
              </div>
            </TiltCard>
          </div>
        </motion.section>

      </div>
    </motion.div>
  );
};


export const TiltCard = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable on mobile
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    setRotateX(yPct * -10); // max 5 deg
    setRotateY(xPct * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MagneticButton = ({ children, className, onClick, ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn("relative overflow-hidden group", className)}
      {...props}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]" />
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ top: ripple.y, left: ripple.x, width: 0, height: 0, opacity: 0.5 }}
            animate={{ top: ripple.y - 100, left: ripple.x - 100, width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bg-white/30 rounded-full pointer-events-none z-0"
            onAnimationComplete={() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id))}
          />
        ))}
      </AnimatePresence>
      {children}
    </motion.button>
  );
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {React.cloneElement(
        <Routes>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/timers" element={<PageTransition><TimerDirectory /></PageTransition>} />
          <Route path="/tools" element={<PageTransition><ProductivityHub /></PageTransition>} />
          <Route path="/tools/:toolId" element={<PageTransition><GenericToolPage /></PageTransition>} />
          <Route path="/tools/:toolId/:seoVariation" element={<PageTransition><SeoToolPage /></PageTransition>} />
          <Route path="/tools/category/:category" element={<PageTransition><CategoryHub /></PageTransition>} />
          <Route path="/learn" element={<PageTransition><TimerArticles /></PageTransition>} />
          <Route path="/learn/:articleId" element={<PageTransition><ArticlePage /></PageTransition>} />
          <Route path="/collections" element={<PageTransition><TimerCollections /></PageTransition>} />
          <Route path="/collections/:slug" element={<PageTransition><ScalableHubPage /></PageTransition>} />
          <Route path="/timer/:duration/:activity/:method" element={<PageTransition><ScalableTimerPage /></PageTransition>} />
          <Route path="/timer-for-:activity" element={<PageTransition><GenericPage /></PageTransition>} />
          <Route path="/timer/:slug" element={<PageTransition><SlugResolver /></PageTransition>} />
          <Route path="/timer-hub" element={<PageTransition><TimerHub /></PageTransition>} />
          <Route path="/embed-timer-generator" element={<PageTransition><EmbedTimerGenerator /></PageTransition>} />
          <Route path="/embed-timer" element={<PageTransition><EmbedTimer /></PageTransition>} />
          <Route path="/:slug" element={<PageTransition><SlugResolver /></PageTransition>} />
        </Routes>,
        { key: location.pathname }
      )}
    </AnimatePresence>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { settings, setSettings } = useTimer();
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen selection:bg-electric-blue/30">
      <Background />
      
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-glow to-electric-blue flex items-center justify-center">
              <TimerIcon size={18} className="text-white" />
            </div>
            TimerEcosystem
          </Link>
          
          <div className="hidden lg:flex items-center gap-6">
            <LocalizedLink to="/tools" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Ecosystem</LocalizedLink>
            <LocalizedLink to="/timers" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Timers</LocalizedLink>
            <LocalizedLink to="/tools/focus-timer" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Focus</LocalizedLink>
            <LocalizedLink to="/tools/task-list" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Planning</LocalizedLink>
            <LocalizedLink to="/tools/word-counter" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Text</LocalizedLink>
            <LocalizedLink to="/learn" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Learn</LocalizedLink>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/tools" className="lg:hidden glass p-3 rounded-full hover:bg-white/10 transition-colors">
            <LayoutGrid size={20} />
          </Link>
          <button
            onClick={() => setSettings(s => ({ ...s, isMuted: !s.isMuted }))}
            className="glass p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            {settings.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="glass p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      <main className="pt-24 min-h-screen">
        <React.Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-violet-glow border-t-transparent rounded-full"
            />
          </div>
        }>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </React.Suspense>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-8 rounded-[32px] w-full max-w-md relative z-10"
            >
              <h2 className="text-2xl font-bold mb-8">Settings</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium text-white/40 mb-4 block flex items-center gap-2">
                    <Palette size={16} /> Visual Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['default', 'minimal', 'neon', 'soft-glow', 'dark-focus'] as Theme[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setSettings(s => ({ ...s, theme: t }))}
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-medium border transition-all capitalize",
                          settings.theme === t ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 hover:border-white/10"
                        )}
                      >
                        {t.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/40 mb-4 block flex items-center gap-2">
                    <Bell size={16} /> Notification Sound
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['bell', 'beep', 'silent'] as Sound[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setSettings(prev => ({ ...prev, sound: s }))}
                        className={cn(
                          "py-3 rounded-xl text-sm font-medium border transition-all capitalize",
                          settings.sound === s ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 hover:border-white/10"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-10 bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-semibold transition-colors"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem('timer-settings');
    return saved ? JSON.parse(saved) : { theme: 'default', sound: 'bell', isMuted: false };
  });

  const [history, setHistory] = useState<TimerSession[]>(() => {
    const saved = localStorage.getItem('timer-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('timer-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [analytics, setAnalytics] = useState<UserAnalytics>(() => {
    const saved = localStorage.getItem('timer-analytics');
    return saved ? JSON.parse(saved) : { mostUsedDurations: {}, totalSessions: 0 };
  });

  useEffect(() => {
    localStorage.setItem('timer-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('timer-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('timer-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('timer-analytics', JSON.stringify(analytics));
  }, [analytics]);

  const addHistory = (duration: number, type: string, category?: string) => {
    const newSession: TimerSession = {
      id: Math.random().toString(36).substr(2, 9),
      duration,
      timestamp: Date.now(),
      type,
      category
    };
    setHistory(prev => [newSession, ...prev].slice(0, 20));
    
    setAnalytics(prev => {
      const mins = duration / 60;
      const newMostUsed = { ...prev.mostUsedDurations };
      newMostUsed[mins] = (newMostUsed[mins] || 0) + 1;
      
      const newToolUsage = { ...prev.toolUsage };
      newToolUsage[type] = (newToolUsage[type] || 0) + 1;

      return {
        ...prev,
        mostUsedDurations: newMostUsed,
        totalSessions: prev.totalSessions + 1,
        lastUsedCategory: category || prev.lastUsedCategory,
        toolUsage: newToolUsage,
        totalFocusMinutes: (prev.totalFocusMinutes || 0) + mins
      };
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const toggleFavorite = (timerId: string) => {
    setFavorites(prev => 
      prev.includes(timerId) 
        ? prev.filter(id => id !== timerId) 
        : [...prev, timerId]
    );
  };

  return (
    <TimerContext.Provider value={{ settings, setSettings, history, addHistory, clearHistory, favorites, toggleFavorite, analytics }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/:lang/*" element={<LanguageWrapper />}>
              <Route path="*" element={<AppRoutes />} />
            </Route>
            <Route path="*" element={<Navigate to="/en" replace />} />
          </Routes>
        </Layout>
      </Router>
    </TimerContext.Provider>
  );
}
