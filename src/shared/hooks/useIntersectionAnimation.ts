import { useEffect, useRef, useState } from "react";

interface UseIntersectionAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useIntersectionAnimation({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  delay = 0,
}: UseIntersectionAnimationOptions = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasBeenVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasBeenVisible(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return {
    elementRef,
    isVisible: triggerOnce ? hasBeenVisible : isVisible,
    hasBeenVisible,
  };
}