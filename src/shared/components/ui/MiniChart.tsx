import { forwardRef, useMemo } from "react";
import { cn } from "@/shared/utils/cn";

interface DataPoint {
  value: number;
  label?: string;
}

interface MiniChartProps {
  data: DataPoint[];
  type?: 'line' | 'bar' | 'area';
  height?: number;
  width?: number;
  color?: string;
  gradient?: boolean;
  animated?: boolean;
  className?: string;
}

export const MiniChart = forwardRef<SVGSVGElement, MiniChartProps>(
  ({
    data,
    type = 'line',
    height = 40,
    width = 120,
    color = 'hsl(var(--primary))',
    gradient = false,
    animated = true,
    className,
  }, ref) => {
    const { points, maxValue, minValue } = useMemo(() => {
      if (!data || data.length === 0) {
        return { points: [], maxValue: 0, minValue: 0 };
      }

      const values = data.map(d => d.value);
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      const stepX = width / (data.length - 1 || 1);
      const valueRange = max - min || 1;
      
      const chartPoints = data.map((d, i) => ({
        x: i * stepX,
        y: height - ((d.value - min) / valueRange) * height,
        value: d.value,
        label: d.label,
      }));

      return {
        points: chartPoints,
        maxValue: max,
        minValue: min,
      };
    }, [data, width, height]);

    if (!points.length) {
      return (
        <div 
          className={cn("flex items-center justify-center bg-muted/30 rounded", className)}
          style={{ width, height }}
        >
          <span className="text-xs text-muted-foreground">No data</span>
        </div>
      );
    }

    const renderLine = () => {
      const pathData = points
        .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');

      return (
        <g>
          {gradient && (
            <defs>
              <linearGradient id="miniChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
          )}
          
          {gradient && (
            <path
              d={`${pathData} L ${width} ${height} L 0 ${height} Z`}
              fill="url(#miniChartGradient)"
              className={animated ? "animate-fade-in" : ""}
            />
          )}
          
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? "animate-fade-in" : ""}
            style={{
              strokeDasharray: animated ? '500' : undefined,
              strokeDashoffset: animated ? '500' : undefined,
              animation: animated ? 'dash 1.5s ease-out forwards' : undefined,
            }}
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={color}
              className={animated ? "animate-scale-in" : ""}
              style={{
                animationDelay: animated ? `${i * 100}ms` : undefined,
              }}
            />
          ))}
        </g>
      );
    };

    const renderBars = () => {
      const barWidth = Math.max(2, (width / points.length) - 2);
      
      return (
        <g>
          {points.map((point, i) => {
            const barHeight = Math.max(2, height - point.y);
            return (
              <rect
                key={i}
                x={point.x - barWidth / 2}
                y={point.y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="1"
                className={animated ? "animate-slide-up" : ""}
                style={{
                  animationDelay: animated ? `${i * 50}ms` : undefined,
                }}
              />
            );
          })}
        </g>
      );
    };

    return (
      <div className={cn("relative", className)}>
        <svg
          ref={ref}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {type === 'line' || type === 'area' ? renderLine() : renderBars()}
        </svg>
      </div>
    );
  }
);

MiniChart.displayName = "MiniChart";