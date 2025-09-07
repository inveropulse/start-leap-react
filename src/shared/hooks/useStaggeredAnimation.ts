import { useEffect, useState, useRef } from "react";

interface UseStaggeredAnimationProps {
  itemCount: number;
  delay?: number;
  staggerDelay?: number;
  trigger?: boolean;
  once?: boolean;
}

export function useStaggeredAnimation({
  itemCount,
  delay = 0,
  staggerDelay = 50,
  trigger = true,
  once = true,
}: UseStaggeredAnimationProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!trigger || (once && hasTriggered.current)) return;

    hasTriggered.current = true;
    
    // Clear previous animations
    setVisibleItems(new Set());

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Start animation after initial delay
    const startTimeout = setTimeout(() => {
      // Animate items with staggered delay
      for (let i = 0; i < itemCount; i++) {
        const timeout = setTimeout(() => {
          setVisibleItems(prev => new Set(prev).add(i));
        }, i * staggerDelay);
        
        timeouts.push(timeout);
      }
    }, delay);

    timeouts.push(startTimeout);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [trigger, itemCount, delay, staggerDelay, once]);

  const getItemClassName = (index: number, baseClassName = '') => {
    const isVisible = visibleItems.has(index);
    return `${baseClassName} transition-all duration-300 ease-out ${
      isVisible 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-4 scale-95'
    }`;
  };

  const getItemStyle = (index: number) => ({
    transitionDelay: visibleItems.has(index) ? '0ms' : `${index * staggerDelay}ms`,
  });

  return {
    visibleItems,
    getItemClassName,
    getItemStyle,
    isComplete: visibleItems.size === itemCount,
  };
}