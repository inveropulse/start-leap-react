import { forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bounce';
  className?: string;
  color?: 'primary' | 'secondary' | 'muted';
}

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', variant = 'default', className, color = 'primary' }, ref) => {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const colorClasses = {
      primary: 'border-primary',
      secondary: 'border-secondary',
      muted: 'border-muted-foreground',
    };

    if (variant === 'dots') {
      const dotSize = {
        xs: 'w-1 h-1',
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
      };

      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center space-x-1", className)}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                dotSize[size],
                `bg-${color}`,
                "rounded-full animate-pulse"
              )}
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>
      );
    }

    if (variant === 'pulse') {
      return (
        <div
          ref={ref}
          className={cn(
            sizeClasses[size],
            `bg-${color}`,
            "rounded-full animate-pulse-glow",
            className
          )}
        />
      );
    }

    if (variant === 'bounce') {
      return (
        <div
          ref={ref}
          className={cn(
            sizeClasses[size],
            `bg-${color}`,
            "rounded-full animate-bounce",
            className
          )}
        />
      );
    }

    // Default spinner
    return (
      <div
        ref={ref}
        className={cn(
          sizeClasses[size],
          colorClasses[color],
          "border-2 border-t-transparent rounded-full animate-spin",
          className
        )}
      />
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";