import { useEffect, useRef } from "react";

interface SwipeGesturesProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeGesturesProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > threshold && deltaY < threshold * 2) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      touchStart.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scrolling behavior during swipe
      if (touchStart.current) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStart.current.x);
        const deltaY = Math.abs(touch.clientY - touchStart.current.y);
        
        // If horizontal movement is more than vertical, prevent default
        if (deltaX > deltaY) {
          e.preventDefault();
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return containerRef;
}