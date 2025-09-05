import { Component, ErrorInfo, ReactNode } from "react";
import { InlineError } from "./InlineError";
import { logger } from "@/shared/services/logging/logger";

interface FormErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

interface FormErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  formName?: string;
  onRetry?: () => void;
}

export class FormErrorBoundary extends Component<
  FormErrorBoundaryProps,
  FormErrorBoundaryState
> {
  constructor(props: FormErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<FormErrorBoundaryState> {
    const errorId = `form_error_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Log the form error with context
    logger.error("Form error boundary caught an error", error, {
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      formName: this.props.formName,
      source: "form-error-boundary",
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="my-4 p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            <h3 className="font-medium">{this.props.formName || "Form"} Error</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            There was a problem with this form. Please try again or refresh the page.
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

    return this.props.children;
  }
}