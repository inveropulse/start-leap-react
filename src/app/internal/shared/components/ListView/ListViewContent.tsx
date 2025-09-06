import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewContentProps } from "../../types/listView.types";

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

  // Loading State
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="h-48 rounded-lg" />
              </div>
            ))}
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

  // Content State
  return (
    <Card>
      <CardContent className="p-6">
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}