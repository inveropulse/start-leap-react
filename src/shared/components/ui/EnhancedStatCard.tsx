import { forwardRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { TrendIndicator } from "./TrendIndicator";
import { MiniChart } from "./MiniChart";
import { ProgressBar } from "./ProgressBar";
import { LoadingSpinner } from "./LoadingSpinner";
import { useAnimatedCounter } from "@/app/internal/dashboard/hooks/useAnimatedCounter";
import { cn } from "@/shared/utils/cn";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface StatCardProps {
  id: string;
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'default' | 'success' | 'warning' | 'primary' | 'info';
  description?: string;
  trend?: {
    value: number;
    type: 'percentage' | 'value';
  };
  progress?: {
    current: number;
    target: number;
    label?: string;
  };
  chart?: {
    data: Array<{ value: number; label?: string }>;
    type?: 'line' | 'bar' | 'area';
  };
  tooltip?: string;
  animated?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const EnhancedStatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({
    id,
    label,
    value,
    icon: Icon,
    color = 'default',
    description,
    trend,
    progress,
    chart,
    tooltip,
    animated = true,
    isLoading = false,
    onClick,
    className,
  }, ref) => {
    const [isVisible, setIsVisible] = useState(!animated);
    
    const animatedValue = useAnimatedCounter({
      end: typeof value === 'number' ? value : 0,
      duration: animated ? 1200 : 0,
    });

    useEffect(() => {
      if (animated) {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
      }
    }, [animated]);

    const colorVariants = {
      default: {
        card: 'bg-card hover:bg-card/80 border-border',
        icon: 'bg-muted text-muted-foreground',
        text: 'text-foreground',
        accent: 'text-muted-foreground',
      },
      success: {
        card: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200/50 hover:border-emerald-200',
        icon: 'bg-emerald-500 text-white',
        text: 'text-emerald-700',
        accent: 'text-emerald-600',
      },
      warning: {
        card: 'bg-yellow-50/50 hover:bg-yellow-50 border-yellow-200/50 hover:border-yellow-200',
        icon: 'bg-yellow-500 text-white',
        text: 'text-yellow-700',
        accent: 'text-yellow-600',
      },
      primary: {
        card: 'bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30',
        icon: 'bg-primary text-primary-foreground',
        text: 'text-primary',
        accent: 'text-primary/80',
      },
      info: {
        card: 'bg-blue-50/50 hover:bg-blue-50 border-blue-200/50 hover:border-blue-200',
        icon: 'bg-blue-500 text-white',
        text: 'text-blue-700',
        accent: 'text-blue-600',
      },
    };

    const colors = colorVariants[color];

    const cardContent = (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-300 group",
          colors.card,
          onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5",
          animated && !isVisible && "opacity-0 translate-y-4 scale-95",
          animated && isVisible && "opacity-100 translate-y-0 scale-100 animate-fade-in",
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium", colors.accent)}>
              {label}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {trend && (
              <TrendIndicator
                value={trend.value}
                type={trend.type}
                variant="minimal"
                size="sm"
              />
            )}
            
            {Icon && (
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                colors.icon
              )}>
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <div className={cn("text-2xl font-bold", colors.text)}>
              {typeof value === 'number' ? animatedValue.toLocaleString() : value}
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
          
          {progress && (
            <div className="space-y-1">
              <ProgressBar
                value={progress.current}
                max={progress.target}
                variant={color === 'success' ? 'success' : color === 'warning' ? 'warning' : 'default'}
                size="sm"
                showLabel
                label={progress.label}
                animated={animated}
              />
            </div>
          )}
          
          {chart && chart.data.length > 0 && (
            <div className="pt-2">
              <MiniChart
                data={chart.data}
                type={chart.type}
                height={32}
                width={120}
                color={color === 'primary' ? 'hsl(var(--primary))' : 
                       color === 'success' ? 'rgb(34, 197, 94)' :
                       color === 'warning' ? 'rgb(234, 179, 8)' :
                       'hsl(var(--muted-foreground))'}
                gradient
                animated={animated}
              />
            </div>
          )}
        </CardContent>
        
        {/* Animated background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </Card>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {cardContent}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return cardContent;
  }
);

EnhancedStatCard.displayName = "EnhancedStatCard";