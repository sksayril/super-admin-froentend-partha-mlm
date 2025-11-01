import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { 
  ApiResponse, 
  UserWithDetails, 
  UserListParams, 
  UserListResponse,
  RechargeAdminWalletRequest,
  RechargeAdminWalletResponse
} from '../types/api';

// User Management Types
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
}

class UserService {
  /**
   * Get list of users with pagination and filtering
   */
  async getUsers(params: UserListParams = {}): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `${API_ENDPOINTS.USERS.LIST}?${queryParams.toString()}`;
      const response: ApiResponse<UserListResponse> = await apiClient.get(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch users');
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserWithDetails> {
    try {
      const response: ApiResponse<{ user: UserWithDetails }> = await apiClient.get(
        `${API_ENDPOINTS.USERS.GET_BY_ID}/${userId}`
      );

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error(response.message || 'Failed to fetch user');
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserRequest): Promise<UserWithDetails> {
    try {
      const response: ApiResponse<{ user: UserWithDetails }> = await apiClient.post(
        API_ENDPOINTS.USERS.CREATE,
        userData
      );

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error(response.message || 'Failed to create user');
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<UserWithDetails> {
    try {
      const response: ApiResponse<{ user: UserWithDetails }> = await apiClient.put(
        `${API_ENDPOINTS.USERS.UPDATE}/${userId}`,
        userData
      );

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error(response.message || 'Failed to update user');
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const response: ApiResponse = await apiClient.delete(
        `${API_ENDPOINTS.USERS.DELETE}/${userId}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  /**
   * Activate/Deactivate user
   */
  async toggleUserStatus(userId: string, status: 'active' | 'inactive'): Promise<UserWithDetails> {
    try {
      const response: ApiResponse<{ user: UserWithDetails }> = await apiClient.put(
        `${API_ENDPOINTS.USERS.UPDATE}/${userId}/status`,
        { status }
      );

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error(response.message || 'Failed to update user status');
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error;
    }
  }

  /**
   * Recharge admin wallet (Super Admin only)
   */
  async rechargeAdminWallet(rechargeData: RechargeAdminWalletRequest): Promise<RechargeAdminWalletResponse> {
    try {
      const response: ApiResponse<RechargeAdminWalletResponse> = await apiClient.post(
        API_ENDPOINTS.ADMIN.RECHARGE_WALLET,
        rechargeData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to recharge admin wallet');
    } catch (error) {
      console.error('Recharge admin wallet error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
