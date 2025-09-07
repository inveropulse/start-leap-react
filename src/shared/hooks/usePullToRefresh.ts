import { useEffect, useRef, useState, useCallback } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  disabled?: boolean;
  pullDistance?: number;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  disabled = false,
  pullDistance = 120,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullOffset, setPullOffset] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  
  const touchStart = useRef<{ y: number; time: number } | null>(null);
  const requestRef = useRef<number>();

  // Check if element can be pulled (at top of scroll)
  const checkCanPull = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    const scrollTop = container.scrollTop || window.pageYOffset;
    return scrollTop <= 5; // Allow small tolerance for scroll position
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      // Add a small delay to show the refresh animation
      setTimeout(() => {
        setIsRefreshing(false);
        setPullOffset(0);
        setIsPulling(false);
      }, 500);
    }
  }, [onRefresh, isRefreshing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!checkCanPull()) return;
      
      const touch = e.touches[0];
      touchStart.current = { 
        y: touch.clientY, 
        time: Date.now() 
      };
      setCanPull(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || !canPull || isRefreshing) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - touchStart.current.y;
      
      // Only allow downward pull
      if (deltaY > 0) {
        setIsPulling(true);
        
        // Apply elastic resistance
        const resistance = Math.max(0.3, 1 - (deltaY / pullDistance));
        const elasticDelta = deltaY * resistance;
        const clampedDelta = Math.min(elasticDelta, pullDistance);
        
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        
        requestRef.current = requestAnimationFrame(() => {
          setPullOffset(clampedDelta);
        });
        
        // Prevent scroll if pulling
        if (deltaY > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (!touchStart.current || !isPulling) return;

      const shouldRefresh = pullOffset >= threshold && !isRefreshing;
      
      if (shouldRefresh) {
        handleRefresh();
      } else {
        // Reset state
        setPullOffset(0);
        setIsPulling(false);
      }
      
      setCanPull(false);
      touchStart.current = null;
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };

    const handleScroll = () => {
      if (isPulling || isRefreshing) return;
      
      if (!checkCanPull() && canPull) {
        setCanPull(false);
        setPullOffset(0);
        setIsPulling(false);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("scroll", handleScroll);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [canPull, isPulling, isRefreshing, pullOffset, threshold, disabled, checkCanPull, handleRefresh]);

  const getRefreshProgress = () => {
    return Math.min(pullOffset / threshold, 1);
  };

  const shouldShowRefreshIndicator = () => {
    return isPulling || isRefreshing;
  };

  return {
    containerRef,
    pullOffset,
    isPulling,
    isRefreshing,
    getRefreshProgress,
    shouldShowRefreshIndicator,
  };
}