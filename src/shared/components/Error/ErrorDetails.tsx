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
        className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer flex items-center space-x-1 focus:outline-none focus:underline"
        type="button"
      >
        <span>{isExpanded ? "▼" : "▶"}</span>
        <span>Technical Details</span>
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-3">
          {errorId && (
            <div>
              <h4 className="text-xs font-medium text-gray-700">Error ID:</h4>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {errorId}
              </code>
            </div>
          )}

          {timestamp && (
            <div>
              <h4 className="text-xs font-medium text-gray-700">Timestamp:</h4>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {new Date(timestamp).toLocaleString()}
              </code>
            </div>
          )}

          {error.message && (
            <div>
              <h4 className="text-xs font-medium text-gray-700">Message:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                {error.message}
              </pre>
            </div>
          )}

          {error.stack && (
            <div>
              <h4 className="text-xs font-medium text-gray-700">
                Stack Trace:
              </h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                {error.stack}
              </pre>
            </div>
          )}

          {errorInfo?.componentStack && (
            <div>
              <h4 className="text-xs font-medium text-gray-700">
                Component Stack:
              </h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
