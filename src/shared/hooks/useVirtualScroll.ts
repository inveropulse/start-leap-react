import { useCallback, useMemo, useState, useEffect } from "react";

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  totalItems: number;
}

interface VirtualScrollState {
  scrollTop: number;
  startIndex: number;
  endIndex: number;
  visibleItems: number;
  offsetY: number;
  totalHeight: number;
}

export function useVirtualScroll(options: UseVirtualScrollOptions): VirtualScrollState & {
  handleScroll: (event: React.UIEvent<HTMLElement>) => void;
} {
  const { itemHeight, containerHeight, overscan = 5, totalItems } = options;
  
  const [scrollTop, setScrollTop] = useState(0);

  const virtualState = useMemo(() => {
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2);
    const offsetY = startIndex * itemHeight;
    const totalHeight = totalItems * itemHeight;

    return {
      scrollTop,
      startIndex,
      endIndex,
      visibleItems,
      offsetY,
      totalHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, totalItems]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
  }, []);

  return {
    ...virtualState,
    handleScroll,
  };
}