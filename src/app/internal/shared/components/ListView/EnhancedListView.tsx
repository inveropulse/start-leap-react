import { useState, useMemo, useCallback } from "react";
import { OptimizedList } from "@/shared/components/ui/OptimizedList";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { usePerformanceMonitor } from "@/shared/hooks/usePerformanceMonitor";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Settings, Zap } from "lucide-react";
import { clsx } from "clsx";

interface EnhancedListViewProps<T> {
  items: T[];
  renderItem: (item: T, index: number, style?: React.CSSProperties) => React.ReactNode;
  itemHeight: number;
  className?: string;
  isLoading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  virtualizationThreshold?: number;
  enableInfiniteScroll?: boolean;
  enablePerformanceMode?: boolean;
}

export function EnhancedListView<T extends { id: string | number }>({
  items,
  renderItem,
  itemHeight,
  className,
  isLoading = false,
  hasNextPage = false,
  onLoadMore,
  virtualizationThreshold = 100,
  enableInfiniteScroll = false,
  enablePerformanceMode = false,
}: EnhancedListViewProps<T>) {
  const [useVirtualization, setUseVirtualization] = useState(
    enablePerformanceMode || items.length > virtualizationThreshold
  );
  const [showSettings, setShowSettings] = useState(false);
  
  const { metrics, startRender, endRender } = usePerformanceMonitor({
    trackFPS: true,
    trackMemory: true,
    trackRenderTime: true,
  });

  const { triggerRef } = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasNextPage,
    isLoading,
    enabled: enableInfiniteScroll && !useVirtualization,
  });

  const memoizedRenderItem = useCallback(
    (item: T, index: number, style?: React.CSSProperties) => {
      startRender();
      const result = renderItem(item, index, style);
      endRender();
      return result;
    },
    [renderItem, startRender, endRender]
  );

  const shouldUseVirtualization = useMemo(() => {
    return useVirtualization && items.length > 50;
  }, [useVirtualization, items.length]);

  if (isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={clsx("relative", className)}>
      {/* Performance Controls */}
      {items.length > virtualizationThreshold && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{items.length} items</span>
              {metrics.fps < 55 && (
                <div className="flex items-center gap-1 text-warning">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs">Performance degraded</span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Options
          </Button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Card className="mb-4 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Virtualization</span>
              <Button
                variant={useVirtualization ? "default" : "outline"}
                size="sm"
                onClick={() => setUseVirtualization(!useVirtualization)}
              >
                {useVirtualization ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div>FPS: {Math.round(metrics.fps)}</div>
              <div>Memory: {metrics.memoryUsage}%</div>
              <div>Render Time: {metrics.renderTime.toFixed(1)}ms</div>
            </div>
          </div>
        </Card>
      )}

      {/* List Content */}
      {shouldUseVirtualization ? (
        <OptimizedList
          items={items}
          itemHeight={itemHeight}
          containerHeight={600}
          renderItem={memoizedRenderItem}
          className="border rounded-lg"
          overscan={5}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id}>
              {memoizedRenderItem(item, index)}
            </div>
          ))}
          
          {/* Infinite Scroll Trigger */}
          {enableInfiniteScroll && hasNextPage && (
            <div ref={triggerRef} className="flex justify-center py-4">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Scroll to load more...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}