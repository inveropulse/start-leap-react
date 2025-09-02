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
          <div className="h-64 w-full bg-card/30 p-4">
            <div className="h-full w-full relative">
              {/* SVG Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.8" />
                    <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.6" />
                    <stop offset="30%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.4" />
                    <stop offset="70%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.2" />
                    <stop offset="100%" className="[stop-color:hsl(var(--primary))]" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                {/* Area under the line */}
                <path
                  d={`M ${data.data.map((point, index) => {
                    const x = (index / (data.data.length - 1)) * 100;
                    const y = 100 - ((point.value / maxValue) * 80 + 10);
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')} L 100 100 L 0 100 Z`}
                  fill="url(#areaGradient)"
                  className="animate-fade-in"
                />
                
                {/* Main line */}
                <path
                  d={data.data.map((point, index) => {
                    const x = (index / (data.data.length - 1)) * 100;
                    const y = 100 - ((point.value / maxValue) * 80 + 10);
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-fade-in"
                  style={{
                    filter: 'drop-shadow(0 2px 4px hsl(var(--primary) / 0.1))'
                  }}
                />
              </svg>
              
              {/* Interactive Data Points */}
              <div className="absolute inset-0 flex items-stretch">
                {data.data.map((point, index) => {
                  const x = (index / (data.data.length - 1)) * 100;
                  const y = 100 - ((point.value / maxValue) * 80 + 10);
                  return (
                    <div
                      key={`point-${point.month}-${index}`}
                      className="absolute group cursor-pointer"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {/* Data Point Marker */}
                      <div className="w-3 h-3 bg-primary border-2 border-background rounded-full shadow-sm transition-all duration-200 hover:scale-125 hover:shadow-md hover:bg-primary/90">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border shadow-lg z-20">
                        <div className="text-center">
                          <div className="font-semibold">{formatCurrency(point.value)}</div>
                          <div className="text-muted-foreground">{point.month}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Month Labels */}
            <div className="flex justify-between items-center mt-4 px-2">
              {data.data.map((point, index) => (
                <span key={`label-${point.month}-${index}`} className="text-xs text-muted-foreground font-medium">
                  {point.month}
                </span>
              ))}
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