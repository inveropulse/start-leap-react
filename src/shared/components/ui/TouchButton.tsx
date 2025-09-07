import { forwardRef, ButtonHTMLAttributes } from "react";
import { Button, ButtonProps } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

interface TouchButtonProps extends ButtonProps {
  haptic?: boolean;
  touchScale?: boolean;
}

export const TouchButton = forwardRef<
  HTMLButtonElement,
  TouchButtonProps
>(({ 
  className, 
  haptic = true, 
  touchScale = true, 
  onClick,
  children,
  ...props 
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add haptic feedback on touch devices
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    onClick?.(e);
  };

  return (
    <Button
      ref={ref}
      className={cn(
        // Enhanced touch targets for mobile
        "min-h-[44px] min-w-[44px]",
        // Touch-friendly active state
        "active:scale-95 transition-transform duration-100",
        // Better touch feedback
        touchScale && "hover:scale-105 active:scale-95",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
});

TouchButton.displayName = "TouchButton";