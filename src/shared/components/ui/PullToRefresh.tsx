import { forwardRef, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { usePullToRefresh } from "@/shared/hooks/usePullToRefresh";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  className?: string;
  disabled?: boolean;
  threshold?: number;
  pullDistance?: number;
}

export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(
  ({
    children,
    onRefresh,
    className,
    disabled = false,
    threshold = 80,
    pullDistance = 120,
  }, ref) => {
    const {
      containerRef,
      pullOffset,
      isPulling,
      isRefreshing,
      getRefreshProgress,
      shouldShowRefreshIndicator,
    } = usePullToRefresh({
      onRefresh,
      threshold,
      disabled,
      pullDistance,
    });

    const progress = getRefreshProgress();
    const shouldTrigger = progress >= 1;

    return (
      <div
        ref={(node) => {
          if (containerRef) {
            containerRef.current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn("relative overflow-auto", className)}
      >
        {/* Pull indicator */}
        {shouldShowRefreshIndicator() && (
          <div
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-200"
            style={{
              height: Math.max(pullOffset, isRefreshing ? 60 : 0),
              transform: `translateY(${isRefreshing ? 0 : -20}px)`,
            }}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <RefreshCw
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isRefreshing ? "animate-spin" : "",
                  shouldTrigger ? "text-primary" : "text-muted-foreground"
                )}
                style={{
                  transform: `rotate(${progress * 180}deg)`,
                }}
              />
              <span className="text-xs font-medium">
                {isRefreshing 
                  ? "Refreshing..." 
                  : shouldTrigger 
                    ? "Release to refresh" 
                    : "Pull to refresh"
                }
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className="transition-transform duration-200"
          style={{
            transform: `translateY(${isPulling && !isRefreshing ? pullOffset : isRefreshing ? 60 : 0}px)`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

PullToRefresh.displayName = "PullToRefresh";