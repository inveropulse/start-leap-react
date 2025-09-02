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
          <div className="h-64 w-full">
            <div className="flex h-full items-end justify-between space-x-1">
              {data.data.map((point, index) => {
                const height = (point.value / maxValue) * 100;
                return (
                  <div key={point.month} className="flex flex-col items-center space-y-1 flex-1">
                    <div 
                      className="w-full bg-gradient-to-t from-rose-400 to-rose-300 rounded-t-sm transition-all duration-500 hover:from-rose-500 hover:to-rose-400 cursor-pointer group relative"
                      style={{ height: `${height}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border shadow-md z-10">
                        {formatCurrency(point.value)}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
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