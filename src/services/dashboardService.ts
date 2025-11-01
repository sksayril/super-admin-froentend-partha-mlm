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

// Super Admin Dashboard Types
export type DashboardPeriod = 'all' | 'today' | 'week' | 'month';

export interface SuperAdminDashboardSummary {
  totalRevenue: number;
  formattedTotalRevenue: string;
  totalRevenueTransactions: number;
  pendingTransfers: number;
  totalAdmins: number;
  activeAdmins: number;
}

export interface AdminWalletInfo {
  amount: number;
  formatted: string;
}

export interface AdminWalletDetails {
  mainWallet: AdminWalletInfo;
  benefitWallet: AdminWalletInfo;
  withdrawalWallet: AdminWalletInfo;
  total: AdminWalletInfo;
}

export interface AdminBalanceItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  wallets: AdminWalletDetails;
  createdAt: string;
}

export interface AdminBalances {
  totalMainWallet: number;
  totalBenefitWallet: number;
  totalWithdrawalWallet: number;
  totalBalance: number;
  adminCount: number;
  activeAdmins: number;
  formatted: {
    totalMainWallet: string;
    totalBenefitWallet: string;
    totalWithdrawalWallet: string;
    totalBalance: string;
  };
  admins: AdminBalanceItem[];
}

export interface RevenueByType {
  type: string;
  total: number;
  formattedTotal: string;
  count: number;
}

export interface MonthlyRevenueTrend {
  month: string;
  monthNumber: number;
  year: number;
  total: number;
  formattedTotal: string;
  transactionCount: number;
}

export interface TopAdminRevenue {
  admin: {
    id: string;
    name: string;
    email: string;
  };
  totalRevenue: number;
  formattedTotalRevenue: string;
  transactionCount: number;
}

export interface RevenueData {
  total: number;
  formattedTotal: string;
  byType: RevenueByType[];
  monthlyTrend: MonthlyRevenueTrend[];
  topAdmins: TopAdminRevenue[];
}

export interface SystemStatistics {
  totalUsers: number;
  totalDeposits: {
    amount: number;
    formatted: string;
    count: number;
  };
  totalCommissions: {
    amount: number;
    formatted: string;
    count: number;
  };
  totalWithdrawals: {
    amount: number;
    formatted: string;
    count: number;
  };
  pendingDeposits: number;
}

export interface RecentRevenueActivity {
  id: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
  transferType: string;
  amount: number;
  formattedAmount: string;
  walletType: string;
  description: string;
  status: string;
  processedBy: {
    name: string;
  };
  createdAt: string;
}

export interface RecentActivity {
  revenues: RecentRevenueActivity[];
}

export interface SuperAdminDashboardData {
  period: DashboardPeriod;
  summary: SuperAdminDashboardSummary;
  adminBalances: AdminBalances;
  revenue: RevenueData;
  systemStatistics: SystemStatistics;
  recentActivity: RecentActivity;
}

// Revenue Records Types
export type TransferType = 
  | 'wallet_recharge' 
  | 'commission_payout' 
  | 'bonus_payout' 
  | 'manual_transfer' 
  | 'deposit_revenue' 
  | 'commission_revenue';

export type RevenueStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface RevenueRecordAdmin {
  id: string;
  name: string;
  email: string;
}

export interface RevenueRecordProcessedBy {
  id: string;
  name: string;
  email: string;
}

export interface RevenueRecord {
  id: string;
  admin: RevenueRecordAdmin;
  transferType: TransferType;
  amount: number;
  formattedAmount: string;
  currency: string;
  walletType: string;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId: string | null;
  relatedUser: any | null;
  relatedDeposit: any | null;
  status: RevenueStatus;
  processedBy: RevenueRecordProcessedBy;
  notes: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueSummaryStatus {
  count: number;
  amount: number;
  formattedAmount: string;
}

export interface RevenueSummary {
  totalAmount: number;
  formattedTotalAmount: string;
  totalCount: number;
  completed: RevenueSummaryStatus;
  pending: RevenueSummaryStatus;
}

export interface RevenueListParams {
  page?: number;
  limit?: number;
  adminId?: string;
  transferType?: TransferType;
  status?: RevenueStatus;
  startDate?: string; // ISO format: YYYY-MM-DD
  endDate?: string; // ISO format: YYYY-MM-DD
}

export interface RevenueListResponse {
  revenues: RevenueRecord[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  summary: RevenueSummary;
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

  /**
   * Get super admin dashboard with comprehensive statistics
   * @param period - Time period filter: 'all' (default), 'today', 'week', 'month'
   */
  async getSuperAdminDashboard(period: DashboardPeriod = 'all'): Promise<SuperAdminDashboardData> {
    try {
      const params = new URLSearchParams();
      if (period && period !== 'all') {
        params.append('period', period);
      }

      const endpoint = params.toString()
        ? `${API_ENDPOINTS.DASHBOARD.SUPER_ADMIN}?${params.toString()}`
        : API_ENDPOINTS.DASHBOARD.SUPER_ADMIN;

      const response: ApiResponse<SuperAdminDashboardData> = await apiClient.get(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch super admin dashboard');
    } catch (error) {
      console.error('Super admin dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get all revenue records with filtering and pagination
   * @param params - Filter and pagination parameters
   */
  async getRevenueRecords(params: RevenueListParams = {}): Promise<RevenueListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.adminId) queryParams.append('adminId', params.adminId);
      if (params.transferType) queryParams.append('transferType', params.transferType);
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const endpoint = queryParams.toString()
        ? `${API_ENDPOINTS.REVENUE.LIST}?${queryParams.toString()}`
        : API_ENDPOINTS.REVENUE.LIST;

      const response: ApiResponse<RevenueListResponse> = await apiClient.get(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch revenue records');
    } catch (error) {
      console.error('Revenue records error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
