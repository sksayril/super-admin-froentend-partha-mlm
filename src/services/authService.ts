import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { LoginRequest, LoginResponse, User, ApiResponse } from '../types/api';

class AuthService {
  private readonly TOKEN_KEY = 'adminToken';
  private readonly USER_KEY = 'adminUser';

  /**
   * Authenticate super admin user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: ApiResponse<LoginResponse> = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store authentication data
        this.setToken(token);
        this.setUser(user);
        
        // Set token in API client
        apiClient.setToken(token);
        
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user and clear stored data
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if authenticated
      if (this.isAuthenticated()) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage regardless of API call result
      this.clearAuthData();
    }
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    try {
      const response: ApiResponse<{ token: string }> = await apiClient.post(
        API_ENDPOINTS.AUTH.REFRESH
      );

      if (response.success && response.data) {
        const { token } = response.data;
        this.setToken(token);
        apiClient.setToken(token);
        return token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response: ApiResponse<{ user: User }> = await apiClient.get(
        API_ENDPOINTS.AUTH.PROFILE
      );

      if (response.success && response.data) {
        const { user } = response.data;
        this.setUser(user);
        return user;
      }

      throw new Error('Failed to fetch profile');
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  /**
   * Validate token and get user info
   */
  async validateAuth(): Promise<{ isValid: boolean; user?: User }> {
    try {
      const token = this.getToken();
      const user = this.getCurrentUser();
      
      // If we have both token and user in localStorage, consider it valid
      if (token && user) {
        // Set token in API client for future requests
        apiClient.setToken(token);
        return { isValid: true, user };
      }

      // If we only have token, try to get user profile
      if (token) {
        apiClient.setToken(token);
        const user = await this.getProfile();
        return { isValid: true, user };
      }

      return { isValid: false };
    } catch (error) {
      console.error('Auth validation error:', error);
      this.clearAuthData();
      return { isValid: false };
    }
  }

  /**
   * Set authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Set user data
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    apiClient.clearToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
