import { useEffect } from 'react';
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
  const { isAuthenticated, loading, logout, user } = useAuth();
  const { toasts, removeToast } = useToast();

  // Login is now handled automatically by the useAuth hook
  // No need for manual callback since authentication state updates automatically

  const handleLogout = async () => {
    await logout();
  };

  // Debug logging for authentication state changes
  useEffect(() => {
    console.log('App: Authentication state changed', { 
      isAuthenticated, 
      loading, 
      user: user?.email || 'No user' 
    });
    
    // Force a re-render if authentication state changes
    if (isAuthenticated && !loading) {
      console.log('App: User is authenticated, should show dashboard');
    } else if (!isAuthenticated && !loading) {
      console.log('App: User is not authenticated, should show login');
    }
  }, [isAuthenticated, loading, user]);

  // Additional check for localStorage on page load
  useEffect(() => {
    const checkAuthOnLoad = () => {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');
      console.log('App: Page loaded, checking auth data', { 
        hasToken: !!token, 
        hasUser: !!user 
      });
    };
    
    checkAuthOnLoad();
  }, []);

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