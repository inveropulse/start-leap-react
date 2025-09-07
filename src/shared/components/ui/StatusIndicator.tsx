import { forwardRef, useEffect, useState } from "react";
import { CheckCircle, AlertCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'pending' | 'loading';
  label?: string;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ 
    status, 
    label, 
    animate = true, 
    size = 'md', 
    showIcon = true, 
    pulse = false,
    className 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(!animate);

    useEffect(() => {
      if (animate) {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
      }
    }, [animate]);

    const config = {
      success: {
        icon: CheckCircle,
        colors: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
      },
      warning: {
        icon: AlertCircle,
        colors: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotColor: 'bg-yellow-500',
      },
      error: {
        icon: XCircle,
        colors: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-500',
      },
      pending: {
        icon: Clock,
        colors: 'bg-blue-100 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-500',
      },
      loading: {
        icon: Loader2,
        colors: 'bg-gray-100 text-gray-800 border-gray-200',
        dotColor: 'bg-gray-500',
      },
    };

    const { icon: Icon, colors, dotColor } = config[status];

    const sizeClasses = {
      sm: {
        container: 'px-2 py-1 text-xs',
        icon: 'h-3 w-3',
        dot: 'h-2 w-2',
      },
      md: {
        container: 'px-3 py-1.5 text-sm',
        icon: 'h-4 w-4',
        dot: 'h-2.5 w-2.5',
      },
      lg: {
        container: 'px-4 py-2 text-base',
        icon: 'h-5 w-5',
        dot: 'h-3 w-3',
      },
    };

    const { container, icon, dot } = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border font-medium transition-all duration-200",
          colors,
          container,
          animate && !isVisible && "opacity-0 scale-90",
          animate && isVisible && "opacity-100 scale-100 animate-bounce-in",
          pulse && "animate-pulse-glow",
          className
        )}
      >
        {showIcon ? (
          <>
            {status === 'loading' ? (
              <Icon className={cn(icon, "animate-spin")} />
            ) : (
              <Icon className={icon} />
            )}
          </>
        ) : (
          <div
            className={cn(
              dot,
              dotColor,
              "rounded-full",
              pulse && "animate-pulse"
            )}
          />
        )}
        
        {label && (
          <span className="font-medium">
            {label}
          </span>
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";