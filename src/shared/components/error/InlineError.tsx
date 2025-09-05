import { AlertTriangle, RefreshCw, X, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";

export interface InlineErrorProps {
  title?: string;
  message: string;
  error?: Error;
  onRetry?: () => void;
  onDismiss?: () => void;
  showTechnicalDetails?: boolean;
  className?: string;
  severity?: "error" | "warning" | "info";
}

export function InlineError({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  onDismiss,
  showTechnicalDetails = false,
  className,
  severity = "error"
}: InlineErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getIcon = () => {
    switch (severity) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "info":
        return <Info className="h-5 w-5 text-info" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };

  const getCardClass = () => {
    switch (severity) {
      case "warning":
        return "border-warning/30 bg-warning/5";
      case "info":
        return "border-info/30 bg-info/5";
      default:
        return "border-destructive/30 bg-destructive/5";
    }
  };

  return (
    <Card className={cn(getCardClass(), "relative", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="mt-1">{message}</CardDescription>
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          {showTechnicalDetails && error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Details
                </>
              )}
            </Button>
          )}
        </div>

        {showDetails && error && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="text-sm font-mono text-muted-foreground">
              <div className="font-medium mb-2">Error Details:</div>
              <div className="whitespace-pre-wrap break-all">
                {error.name}: {error.message}
              </div>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer hover:text-foreground">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}