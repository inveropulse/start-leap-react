import { useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  enabled?: boolean;
}

export function useInfiniteScroll({
  threshold = 0.1,
  rootMargin = "100px",
  onLoadMore,
  hasNextPage,
  isLoading,
  enabled = true,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isLoading &&
        enabled
      ) {
        onLoadMore();
      }
    },
    [hasNextPage, isLoading, onLoadMore, enabled]
  );

  useEffect(() => {
    const trigger = triggerRef.current;
    
    if (!trigger || !enabled) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(trigger);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const setTriggerRef = useCallback((node: HTMLDivElement | null) => {
    if (triggerRef.current && observerRef.current) {
      observerRef.current.unobserve(triggerRef.current);
    }
    
    triggerRef.current = node;
    
    if (node && observerRef.current && enabled) {
      observerRef.current.observe(node);
    }
  }, [enabled]);

  return { triggerRef: setTriggerRef };
}