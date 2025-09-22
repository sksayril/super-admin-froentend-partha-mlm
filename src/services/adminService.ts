import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { ApiResponse, CreateAdminRequest, CreateAdminResponse } from '../types/api';

class AdminService {
  /**
   * Create a new admin user (Super Admin only)
   */
  async createAdmin(adminData: CreateAdminRequest): Promise<CreateAdminResponse> {
    try {
      const response: ApiResponse<CreateAdminResponse> = await apiClient.post(
        API_ENDPOINTS.ADMIN.CREATE,
        adminData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to create admin');
    } catch (error) {
      console.error('Create admin error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();
