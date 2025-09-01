import { cn } from "@/shared/utils/cn";
import { MetricCard } from "./MetricCard";
import type { DashboardMetric } from "../types/dashboard.types";

interface MetricsGridProps {
  metrics: DashboardMetric[];
  className?: string;
}

export const MetricsGrid = ({ metrics, className }: MetricsGridProps) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6",
      className
    )}>
      {metrics.map((metric, index) => (
        <MetricCard 
          key={metric.id} 
          metric={metric}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
};