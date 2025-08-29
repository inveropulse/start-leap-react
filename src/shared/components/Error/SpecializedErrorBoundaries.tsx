// src/shared/components/Error/SpecializedErrorBoundaries.tsx
import React from "react";
import { ErrorBoundary, Props } from "./ErrorBoundary";

// Page-level error boundary with full-screen error display
export const PageErrorBoundary: React.FC<Props> = ({ children, ...props }) => {
  return (
    <ErrorBoundary level="page" {...props}>
      {children}
    </ErrorBoundary>
  );
};

