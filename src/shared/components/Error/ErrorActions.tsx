// src/shared/components/Error/ErrorActions.tsx
import React from "react";
import { logger } from "../../../lib/logger";

interface ErrorActionsProps {
  onReload?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
  showReload?: boolean;
  errorId?: string;
}

export const ErrorActions: React.FC<ErrorActionsProps> = ({
  onReload,
  onRetry,
  showRetry = true,
  showReload = true,
  errorId,
}) => {
  const handleReload = () => {
    logger.info("User initiated page reload", {
      source: "error-boundary-action",
      errorId,
    });

    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  const handleRetry = () => {
    logger.info("User initiated error retry", {
      source: "error-boundary-action",
      errorId,
    });

    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="flex space-x-2">
      {showReload && (
        <button
          onClick={handleReload}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          type="button"
        >
          Reload Page
        </button>
      )}

      {showRetry && (
        <button
          onClick={handleRetry}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
