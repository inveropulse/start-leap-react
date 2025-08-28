import React, { Component, ReactNode } from 'react';
import { logger } from '@company/utils';
import { Button } from '@company/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with context
    logger.error('React Error Boundary caught error', error, {
      component: 'ErrorBoundary',
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    logger.info('User initiated error boundary retry', {
      component: 'ErrorBoundary',
      errorId: this.state.errorId
    });
    
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  handleReload = () => {
    logger.info('User initiated page reload', {
      component: 'ErrorBoundary',
      errorId: this.state.errorId
    });
    
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
                <h3 className="font-medium text-destructive mb-2">Error Details:</h3>
                <pre className="text-xs text-destructive overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={this.handleRetry}>
                Try Again
              </Button>
              <Button onClick={this.handleReload}>
                Reload Page
              </Button>
            </div>

            {this.state.errorId && (
              <p className="text-xs text-muted-foreground">
                Error ID: {this.state.errorId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}