import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../contexts/ToastContext';
import { LoginRequest } from '../types/api';
import { validateForm, VALIDATION_RULES } from '../utils/validation';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login, loading, isAuthenticated } = useAuth();
  const { success, error: showError } = useToastContext();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle redirect when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login: User is now authenticated, redirecting to dashboard');
      // Call onLogin callback if provided
      if (onLogin) {
        onLogin();
      }
    }
  }, [isAuthenticated, onLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form data
      const validation = validateForm(formData, {
        email: VALIDATION_RULES.email,
        password: VALIDATION_RULES.password,
      });

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        setError(firstError);
        return;
      }

      const loginResponse = await login(formData);
      console.log('Login: Login successful, response:', loginResponse);
      success('Login Successful', 'Welcome back!');
      
      // Clear form data after successful login
      setFormData({
        email: '',
        password: '',
      });
      
      // Auto-reload the page after successful login to ensure proper redirect
      setTimeout(() => {
        console.log('Login: Auto-reloading page to ensure dashboard redirect');
        window.location.reload();
      }, 1000); // 1 second delay to show success message
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle different error types
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.message?.includes('Invalid email or password')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (err.message?.includes('Account is deactivated')) {
        errorMessage = 'Your account has been deactivated. Please contact support.';
      } else if (err.message?.includes('Network error') || err.message?.includes('timeout')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      showError('Login Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'superadmin@example.com',
      password: 'admin123456',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Super Admin Panel</h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter email address"
                  required
                  autoComplete="email"
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 focus:ring-4 focus:ring-sky-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-sky-600 hover:text-sky-700 font-medium text-sm hover:underline transition-colors disabled:opacity-50"
                disabled={isSubmitting || loading}
              >
                Use Demo Credentials
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <h3 className="font-semibold text-sky-800 mb-2">Demo Access</h3>
              <p className="text-sm text-sky-700">
                <strong>Email:</strong> superadmin@example.com<br />
                <strong>Password:</strong> admin123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;