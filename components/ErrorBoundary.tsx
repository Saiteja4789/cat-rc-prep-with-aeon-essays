import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error info here if needed
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#fff', background: '#2d3748', minHeight: '100vh' }}>
          <h1 style={{ fontSize: 32, marginBottom: 16 }}>Something went wrong.</h1>
          <pre style={{ color: '#f87171' }}>{this.state.error?.message}</pre>
          <p>Please refresh the page or contact support if this persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
