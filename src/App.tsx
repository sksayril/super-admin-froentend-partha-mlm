import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import AuthDebugger from './components/AuthDebugger';
import { ToastProvider } from './contexts/ToastContext';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';

function App() {
  const { isAuthenticated, loading, logout } = useAuth();
  const { toasts, removeToast } = useToast();

  // Login is now handled automatically by the useAuth hook
  // No need for manual callback since authentication state updates automatically

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
        {!isAuthenticated ? (
          <Login />
        ) : (
          <Dashboard onLogout={handleLogout} />
        )}
          
          {/* Toast Notifications */}
          <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
          
          {/* Debug Component (Development Only) */}
          <AuthDebugger />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;