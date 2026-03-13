import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Bell, BellOff, Clock, Play } from 'lucide-react';
import { cn } from '../App';

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  sound: string;
}

const AlarmClock = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('productivity-alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newTime, setNewTime] = useState('08:00');
  const [newLabel, setNewLabel] = useState('Alarm');
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    localStorage.setItem('productivity-alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const seconds = now.getSeconds();

      if (seconds === 0) {
        const triggered = alarms.find(a => a.enabled && a.time === currentTime);
        if (triggered) {
          setActiveAlarm(triggered);
          // Play sound logic would go here
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: newTime,
      label: newLabel,
      enabled: true,
      sound: 'bell'
    };
    setAlarms(prev => [...prev, alarm].sort((a, b) => a.time.localeCompare(b.time)));
    setShowAdd(false);
    setNewLabel('Alarm');
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4">Alarm Clock</h1>
        <p className="text-white/40 text-xl">Never miss a beat with custom alerts.</p>
      </div>

      <div className="flex justify-between items-center mb-12">
        <h2 className="text-2xl font-bold">Your Alarms</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-violet-glow text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-violet-glow/20"
        >
          <Plus size={20} /> Add Alarm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {alarms.map(alarm => (
            <motion.div
              key={alarm.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "glass p-8 rounded-[40px] flex justify-between items-center group transition-all",
                !alarm.enabled && "opacity-50 grayscale-[0.5]"
              )}
            >
              <div>
                <div className="text-4xl font-bold mb-2 tabular-nums">{alarm.time}</div>
                <div className="text-white/40 font-medium">{alarm.label}</div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={cn(
                    "w-14 h-8 rounded-full relative transition-all",
                    alarm.enabled ? "bg-violet-glow" : "bg-white/10"
                  )}
                >
                  <motion.div 
                    animate={{ x: alarm.enabled ? 24 : 4 }}
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm"
                  />
                </button>
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {alarms.length === 0 && !showAdd && (
        <div className="text-center py-20 glass rounded-[40px] border-dashed border-white/10">
          <Clock size={48} className="mx-auto mb-4 text-white/10" />
          <p className="text-white/20 text-lg">No alarms set. Click "Add Alarm" to get started.</p>
        </div>
      )}

      {/* Add Alarm Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-10 rounded-[40px] w-full max-w-md relative z-10"
            >
              <h2 className="text-3xl font-bold mb-8">New Alarm</h2>
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium text-white/40 mb-3 block">Time</label>
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-4xl font-bold text-center focus:border-violet-glow outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/40 mb-3 block">Label</label>
                  <input 
                    type="text" 
                    placeholder="Wake up, Workout, etc."
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-violet-glow outline-none transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-white/40 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAlarm}
                    className="flex-1 bg-violet-glow py-4 rounded-2xl font-bold shadow-lg shadow-violet-glow/20 hover:scale-105 transition-all"
                  >
                    Save Alarm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      <AnimatePresence>
        {activeAlarm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-violet-glow/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center relative z-10"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <Bell size={64} className="text-violet-glow" />
              </motion.div>
              <h2 className="text-8xl font-black mb-4 tracking-tighter">{activeAlarm.time}</h2>
              <p className="text-3xl font-bold mb-12 opacity-80">{activeAlarm.label}</p>
              <button
                onClick={() => setActiveAlarm(null)}
                className="bg-white text-violet-glow px-12 py-6 rounded-[32px] text-2xl font-black shadow-2xl hover:scale-110 transition-all"
              >
                DISMISS
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlarmClock;
