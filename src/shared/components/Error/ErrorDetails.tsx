// src/shared/components/Error/ErrorDetails.tsx
import React, { useState } from "react";
import { APP_CONFIG, Environment } from "@/shared/AppConfig";

interface ErrorDetailsProps {
  error?: Error;
  errorInfo?: any;
  errorId?: string;
  timestamp?: string;
}

export const ErrorDetails: React.FC<ErrorDetailsProps> = ({
  error,
  errorInfo,
  errorId,
  timestamp,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDevelopment = APP_CONFIG.environment === Environment.Development;

  if (!isDevelopment || !error) {
    return null;
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center space-x-2 focus:outline-none focus:underline transition-smooth w-full justify-center"
        type="button"
      >
        <span className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
          ▶
        </span>
        <span>Technical Details</span>
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-3">
          {errorId && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">Error ID:</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {errorId}
              </code>
            </div>
          )}

          {timestamp && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">Timestamp:</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {new Date(timestamp).toLocaleString()}
              </code>
            </div>
          )}

          {error.message && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">Message:</h4>
              <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto whitespace-pre-wrap font-mono">
                {error.message}
              </pre>
            </div>
          )}

          {error.stack && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">
                Stack Trace:
              </h4>
              <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto max-h-40 overflow-y-auto font-mono">
                {error.stack}
              </pre>
            </div>
          )}

          {errorInfo?.componentStack && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground">
                Component Stack:
              </h4>
              <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto max-h-32 overflow-y-auto font-mono">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
