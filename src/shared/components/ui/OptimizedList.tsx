import { forwardRef, useCallback, useMemo, useState } from "react";
import { clsx } from "clsx";
import { LoadingSpinner } from "./LoadingSpinner";
import { useVirtualScroll } from "@/shared/hooks/useVirtualScroll";

interface OptimizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  overscan?: number;
}

export function OptimizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  isLoading = false,
  loadingMessage = "Loading...",
  overscan = 5,
}: OptimizedListProps<T>) {
  const [enableVirtualization, setEnableVirtualization] = useState(items.length > 100);

  const virtualScroll = useVirtualScroll({
    itemHeight,
    containerHeight,
    overscan,
    totalItems: items.length,
  });

  if (isLoading && items.length === 0) {
    return (
      <div 
        className={clsx("flex items-center justify-center", className)}
        style={{ height: containerHeight }}
      >
        <div className="flex flex-col items-center gap-2">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div 
        className={clsx("flex items-center justify-center text-muted-foreground", className)}
        style={{ height: containerHeight }}
      >
        No items to display
      </div>
    );
  }

  const visibleItems = enableVirtualization 
    ? items.slice(virtualScroll.startIndex, virtualScroll.endIndex + 1)
    : items;

  return (
    <div className={clsx("relative", className)}>
      {items.length > 100 && (
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => setEnableVirtualization(!enableVirtualization)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Virtualization: {enableVirtualization ? "On" : "Off"}
          </button>
        </div>
      )}
      
      <div
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={enableVirtualization ? virtualScroll.handleScroll : undefined}
      >
        {enableVirtualization && (
          <div style={{ height: virtualScroll.totalHeight, position: "relative" }}>
            <div 
              style={{ 
                transform: `translateY(${virtualScroll.offsetY}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              {visibleItems.map((item, index) => {
                const actualIndex = enableVirtualization 
                  ? virtualScroll.startIndex + index 
                  : index;
                
                return renderItem(item, actualIndex, {
                  height: itemHeight,
                  display: "block",
                });
              })}
            </div>
          </div>
        )}
        
        {!enableVirtualization && (
          <div className="space-y-2">
            {visibleItems.map((item, index) => 
              renderItem(item, index, { display: "block" })
            )}
          </div>
        )}
      </div>
    </div>
  );
}