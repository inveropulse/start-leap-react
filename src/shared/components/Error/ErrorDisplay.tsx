// src/shared/components/Error/ErrorDisplay.tsx
import React from "react";
import { ErrorIcon } from "./ErrorIcon";
import { ErrorMessage } from "./ErrorMessage";
import { ErrorActions } from "./ErrorActions";
import { ErrorDetails } from "./ErrorDetails";

interface ErrorDisplayProps {
  error?: Error;
  errorInfo?: any;
  errorId?: string;
  timestamp?: string;
  title?: string;
  message?: string;
  severity?: "error" | "warning" | "info";
  onReload?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
  showReload?: boolean;
  showBack?: boolean;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorInfo,
  errorId,
  timestamp,
  title,
  message,
  severity = "error",
  onReload,
  onRetry,
  showRetry = true,
  showReload = true,
  showBack = true,
  className = "",
}) => {
  const defaultClassName =
    "min-h-screen flex items-center justify-center bg-enterprise-surface p-6";

  const severityStyles = {
    error: "border-destructive/20 bg-destructive/5",
    warning: "border-enterprise-secondary/20 bg-enterprise-secondary/5", 
    info: "border-enterprise-accent/20 bg-enterprise-accent/5"
  };

  return (
    <div className={className || defaultClassName}>
      <div className={`
        max-w-lg w-full 
        bg-card 
        border ${severityStyles[severity]}
        shadow-elegant 
        rounded-xl 
        p-10
        transition-smooth
        animate-slideDownAndFade
      `}>
        {/* Header with Icon and Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4">
            <ErrorIcon size="lg" severity={severity} />
          </div>
          <ErrorMessage title={title} message={message} severity={severity} />
        </div>

        {/* Action Buttons */}
        <ErrorActions
          onReload={onReload}
          onRetry={onRetry}
          showRetry={showRetry}
          showReload={showReload}
          showBack={showBack}
          errorId={errorId}
          severity={severity}
        />

        {/* Technical Details (Development only) */}
        <ErrorDetails
          error={error}
          errorInfo={errorInfo}
          errorId={errorId}
          timestamp={timestamp}
        />
      </div>
    </div>
  );
};
