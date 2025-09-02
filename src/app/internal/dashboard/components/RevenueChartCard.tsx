import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { RevenueChartData } from '../types/dashboard.types';
import { formatCurrency } from '@/shared/utils/currency';
import { cn } from '@/shared/utils/cn';

interface RevenueChartCardProps {
  data: RevenueChartData;
  className?: string;
  style?: React.CSSProperties;
}

export const RevenueChartCard: React.FC<RevenueChartCardProps> = ({ data, className, style }) => {
  const maxValue = Math.max(...data.data.map(point => point.value));
  const changeIcon = data.changeType === 'positive' ? TrendingUp : TrendingDown;
  const ChangeIcon = changeIcon;

  return (
    <Card className={cn("col-span-full lg:col-span-2", className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue Over Time</CardTitle>
        <div className="flex items-center space-x-2">
          <span className={cn(
            "text-xs font-medium",
            data.changeType === 'positive' ? "text-emerald-600" : "text-rose-600"
          )}>
            {data.change > 0 ? '+' : ''}{data.change}%
          </span>
          <ChangeIcon className={cn(
            "h-4 w-4",
            data.changeType === 'positive' ? "text-emerald-600" : "text-rose-600"
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold">
              {formatCurrency(data.totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground">
              total revenue this year
            </p>
          </div>
          
          {/* Chart Container */}
          <div className="h-64 w-full border rounded-lg bg-card/30 p-4">
            <div className="h-full w-full flex items-end justify-between gap-2">
              {data.data.map((point, index) => {
                const height = Math.max((point.value / maxValue) * 100, 8); // Minimum 8% height
                const barHeight = `${height}%`;
                return (
                  <div key={`revenue-${point.month}-${index}`} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className="w-full h-full flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-primary/80 to-primary/60 rounded-t-md transition-all duration-300 hover:from-primary hover:to-primary/80 cursor-pointer group relative min-h-[8px] border border-primary/20"
                        style={{ height: barHeight }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border shadow-lg z-20">
                          {formatCurrency(point.value)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {point.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Showing monthly revenue data for the current year
          </div>
        </div>
      </CardContent>
    </Card>
  );
};