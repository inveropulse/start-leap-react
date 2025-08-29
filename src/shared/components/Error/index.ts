// src/shared/components/Error/index.ts
export { ErrorBoundary } from "./ErrorBoundary";
export { ErrorProvider, useErrorContext } from "./ErrorContext";
export { PageErrorBoundary } from "./SpecializedErrorBoundaries";
export type {
  ErrorBoundaryState,
  ErrorBoundaryConfig,
  ErrorContextType,
} from "./types";
