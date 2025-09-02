import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import { useAnimatedCounter } from "../hooks/useAnimatedCounter";
import type { DashboardMetric } from "../types/dashboard.types";
import { 
  Users, 
  Calendar, 
  Clock, 
  Building2, 
  DollarSign, 
  PoundSterling,
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

const iconMap = {
  Users,
  Calendar,
  Clock,
  Building2,
  DollarSign,
  PoundSterling,
  TrendingUp,
};

const colorVariants = {
  emerald: {
    card: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200",
    icon: "bg-emerald-500 text-white",
    text: "text-emerald-700",
    accent: "text-emerald-600"
  },
  cyan: {
    card: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:from-cyan-100 hover:to-cyan-200",
    icon: "bg-cyan-500 text-white", 
    text: "text-cyan-700",
    accent: "text-cyan-600"
  },
  amber: {
    card: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200",
    icon: "bg-amber-500 text-white",
    text: "text-amber-700", 
    accent: "text-amber-600"
  },
  violet: {
    card: "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:from-violet-100 hover:to-violet-200",
    icon: "bg-violet-500 text-white",
    text: "text-violet-700",
    accent: "text-violet-600"
  },
  rose: {
    card: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:from-rose-100 hover:to-rose-200",
    icon: "bg-rose-500 text-white",
    text: "text-rose-700",
    accent: "text-rose-600"
  },
  orange: {
    card: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200",
    icon: "bg-orange-500 text-white",
    text: "text-orange-700",
    accent: "text-orange-600"
  }
};

interface MetricCardProps {
  metric: DashboardMetric;
  className?: string;
  style?: React.CSSProperties;
}

export const MetricCard = ({ metric, className, style }: MetricCardProps) => {
  const animatedValue = useAnimatedCounter({ 
    end: metric.value, 
    duration: 1500,
    decimals: metric.unit === '%' ? 1 : 0
  });

  const IconComponent = iconMap[metric.icon as keyof typeof iconMap];
  const colors = colorVariants[metric.color];
  
  const formatValue = (value: number) => {
    if (metric.unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    if (metric.unit === '£') {
      return `£${value.toLocaleString()}`;
    }
    if (metric.unit === '%') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const renderChangeIndicator = () => {
    if (!metric.change) return null;

    const isPositive = metric.changeType === 'positive';
    const isNegative = metric.changeType === 'negative';
    
    const ChangeIcon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus;
    const changeColor = isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-gray-600';
    
    return (
      <div className={cn("flex items-center gap-1 text-sm font-medium", changeColor)}>
        <ChangeIcon className="h-3 w-3" />
        <span>{Math.abs(metric.change)}%</span>
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer",
        colors.card,
        className
      )}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn("text-sm font-medium", colors.accent)}>
              {metric.label}
            </p>
            <p className={cn("text-3xl font-bold tracking-tight", colors.text)}>
              {formatValue(animatedValue)}
            </p>
            {metric.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            )}
          </div>
          
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
            colors.icon
          )}>
            {IconComponent && <IconComponent className="h-6 w-6" />}
          </div>
        </div>
        
        {metric.change && (
          <div className="mt-4 flex items-center justify-between">
            {renderChangeIndicator()}
            <span className="text-xs text-muted-foreground">
              vs last period
            </span>
          </div>
        )}
        
        {/* Animated background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </CardContent>
    </Card>
  );
};