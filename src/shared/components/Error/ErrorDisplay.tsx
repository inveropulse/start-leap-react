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
  className = "",
}) => {
  const defaultClassName =
    "min-h-screen flex items-center justify-center bg-gray-50 p-4";

  return (
    <div className={className || defaultClassName}>
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        {/* Header with Icon and Title */}
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0">
            <ErrorIcon size="lg" />
          </div>
          <div className="ml-4 flex-1">
            <ErrorMessage title={title} message={message} severity={severity} />
          </div>
        </div>

        {/* Action Buttons */}
        <ErrorActions
          onReload={onReload}
          onRetry={onRetry}
          showRetry={showRetry}
          showReload={showReload}
          errorId={errorId}
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
