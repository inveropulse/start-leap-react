import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PullToRefresh } from "@/shared/components/ui/PullToRefresh";
import { AnimatedList } from "@/shared/components/ui/AnimatedList";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewContentProps } from "@/shared/types/ui/listView.types";
import { RefreshCw, Plus } from "lucide-react";

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

  // Enhanced Error State with actionable guidance
  if (error) {
    return (
      <EmptyState
        icon="settings"
        title="Something went wrong"
        description={error}
        actions={[
          ...(onRetry ? [{
            label: "Try Again",
            onClick: onRetry,
            variant: 'default' as const,
            icon: RefreshCw,
          }] : []),
        ]}
        suggestions={[
          "Check your internet connection",
          "Refresh the page",
          "Contact support if the issue persists"
        ]}
        animated={true}
      />
    );
  }

  // Enhanced Empty State with context-aware suggestions
  if (isEmpty) {
    const getEmptyStateConfig = () => {
      // Try to infer context from empty message
      if (emptyMessage.toLowerCase().includes('patient')) {
        return {
          icon: 'users' as const,
          title: "No patients found",
          description: emptyMessage,
          suggestions: [
            "Add your first patient to get started",
            "Check your search filters",
            "Import patients from another system"
          ]
        };
      }
      
      if (emptyMessage.toLowerCase().includes('clinic')) {
        return {
          icon: 'building' as const,
          title: "No clinics found",
          description: emptyMessage,
          suggestions: [
            "Add a new clinic to your network",
            "Verify your search criteria",
            "Contact admin to add clinics"
          ]
        };
      }

      if (emptyMessage.toLowerCase().includes('appointment')) {
        return {
          icon: 'calendar' as const,
          title: "No appointments found",
          description: emptyMessage,
          suggestions: [
            "Schedule your first appointment",
            "Check date range filters",
            "Review appointment status filters"
          ]
        };
      }

      return {
        icon: 'search' as const,
        title: "No items found",
        description: emptyMessage,
        suggestions: [
          "Try adjusting your search terms",
          "Clear any active filters",
          "Add new items to get started"
        ]
      };
    };

    const config = getEmptyStateConfig();

    return (
      <EmptyState
        {...config}
        actions={[
          ...(emptyAction ? [{
            label: emptyAction.label,
            onClick: emptyAction.onClick,
            variant: 'default' as const,
            icon: Plus,
          }] : []),
        ]}
        animated={true}
      />
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