// src/shared/components/Error/ErrorActions.tsx
import React from "react";
import { RefreshCw, RotateCcw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorActionsProps {
  onReload?: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
  showReload?: boolean;
  showBack?: boolean;
  errorId?: string;
  severity?: "error" | "warning" | "info";
}

export const ErrorActions: React.FC<ErrorActionsProps> = ({
  onReload,
  onRetry,
  showRetry = true,
  showReload = true,
  showBack = true,
  errorId,
  severity = "error",
}) => {
  const navigate = useNavigate();
  const handleReload = () => {
    console.info("User initiated page reload", { errorId });
    if (onReload) {
      onReload();
    } else {
      window.location.reload();
    }
  };

  const handleRetry = () => {
    console.info("User initiated error retry", { errorId });
    if (onRetry) {
      onRetry();
    }
  };

  const handleBack = () => {
    console.info("User navigated back from error", { errorId });
    navigate(-1);
  };

  const primaryButton = severity === "error" ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
    : severity === "warning" ? "bg-enterprise-secondary hover:bg-enterprise-secondary/90 text-white"
    : "bg-enterprise-accent hover:bg-enterprise-accent/90 text-white";

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {showBack && (
        <button
          onClick={handleBack}
          className="
            bg-muted hover:bg-muted/80 text-muted-foreground
            inline-flex items-center gap-2 
            px-6 py-3 
            rounded-lg 
            text-sm font-medium 
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
            transition-smooth
            shadow-sm hover:shadow-md
          "
          type="button"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      )}

      {showRetry && (
        <button
          onClick={handleRetry}
          className={`
            ${primaryButton}
            inline-flex items-center gap-2 
            px-6 py-3 
            rounded-lg 
            text-sm font-medium 
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
            transition-smooth
            shadow-sm hover:shadow-md
          `}
          type="button"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      )}

      {showReload && (
        <button
          onClick={handleReload}
          className="
            bg-secondary hover:bg-secondary/80 text-secondary-foreground
            inline-flex items-center gap-2 
            px-6 py-3 
            rounded-lg 
            text-sm font-medium 
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
            transition-smooth
            shadow-sm hover:shadow-md
          "
          type="button"
        >
          <RefreshCw className="h-4 w-4" />
          Reload Page
        </button>
      )}
    </div>
  );
};
