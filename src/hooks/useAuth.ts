import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { apiClient } from '../utils/apiClient';
import { debugAuth } from '../utils/debug';
import { User, LoginRequest, AuthState } from '../types/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have stored authentication data
        const token = authService.getToken();
        const user = authService.getCurrentUser();
        
        if (token && user) {
          debugAuth('Found stored auth data', { hasToken: !!token, hasUser: !!user });
          
          // We have stored data, set it immediately for faster loading
          setAuthState({
            isAuthenticated: true,
            user: user,
            token: token,
            loading: false,
          });
          
          // Set token in API client
          apiClient.setToken(token);
          debugAuth('Set token in API client');
          
          // Validate the token in the background
          try {
            const { isValid } = await authService.validateAuth();
            debugAuth('Token validation result', { isValid });
            
            if (!isValid) {
              // Token is invalid, clear auth data
              debugAuth('Token invalid, clearing auth data');
              setAuthState({
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
              });
            }
          } catch (error) {
            console.error('Token validation error:', error);
            debugAuth('Token validation failed', error);
            // Token validation failed, clear auth data
            setAuthState({
              isAuthenticated: false,
              user: null,
              token: null,
              loading: false,
            });
          }
        } else {
          debugAuth('No stored auth data found', { hasToken: !!token, hasUser: !!user });
          // No stored data, user is not authenticated
          setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    debugAuth('Starting login process', { email: credentials.email });
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await authService.login(credentials);
      debugAuth('Login successful', { user: response.user, hasToken: !!response.token });
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
      });

      debugAuth('Auth state updated after login', { isAuthenticated: true });
      return response;
    } catch (error) {
      debugAuth('Login failed', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const newToken = await authService.refreshToken();
      setAuthState(prev => ({ ...prev, token: newToken }));
      return newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  }, [logout]);

  // Update user profile
  const updateUser = useCallback((user: User) => {
    setAuthState(prev => ({ ...prev, user }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    updateUser,
  };
};
