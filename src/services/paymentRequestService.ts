import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';
import { 
  ApiResponse, 
  DepositRequestListParams, 
  DepositRequestListResponse,
  ApproveDepositRequestRequest,
  ApproveDepositRequestResponse,
  RejectDepositRequestRequest,
  RejectDepositRequestResponse
} from '../types/api';

class PaymentRequestService {
  /**
   * Get all deposit requests for admin's assigned users
   */
  async getDepositRequests(params: DepositRequestListParams = {}): Promise<DepositRequestListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.userId) queryParams.append('userId', params.userId);

      const url = `${API_ENDPOINTS.ADMIN.DEPOSIT_REQUESTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response: ApiResponse<DepositRequestListResponse> = await apiClient.get(url);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch deposit requests');
    } catch (error) {
      console.error('Get deposit requests error:', error);
      throw error;
    }
  }

  /**
   * Approve a pending deposit request
   */
  async approveDepositRequest(
    requestId: string, 
    approvalData: ApproveDepositRequestRequest
  ): Promise<ApproveDepositRequestResponse> {
    try {
      const url = `${API_ENDPOINTS.ADMIN.DEPOSIT_REQUESTS}/${requestId}/approve`;
      console.log('Making approval request to:', url);
      console.log('Request data:', approvalData);
      console.log('Full URL will be:', `${API_CONFIG.baseURL}${url}`);
      
      const response: ApiResponse<ApproveDepositRequestResponse> = await apiClient.patch(
        url,
        approvalData
      );

      console.log('API response:', response);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to approve deposit request');
    } catch (error) { 
      console.error('Approve deposit request error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  /**
   * Reject a pending deposit request
   */
  async rejectDepositRequest(
    requestId: string, 
    rejectionData: RejectDepositRequestRequest
  ): Promise<RejectDepositRequestResponse> {
    try {
      const response: ApiResponse<RejectDepositRequestResponse> = await apiClient.patch(
        `${API_ENDPOINTS.ADMIN.DEPOSIT_REQUESTS}/${requestId}/reject`,
        rejectionData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to reject deposit request');
    } catch (error) {
      console.error('Reject deposit request error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentRequestService = new PaymentRequestService();
