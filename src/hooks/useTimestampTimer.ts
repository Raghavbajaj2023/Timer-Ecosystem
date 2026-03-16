import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimestampTimer = (initialSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    endTimeRef.current = Date.now() + timeLeft * 1000;
    setIsRunning(true);
  }, [timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
    endTimeRef.current = null;
  }, []);

  const reset = useCallback((seconds: number) => {
    setIsRunning(false);
    endTimeRef.current = null;
    setTimeLeft(seconds);
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((endTimeRef.current! - now) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          setIsRunning(false);
          endTimeRef.current = null;
        }
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  return { timeLeft, isRunning, start, pause, reset, setTimeLeft };
};
