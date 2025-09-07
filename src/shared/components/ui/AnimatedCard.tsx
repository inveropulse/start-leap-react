import { forwardRef, ReactNode, HTMLAttributes } from "react";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import { useIntersectionAnimation } from "@/shared/hooks/useIntersectionAnimation";

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animation?: 'fade' | 'slide-up' | 'scale' | 'lift';
  delay?: number;
  triggerOnce?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({
    children,
    animation = 'fade',
    delay = 0,
    triggerOnce = true,
    className,
    ...props
  }, ref) => {
    const { elementRef, isVisible } = useIntersectionAnimation({
      delay,
      triggerOnce,
    });

    const animationClasses = {
      fade: isVisible ? 'animate-fade-in' : 'opacity-0',
      'slide-up': isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8',
      scale: isVisible ? 'animate-scale-in' : 'opacity-0 scale-95',
      lift: isVisible ? 'animate-fade-in hover-lift' : 'opacity-0',
    };

    return (
      <Card
        ref={(node) => {
          if (elementRef) {
            elementRef.current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          'transition-all duration-300 ease-out',
          animationClasses[animation],
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";