import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { usePerformanceMonitor } from "@/shared/hooks/usePerformanceMonitor";
import { Activity, Zap, MemoryStick, Timer } from "lucide-react";

interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export function PerformanceMonitor({ 
  className, 
  showDetails = false 
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { metrics } = usePerformanceMonitor({
    trackFPS: true,
    trackMemory: true,
    trackRenderTime: true,
  });

  // Show/hide with keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  if (!isVisible && !showDetails) return null;

  const getStatusColor = (isOptimal: boolean) => 
    isOptimal ? "default" : "destructive";

  const formatMemory = (usage: number) => `${usage}%`;
  const formatFPS = (fps: number) => Math.round(fps);
  const formatRenderTime = (time: number) => `${time.toFixed(1)}ms`;

  if (showDetails) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance Metrics
            <Badge variant={getStatusColor(metrics.isOptimal)}>
              {metrics.isOptimal ? "Optimal" : "Degraded"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-3 h-3" />
              FPS
            </div>
            <Badge variant={metrics.fps >= 55 ? "default" : "destructive"}>
              {formatFPS(metrics.fps)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <MemoryStick className="w-3 h-3" />
              Memory
            </div>
            <Badge variant={metrics.memoryUsage < 70 ? "default" : "destructive"}>
              {formatMemory(metrics.memoryUsage)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Timer className="w-3 h-3" />
              Render Time
            </div>
            <Badge variant={metrics.renderTime < 16.67 ? "default" : "destructive"}>
              {formatRenderTime(metrics.renderTime)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="min-w-[200px] shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">Performance</span>
            <Badge variant={getStatusColor(metrics.isOptimal)} className="text-xs">
              {metrics.isOptimal ? "Good" : "Poor"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-muted-foreground">FPS</div>
              <div className="font-medium">{formatFPS(metrics.fps)}</div>
            </div>
            
            <div className="text-center">
              <div className="text-muted-foreground">Memory</div>
              <div className="font-medium">{formatMemory(metrics.memoryUsage)}</div>
            </div>
            
            <div className="text-center">
              <div className="text-muted-foreground">Render</div>
              <div className="font-medium">{formatRenderTime(metrics.renderTime)}</div>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Ctrl+Shift+P to toggle
          </div>
        </CardContent>
      </Card>
    </div>
  );
}