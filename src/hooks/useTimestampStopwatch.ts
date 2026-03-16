import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimestampStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    startTimeRef.current = Date.now() - time;
    setIsRunning(true);
  }, [time]);

  const pause = useCallback(() => {
    setIsRunning(false);
    startTimeRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    startTimeRef.current = null;
    setTime(0);
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setTime(now - startTimeRef.current!);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  return { time, isRunning, start, pause, reset };
};
