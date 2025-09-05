import { logger } from "@/shared/services/logging/logger";
import { Component, ErrorInfo, PropsWithChildren } from "react";
import { ErrorBoundaryConfig, ErrorBoundaryState } from "./types";

export interface Props extends PropsWithChildren, ErrorBoundaryConfig {}

export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private globalErrorHandlersSetup = false;
  private pendingStateUpdate = false;

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
    this.pendingStateUpdate = false;
    this.removeGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers = () => {
    if (this.globalErrorHandlersSetup || typeof window === "undefined") {
      return;
    }

    // Only setup global handlers if not in isolate mode
    if (!this.props.isolate) {
      window.addEventListener("error", this.handleUncaughtError);
      window.addEventListener(
        "unhandledrejection",
        this.handleUnhandledRejection
      );
    }
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
    // Prevent handling if we're already in an error state or have a pending update
    if (this.state.hasError || this.pendingStateUpdate) {
      return;
    }

    try {
      const error =
        event.error instanceof Error
          ? event.error
          : new Error(event.message || "Unknown error");

      // Log the error
      logger.error("Uncaught JavaScript error", error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        source: "global-error-handler",
      });

      // Use timeout to avoid state updates during render
      this.pendingStateUpdate = true;
      setTimeout(() => {
        if (!this.state.hasError) {
          this.setState({
            hasError: true,
            error,
            errorId: `global_error_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            timestamp: new Date().toISOString(),
          });
        }
        this.pendingStateUpdate = false;
      }, 0);
    } catch (err) {
      console.error("ErrorBoundary failed in global error handler:", err);
      this.pendingStateUpdate = false;
    }
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    // Prevent handling if we're already in an error state or have a pending update
    if (this.state.hasError || this.pendingStateUpdate) {
      return;
    }

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

      // Use timeout to avoid state updates during render
      this.pendingStateUpdate = true;
      setTimeout(() => {
        if (!this.state.hasError) {
          this.setState({
            hasError: true,
            error,
            errorId: `rejection_error_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            timestamp: new Date().toISOString(),
          });
        }
        this.pendingStateUpdate = false;
      }, 0);
    } catch (err) {
      console.error(
        "ErrorBoundary failed in unhandled rejection handler:",
        err
      );
      this.pendingStateUpdate = false;
    }
  };

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.pendingStateUpdate = false;
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

      // Component-level errors should show inline
      if (this.props.level === "component") {
        // Dynamic import to avoid require() in browser
        return (
          <div className="m-4 p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
              <h3 className="font-medium">Component Error</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              This component encountered an error and cannot be displayed.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        );
      }

      // Section-level errors should show as feature errors
      if (this.props.level === "section") {
        return (
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-md border-warning/30 bg-warning/5 rounded-lg p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/20">
                <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Section Unavailable</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This section is temporarily unavailable due to an error.
              </p>
              <div className="space-y-2">
                <button
                  onClick={this.handleRetry}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Retry Section
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full px-4 py-2 border border-input bg-background hover:bg-accent rounded-md"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Page-level errors (default) show full-screen with enhanced design
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="w-full max-w-md mx-4">
            <div className="text-center space-y-6 p-8 bg-card border rounded-lg shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  className="h-8 w-8 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  An unexpected error occurred. We're sorry for the inconvenience.
                </p>
              </div>

              {this.state.errorId && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground font-mono">
                    Error ID: {this.state.errorId}
                  </p>
                  {this.state.timestamp && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(this.state.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={this.handleReload}
                  className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Reload Application
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
