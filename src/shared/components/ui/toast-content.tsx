import * as React from "react";
import { cn } from "@/shared/utils/cn";

interface ToastContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ToastContent = React.forwardRef<
  HTMLDivElement,
  ToastContentProps
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 min-w-0", className)}
    {...props}
  >
    {children}
  </div>
));

ToastContent.displayName = "ToastContent";