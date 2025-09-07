import { useCallback, useEffect, useRef, useState } from "react";

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fps: number;
  isOptimal: boolean;
}

interface UsePerformanceMonitorOptions {
  trackFPS?: boolean;
  trackMemory?: boolean;
  trackRenderTime?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const {
    trackFPS = true,
    trackMemory = true,
    trackRenderTime = true,
    onMetricsUpdate,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    isOptimal: true,
  });

  const renderStartTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const fpsHistory = useRef<number[]>([]);

  // Track render time
  const startRender = useCallback(() => {
    if (trackRenderTime) {
      renderStartTime.current = performance.now();
    }
  }, [trackRenderTime]);

  const endRender = useCallback(() => {
    if (trackRenderTime && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({
        ...prev,
        renderTime,
        isOptimal: renderTime < 16.67, // 60fps threshold
      }));
    }
  }, [trackRenderTime]);

  // Track FPS
  useEffect(() => {
    if (!trackFPS) return;

    let animationId: number;
    
    const measureFPS = (currentTime: number) => {
      frameCount.current++;
      
      if (lastTime.current === 0) {
        lastTime.current = currentTime;
      }
      
      const delta = currentTime - lastTime.current;
      
      if (delta >= 1000) { // Update every second
        const fps = Math.round((frameCount.current * 1000) / delta);
        
        fpsHistory.current.push(fps);
        if (fpsHistory.current.length > 10) {
          fpsHistory.current.shift();
        }
        
        const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
        
        setMetrics(prev => ({
          ...prev,
          fps: avgFPS,
          isOptimal: prev.isOptimal && avgFPS >= 55, // Consider 55+ FPS as optimal
        }));
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [trackFPS]);

  // Track memory usage
  useEffect(() => {
    if (!trackMemory || !(performance as any).memory) return;

    const interval = setInterval(() => {
      const memory = (performance as any).memory;
      const memoryUsage = Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100);
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage,
        isOptimal: prev.isOptimal && memoryUsage < 70, // Consider <70% memory as optimal
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [trackMemory]);

  // Notify when metrics update
  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  return {
    metrics,
    startRender,
    endRender,
  };
}