import { forwardRef, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { useSwipeActions } from "@/shared/hooks/useSwipeActions";

interface SwipeAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'primary' | 'secondary' | 'destructive' | 'success';
  onAction: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  disabled?: boolean;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export const SwipeableCard = forwardRef<HTMLDivElement, SwipeableCardProps>(
  ({
    children,
    leftActions = [],
    rightActions = [],
    className,
    disabled = false,
    onSwipeStart,
    onSwipeEnd,
  }, ref) => {
    const {
      containerRef,
      swipeOffset,
      isSwipeActive,
      activeAction,
      getActionColors,
    } = useSwipeActions({
      leftActions,
      rightActions,
      disabled,
      onSwipeStart,
      onSwipeEnd,
    });

    const renderActions = (actions: SwipeAction[], side: 'left' | 'right') => {
      if (actions.length === 0) return null;

      return (
        <div
          className={cn(
            "absolute top-0 bottom-0 flex items-center",
            side === 'left' ? "left-0" : "right-0"
          )}
          style={{
            width: Math.abs(swipeOffset),
          }}
        >
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isActive = activeAction?.id === action.id;
            
            return (
              <div
                key={action.id}
                className={cn(
                  "flex-1 h-full flex flex-col items-center justify-center transition-all duration-200",
                  getActionColors(action),
                  isActive ? "scale-110" : "scale-100"
                )}
                style={{
                  opacity: Math.min(Math.abs(swipeOffset) / 80, 1),
                }}
              >
                {Icon && <Icon className="h-5 w-5 mb-1" />}
                <span className="text-xs font-medium">{action.label}</span>
              </div>
            );
          })}
        </div>
      );
    };

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
        className={cn(
          "relative overflow-hidden touch-pan-y",
          className
        )}
      >
        {/* Left actions */}
        {swipeOffset > 0 && renderActions(leftActions, 'left')}
        
        {/* Right actions */}
        {swipeOffset < 0 && renderActions(rightActions, 'right')}
        
        {/* Main content */}
        <div
          className={cn(
            "relative transition-transform duration-200 ease-out",
            isSwipeActive ? "transition-none" : ""
          )}
          style={{
            transform: `translateX(${swipeOffset}px)`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

SwipeableCard.displayName = "SwipeableCard";