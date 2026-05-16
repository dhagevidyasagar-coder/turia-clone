import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          background: 'var(--background)', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ 
            background: 'var(--surface)', 
            padding: '48px', 
            borderRadius: '24px', 
            boxShadow: 'var(--shadow-premium)', 
            maxWidth: '500px' 
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: 'var(--danger)' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: '500' }}>
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--primary)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '700'
              }}
            >
              Reload Application
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre style={{ 
                marginTop: '24px', 
                padding: '16px', 
                background: '#fee2e2', 
                borderRadius: '8px', 
                fontSize: '12px', 
                textAlign: 'left', 
                overflowX: 'auto',
                color: '#991b1b'
              }}>
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
