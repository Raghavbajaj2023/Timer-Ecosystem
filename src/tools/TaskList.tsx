import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { cn } from '../App';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('productivity-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('productivity-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now()
    };
    
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="w-full max-w-2xl space-y-8">
      <form onSubmit={addTask} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-8 pr-20 text-xl focus:outline-none focus:ring-2 focus:ring-indigo-glow/50 transition-all backdrop-blur-xl"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-indigo-glow text-white shadow-lg shadow-indigo-glow/20 hover:scale-105 transition-all"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3 text-white/40">
          <ListTodo size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">
            {tasks.length} Tasks • {completedCount} Completed
          </span>
        </div>
        {tasks.length > 0 && (
          <button
            onClick={() => setTasks(tasks.filter(t => !t.completed))}
            className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "group glass p-6 rounded-3xl border-white/5 flex items-center gap-4 transition-all",
                task.completed ? "opacity-40" : "hover:bg-white/10"
              )}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "transition-colors",
                  task.completed ? "text-emerald-400" : "text-white/20 hover:text-white"
                )}
              >
                {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </button>
              
              <span className={cn(
                "flex-1 text-lg font-medium transition-all",
                task.completed && "line-through"
              )}>
                {task.text}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 rounded-xl bg-white/0 hover:bg-red-400/10 text-white/0 group-hover:text-red-400 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-20 text-white/10">
            <ListTodo size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold">Your task list is empty</p>
            <p className="text-sm">Add a task above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
