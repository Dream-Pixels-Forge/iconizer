import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component - Catches and displays React rendering errors
 *
 * Features:
 * - Catches JavaScript errors in child components
 * - Displays fallback UI instead of crashing
 * - Logs error information for debugging
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', {
      error,
      errorInfo,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReport = () => {
    // In production, this would send to error tracking service
    console.error('Error report:', {
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
    });
    alert(
      'An error occurred. Please try refreshing the page. If the problem persists, contact support.'
    );
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <h2 className="text-xl font-semibold">Something went wrong</h2>
              </div>

              <div className="mb-4 rounded-md bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>

              <details className="mb-4 rounded-md bg-muted p-3">
                <summary className="cursor-pointer text-sm font-medium">Technical Details</summary>
                <pre className="mt-2 max-h-48 overflow-auto text-xs text-muted-foreground">
                  {this.state.error?.stack}
                </pre>
              </details>

              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Refresh Page
                </Button>
                <Button variant="outline" onClick={this.handleReport}>
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
