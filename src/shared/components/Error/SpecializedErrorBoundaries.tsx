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
      title="Section Unavailable"
      message="This section encountered an error. You can try refreshing or continue using other parts of the application."
      severity="warning"
      showReload={false}
      className="flex items-center justify-center p-8 border border-enterprise-secondary/20 bg-enterprise-secondary/5 rounded-xl"
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
      title="Component Unavailable"
      message="This component failed to load."
      severity="info"
      showReload={false}
      showRetry={false}
      className="flex items-center justify-center p-6 border border-enterprise-accent/20 bg-enterprise-accent/5 rounded-lg"
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

