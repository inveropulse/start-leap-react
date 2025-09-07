import { Children, ReactElement, cloneElement, useEffect, useState, useRef } from "react";
import { cn } from "@/shared/utils/cn";

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'scale' | 'slide-up' | 'stagger';
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  once?: boolean;
}

export function AnimatedList({
  children,
  className,
  animation = 'stagger',
  delay = 0,
  duration = 300,
  staggerDelay = 50,
  once = true,
}: AnimatedListProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated.current)) {
          setTimeout(() => {
            setIsVisible(true);
            hasAnimated.current = true;
          }, delay);
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [delay, once]);

  const getAnimationClass = (index: number) => {
    if (!isVisible) return 'opacity-0';
    
    const baseClasses = 'opacity-100 transition-all ease-out';
    const timing = `duration-${duration}`;
    const staggerDelay = index * 50;
    
    switch (animation) {
      case 'fade':
        return cn(baseClasses, timing, 'animate-fade-in');
      case 'scale':
        return cn(baseClasses, timing, 'animate-scale-in');
      case 'slide-up':
        return cn(baseClasses, timing, 'animate-slide-up');
      case 'stagger':
      default:
        return cn(baseClasses, timing, 'animate-stagger-fade');
    }
  };

  return (
    <div ref={containerRef} className={className}>
      {Children.map(children, (child, index) => {
        if (!child || typeof child !== 'object') return child;
        
        return cloneElement(child as ReactElement, {
          className: cn(
            (child as ReactElement).props?.className,
            getAnimationClass(index)
          ),
          style: {
            ...(child as ReactElement).props?.style,
            animationDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
          },
        });
      })}
    </div>
  );
}