import { forwardRef } from "react";
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface TrendIndicatorProps {
  value: number;
  type?: 'percentage' | 'value';
  variant?: 'arrow' | 'trend' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const TrendIndicator = forwardRef<HTMLDivElement, TrendIndicatorProps>(
  ({
    value,
    type = 'percentage',
    variant = 'arrow',
    size = 'md',
    showValue = true,
    className,
  }, ref) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const isNeutral = value === 0;

    const getIcon = () => {
      if (variant === 'trend') {
        if (isPositive) return TrendingUp;
        if (isNegative) return TrendingDown;
        return Minus;
      }
      
      if (variant === 'arrow') {
        if (isPositive) return ArrowUp;
        if (isNegative) return ArrowDown;
        return Minus;
      }
      
      return null;
    };

    const Icon = getIcon();

    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const colorClasses = isPositive
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : isNegative
      ? 'text-red-600 bg-red-50 border-red-200'
      : 'text-gray-600 bg-gray-50 border-gray-200';

    const formatValue = () => {
      const absValue = Math.abs(value);
      if (type === 'percentage') {
        return `${absValue}%`;
      }
      return absValue.toLocaleString();
    };

    if (variant === 'minimal') {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1 font-medium",
            sizeClasses[size],
            isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-gray-600',
            className
          )}
        >
          {Icon && <Icon className={iconSizes[size]} />}
          {showValue && <span>{formatValue()}</span>}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border font-medium",
          sizeClasses[size],
          colorClasses,
          className
        )}
      >
        {Icon && <Icon className={iconSizes[size]} />}
        {showValue && <span>{formatValue()}</span>}
      </div>
    );
  }
);

TrendIndicator.displayName = "TrendIndicator";