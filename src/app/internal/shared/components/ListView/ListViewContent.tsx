import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PullToRefresh } from "@/shared/components/ui/PullToRefresh";
import { AnimatedList } from "@/shared/components/ui/AnimatedList";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewContentProps } from "@/shared/types/ui/listView.types";

export function ListViewContent({
  viewMode,
  isLoading,
  error,
  isEmpty,
  emptyMessage = "No items found",
  emptyAction,
  onRetry,
  loadingSkeletonCount = 6,
  children
}: ListViewContentProps) {
  const theme = useListViewTheme();
  const isMobile = useIsMobile();

  // Enhanced Loading State with staggered animation
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" variant="dots" />
            <p className="text-muted-foreground mt-4 animate-pulse">
              Loading items...
            </p>
          </div>
          
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
              : "space-y-4 mt-6"
          }>
            <AnimatedList animation="stagger" staggerDelay={100}>
              {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
                <div key={i} className="loading-skeleton">
                  <Skeleton 
                    className="h-48 rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" 
                    style={{
                      backgroundSize: '200px 100%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              ))}
            </AnimatedList>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            {onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline"
                className={theme.buttonSecondaryClass}
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (isEmpty) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="mb-4">{emptyMessage}</p>
              {emptyAction && (
                <Button 
                  onClick={emptyAction.onClick}
                  className={theme.buttonPrimaryClass}
                >
                  {emptyAction.label}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Enhanced Content State with animations
  const contentComponent = (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <AnimatedList 
          animation="stagger" 
          staggerDelay={50}
          className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {children}
        </AnimatedList>
      </CardContent>
    </Card>
  );

  // Wrap with pull-to-refresh on mobile
  if (isMobile && onRetry) {
    return (
      <PullToRefresh 
        onRefresh={async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          onRetry();
        }}
        className="min-h-[200px]"
      >
        {contentComponent}
      </PullToRefresh>
    );
  }

  return contentComponent;
}