import { useState, useEffect } from 'react';

interface UseAnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
}

export const useAnimatedCounter = ({ 
  end, 
  start = 0, 
  duration = 2000,
  decimals = 0 
}: UseAnimatedCounterProps) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (start === end) return;

    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Ease out animation curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = start + (end - start) * easeOut;
      
      setCount(Number(currentCount.toFixed(decimals)));
      
      if (progress === 1) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  }, [end, start, duration, decimals]);

  return count;
};