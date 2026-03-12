import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
          <h2 style={{ color: '#b91c1c', marginBottom: '8px' }}>Application Error</h2>
          <p style={{ marginBottom: '8px' }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering the app.'}
          </p>
          <p style={{ color: '#4b5563' }}>
            Open DevTools Console to view the full stack trace.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
