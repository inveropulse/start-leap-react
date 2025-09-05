import { AlertCircle, RefreshCw, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

export interface FeatureErrorProps {
  featureName: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onContinueWithoutFeature?: () => void;
  alternativeActions?: Array<{
    label: string;
    action: () => void;
    variant?: "default" | "outline" | "secondary";
  }>;
  className?: string;
}

export function FeatureError({
  featureName,
  message = "This feature is temporarily unavailable. You can continue using other parts of the application.",
  onRetry,
  onGoBack,
  onContinueWithoutFeature,
  alternativeActions = [],
  className
}: FeatureErrorProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <Card className="w-full max-w-md border-warning/30 bg-warning/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/20">
            <AlertCircle className="h-6 w-6 text-warning" />
          </div>
          <CardTitle className="text-lg">{featureName} Unavailable</CardTitle>
          <CardDescription className="text-center">{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {onRetry && (
              <Button
                variant="default"
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry {featureName}
              </Button>
            )}

            {onContinueWithoutFeature && (
              <Button
                variant="outline"
                onClick={onContinueWithoutFeature}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Continue Without This Feature
              </Button>
            )}

            {alternativeActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}

            {onGoBack && (
              <Button
                variant="ghost"
                onClick={onGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}