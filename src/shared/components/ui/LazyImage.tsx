import { useState, useRef, useEffect, forwardRef } from "react";
import { clsx } from "clsx";
import { useIntersectionAnimation } from "@/shared/hooks/useIntersectionAnimation";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  blurDataURL?: string;
  quality?: number;
  priority?: boolean;
  onLoadComplete?: () => void;
  fallback?: React.ReactNode;
}

export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  ({
    src,
    alt,
    placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xNSAxMi0zIDNMOSA5bDYgNloiIGZpbGw9IiM5Y2EzYWYiLz4KPC9zdmc+",
    blurDataURL,
    quality = 75,
    priority = false,
    onLoadComplete,
    fallback,
    className,
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);
    
    const { elementRef: intersectionRef, isVisible } = useIntersectionAnimation({
      threshold: 0.1,
      triggerOnce: true,
    });

    // Set refs
    const setRefs = (element: HTMLImageElement | null) => {
      imgRef.current = element;
      intersectionRef.current = element;
      if (ref) {
        if (typeof ref === 'function') {
          ref(element);
        } else {
          ref.current = element;
        }
      }
    };

    // Start loading when visible or priority
    useEffect(() => {
      if (priority || isVisible) {
        setShouldLoad(true);
      }
    }, [priority, isVisible]);

    const handleLoad = () => {
      setIsLoading(false);
      onLoadComplete?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    if (hasError && fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={clsx("relative overflow-hidden", className)}>
        {/* Placeholder */}
        {(isLoading || !shouldLoad) && (
          <img
            src={blurDataURL || placeholder}
            alt=""
            className={clsx(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isLoading || !shouldLoad ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          />
        )}
        
        {/* Main image */}
        {shouldLoad && (
          <img
            ref={setRefs}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={clsx(
              "w-full h-full object-cover transition-opacity duration-300",
              !isLoading && !hasError ? "opacity-100" : "opacity-0"
            )}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            {...props}
          />
        )}
        
        {/* Error state */}
        {hasError && !fallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-sm">Failed to load image</div>
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && shouldLoad && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }
);