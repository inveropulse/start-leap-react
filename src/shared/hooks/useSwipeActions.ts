import { useEffect, useRef, useState } from "react";

interface SwipeAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'primary' | 'secondary' | 'destructive' | 'success';
  onAction: () => void;
}

interface SwipeActionsProps {
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
  disabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export function useSwipeActions({
  leftActions = [],
  rightActions = [],
  threshold = 80,
  disabled = false,
  onSwipeStart,
  onSwipeEnd,
}: SwipeActionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [activeAction, setActiveAction] = useState<SwipeAction | null>(null);
  
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { 
        x: touch.clientX, 
        y: touch.clientY, 
        time: Date.now() 
      };
      setIsSwipeActive(true);
      onSwipeStart?.();
      
      // Add haptic feedback on touch devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || !isSwipeActive) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);
      
      // Only allow horizontal swipes
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
        e.preventDefault();
        
        // Limit swipe distance
        const maxSwipe = threshold * 2;
        const clampedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
        
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        
        requestRef.current = requestAnimationFrame(() => {
          setSwipeOffset(clampedDelta);
          
          // Determine active action
          if (Math.abs(clampedDelta) > threshold) {
            const actions = clampedDelta > 0 ? leftActions : rightActions;
            const actionIndex = Math.min(
              Math.floor(Math.abs(clampedDelta) / threshold) - 1,
              actions.length - 1
            );
            setActiveAction(actions[actionIndex] || null);
          } else {
            setActiveAction(null);
          }
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current || !isSwipeActive) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const swipeTime = Date.now() - touchStart.current.time;
      const swipeVelocity = Math.abs(deltaX) / swipeTime;
      
      // Trigger action if threshold met or fast swipe
      if (Math.abs(deltaX) > threshold || swipeVelocity > 0.5) {
        if (activeAction) {
          // Haptic feedback for action
          if ('vibrate' in navigator) {
            navigator.vibrate(50);
          }
          activeAction.onAction();
        }
      }
      
      // Reset state
      setSwipeOffset(0);
      setIsSwipeActive(false);
      setActiveAction(null);
      touchStart.current = null;
      onSwipeEnd?.();
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [leftActions, rightActions, threshold, disabled, isSwipeActive, activeAction, onSwipeStart, onSwipeEnd]);

  const getActionColors = (action: SwipeAction) => {
    switch (action.color) {
      case 'destructive':
        return 'bg-destructive text-destructive-foreground';
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return {
    containerRef,
    swipeOffset,
    isSwipeActive,
    activeAction,
    leftActions,
    rightActions,
    getActionColors,
  };
}