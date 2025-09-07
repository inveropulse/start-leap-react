import { forwardRef, useState, useEffect } from "react";
import { cn } from "@/shared/utils/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    animated = true,
    showLabel = false,
    label,
    className,
  }, ref) => {
    const [displayValue, setDisplayValue] = useState(0);
    const percentage = Math.min((value / max) * 100, 100);

    useEffect(() => {
      if (animated) {
        const timer = setTimeout(() => {
          setDisplayValue(percentage);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setDisplayValue(percentage);
      }
    }, [percentage, animated]);

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-emerald-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    };

    const trackVariants = {
      default: 'bg-primary/20',
      success: 'bg-emerald-500/20',
      warning: 'bg-yellow-500/20',
      error: 'bg-red-500/20',
    };

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {showLabel && (
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {label || `${value}/${max}`}
            </span>
            <span className="font-medium">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        
        <div
          className={cn(
            "w-full rounded-full overflow-hidden",
            sizeClasses[size],
            trackVariants[variant]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              variantClasses[variant],
              animated && "animate-pulse"
            )}
            style={{
              width: `${displayValue}%`,
              transition: animated ? 'width 1s ease-out' : 'none',
            }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";