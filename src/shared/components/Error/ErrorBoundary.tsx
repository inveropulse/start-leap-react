import { Component, ErrorInfo, PropsWithChildren } from "react";
import { ErrorBoundaryState, ErrorBoundaryConfig } from "./types";
import { logger } from "@/shared/logging/logger";

export interface Props extends PropsWithChildren, ErrorBoundaryConfig {}

export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private globalErrorHandlersSetup = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
      timestamp: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const timestamp = new Date().toISOString();

    return {
      hasError: true,
      error,
      errorId,
      timestamp,
    };
  }

  componentDidMount() {
    this.setupGlobalErrorHandlers();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Log the React error
    logger.error("React Error Boundary caught an error", error, {
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      source: "react-error-boundary",
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys && resetKeys.length > 0) {
        const hasResetKeyChanged = resetKeys.some(
          (key, index) => prevProps.resetKeys?.[index] !== key
        );

        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      }
    }

    if (
      hasError &&
      resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    this.removeGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers = () => {
    if (this.globalErrorHandlersSetup || typeof window === "undefined") {
      return;
    }

    window.addEventListener("error", this.handleUncaughtError);
    window.addEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );
    this.globalErrorHandlersSetup = true;
  };

  removeGlobalErrorHandlers = () => {
    if (!this.globalErrorHandlersSetup || typeof window === "undefined") {
      return;
    }

    window.removeEventListener("error", this.handleUncaughtError);
    window.removeEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );
    this.globalErrorHandlersSetup = false;
  };

  handleUncaughtError = (event: ErrorEvent) => {
    try {
      const error = new Error(event.error || event.message);

      // Log the error
      logger.error("Uncaught JavaScript error", error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        source: "global-error-handler",
      });

      // Trigger error boundary UI
      this.setState({
        hasError: true,
        error,
        errorId: `global_error_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("ErrorBoundary failed in global error handler:", err);
    }
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    try {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      // Log the error
      logger.error("Unhandled promise rejection", error, {
        reason: event.reason,
        source: "unhandled-rejection-handler",
      });

      // Trigger error boundary UI
      this.setState({
        hasError: true,
        error,
        errorId: `rejection_error_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error(
        "ErrorBoundary failed in unhandled rejection handler:",
        err
      );
    }
  };

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
      timestamp: undefined,
    });
  };

  handleRetry = () => {
    this.resetErrorBoundary();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-2xl font-bold text-destructive">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.errorId && (
              <p className="text-sm text-muted-foreground font-mono">
                Error ID: {this.state.errorId}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
