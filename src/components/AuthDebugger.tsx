import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const AuthDebugger: React.FC = () => {
  const { isAuthenticated, user, token, loading } = useAuth();

  const handleTestLogin = async () => {
    try {
      await authService.login({
        email: 'superadmin@example.com',
        password: 'admin123456',
      });
      console.log('Test login successful');
    } catch (error) {
      console.error('Test login failed:', error);
    }
  };

  const handleClearAuth = () => {
    authService.logout();
    console.log('Auth data cleared');
  };

  const handleCheckStorage = () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    console.log('Storage check:', { token: !!token, user: !!user });
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debugger</h3>
      <div className="space-y-1">
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.email : 'None'}</div>
        <div>Token: {token ? 'Present' : 'None'}</div>
      </div>
      <div className="mt-3 space-y-1">
        <button
          onClick={handleTestLogin}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Test Login
        </button>
        <button
          onClick={handleClearAuth}
          className="block w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Clear Auth
        </button>
        <button
          onClick={handleCheckStorage}
          className="block w-full bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
        >
          Check Storage
        </button>
      </div>
    </div>
  );
};

export default AuthDebugger;
