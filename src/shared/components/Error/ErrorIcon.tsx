// src/shared/components/Error/ErrorIcon.tsx
import React from "react";
import { AlertTriangle, AlertCircle, Info, XCircle } from "lucide-react";

interface ErrorIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  severity?: "error" | "warning" | "info";
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

const severityIcons = {
  error: XCircle,
  warning: AlertTriangle, 
  info: Info,
};

const severityStyles = {
  error: "text-destructive",
  warning: "text-enterprise-secondary",
  info: "text-enterprise-accent",
};

export const ErrorIcon: React.FC<ErrorIconProps> = ({
  className,
  size = "md",
  severity = "error",
}) => {
  const IconComponent = severityIcons[severity];
  const baseClassName = `${sizeClasses[size]} ${severityStyles[severity]} drop-shadow-sm`;
  const finalClassName = className || baseClassName;

  return (
    <div className="relative">
      <IconComponent 
        className={finalClassName}
        aria-label={`${severity} icon`}
      />
      <div className={`absolute inset-0 ${severityStyles[severity]} opacity-20 blur-sm ${sizeClasses[size]} rounded-full`} />
    </div>
  );
};
