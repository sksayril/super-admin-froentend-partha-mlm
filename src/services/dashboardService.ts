import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { ApiResponse } from '../types/api';

// Dashboard Statistics Types
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
  conversionRate: number;
}

export interface DashboardAnalytics {
  userGrowth: Array<{
    month: string;
    users: number;
  }>;
  revenueChart: Array<{
    month: string;
    revenue: number;
  }>;
  topPerformingUsers: Array<{
    id: string;
    name: string;
    revenue: number;
    rank: number;
  }>;
}

class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response: ApiResponse<DashboardStats> = await apiClient.get(
        API_ENDPOINTS.DASHBOARD.STATS
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch dashboard stats');
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }

  /**
   * Get dashboard analytics
   */
  async getAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response: ApiResponse<DashboardAnalytics> = await apiClient.get(
        API_ENDPOINTS.DASHBOARD.ANALYTICS
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch dashboard analytics');
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
