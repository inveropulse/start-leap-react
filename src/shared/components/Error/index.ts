// src/shared/components/Error/index.ts
export { ErrorBoundary } from "./ErrorBoundary";
export { ErrorDisplay } from "./ErrorDisplay";
export { ErrorIcon } from "./ErrorIcon";
export { ErrorMessage } from "./ErrorMessage";
export { ErrorActions } from "./ErrorActions";
export { ErrorDetails } from "./ErrorDetails";
export {
  ErrorProvider,
  useErrorContext,
  useErrorReporter,
} from "./ErrorContext";
export {
  PageErrorBoundary,
  SectionErrorBoundary,
  ComponentErrorBoundary,
} from "./SpecializedErrorBoundaries";
export type {
  ErrorBoundaryState,
  ErrorBoundaryConfig,
  ErrorContextType,
} from "./types";
