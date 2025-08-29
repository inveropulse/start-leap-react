// src/shared/components/Error/SpecializedErrorBoundaries.tsx
import React from "react";
import { ErrorBoundary, Props } from "./ErrorBoundary";
import { ErrorDisplay } from "./ErrorDisplay";

// Page-level error boundary with full-screen error display
export const PageErrorBoundary: React.FC<Props> = ({ children, ...props }) => {
  return (
    <ErrorBoundary level="page" {...props}>
      {children}
    </ErrorBoundary>
  );
};

// Section-level error boundary with contained error display
export const SectionErrorBoundary: React.FC<Props> = ({
  children,
  ...props
}) => {
  const sectionFallback = (
    <ErrorDisplay
      title="Section Error"
      message="This section encountered an error. You can try refreshing or continue using other parts of the application."
      severity="warning"
      showReload={false}
      className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
    />
  );

  return (
    <ErrorBoundary level="section" fallback={sectionFallback} {...props}>
      {children}
    </ErrorBoundary>
  );
};

// Component-level error boundary with minimal error display
export const ComponentErrorBoundary: React.FC<Props> = ({
  children,
  ...props
}) => {
  const componentFallback = (
    <ErrorDisplay
      title="Component Error"
      message="This component failed to load."
      severity="info"
      showReload={false}
      className="p-3 bg-blue-50 border border-blue-200 rounded text-center"
    />
  );

  return (
    <ErrorBoundary
      level="component"
      isolate={true}
      fallback={componentFallback}
      {...props}
    >
      {children}
    </ErrorBoundary>
  );
};

// Async boundary for handling async component errors
export const AsyncErrorBoundary: React.FC<
  Props & {
    pendingFallback?: React.ReactNode;
    isLoading?: boolean;
  }
> = ({ children, pendingFallback, isLoading, ...props }) => {
  if (isLoading && pendingFallback) {
    return <>{pendingFallback}</>;
  }

  return <ErrorBoundary {...props}>{children}</ErrorBoundary>;
};
