import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User, 
  CreditCard, 
  Calendar, 
  DollarSign,
  FileText,
  Image as ImageIcon,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { 
  DepositRequest, 
  ApproveDepositRequestRequest, 
  RejectDepositRequestRequest 
} from '../types/api';
import { paymentRequestService } from '../services/paymentRequestService';
import { useToast } from '../hooks/useToast';

interface PaymentRequestDetailsProps {
  request: DepositRequest;
  onBack: () => void;
  onRequestUpdated: (updatedRequest: DepositRequest) => void;
}

const PaymentRequestDetails: React.FC<PaymentRequestDetailsProps> = ({
  request,
  onBack,
  onRequestUpdated
}) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const { success, error: showError } = useToast();

  const handleApprove = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      console.log('Approving payment request:', request.id);
      const approvalData: ApproveDepositRequestRequest = {
        notes: approvalNotes.trim() || undefined
      };

      console.log('Approval data:', approvalData);
      const response = await paymentRequestService.approveDepositRequest(request.id, approvalData);
      console.log('Approval response:', response);
      
      onRequestUpdated(response.depositRequest);
      
      success('Payment request approved successfully');
      setShowApproveModal(false);
      setApprovalNotes('');
    } catch (error) {
      console.error('Approval error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve payment request';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (loading || !rejectionReason.trim()) return;
    
    setLoading(true);
    try {
      const rejectionData: RejectDepositRequestRequest = {
        rejectionReason: rejectionReason.trim()
      };

      const response = await paymentRequestService.rejectDepositRequest(request.id, rejectionData);
      onRequestUpdated(response.depositRequest);
      
      success('Payment request rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject payment request';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Request Details</h1>
            <p className="text-gray-600">Transaction ID: {request.transactionId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
          
          {request.status === 'pending' && (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{request.user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{request.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{request.user.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Referral Code</label>
                <p className="text-gray-900 font-mono">{request.user.referralCode}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-2xl font-bold text-gray-900">{request.formattedAmount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                <p className="text-gray-900 capitalize">{request.paymentMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="text-gray-900 font-mono">{request.transactionId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                <p className="text-gray-900">{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Payment Screenshot */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Payment Screenshot
            </h2>
            <div className="relative">
              <img
                src={request.paymentScreenshot}
                alt="Payment Screenshot"
                className="w-full max-w-md rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setShowImageModal(true)}
              />
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Admin Actions */}
          {(request.status === 'approved' || request.status === 'rejected') && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Admin Actions
              </h2>
              <div className="space-y-4">
                {request.status === 'approved' && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">Approved</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Approved by: {request.approvedBy?.name} ({request.approvedBy?.email})
                    </p>
                    <p className="text-sm text-green-700">
                      Approved at: {request.approvedAt ? formatDate(request.approvedAt) : 'N/A'}
                    </p>
                    {request.notes && (
                      <p className="text-sm text-green-700 mt-2">
                        <strong>Notes:</strong> {request.notes}
                      </p>
                    )}
                  </div>
                )}
                
                {request.status === 'rejected' && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center mb-2">
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium text-red-800">Rejected</span>
                    </div>
                    <p className="text-sm text-red-700">
                      <strong>Reason:</strong> {request.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wallet Updates */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Wallet Updates
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">Main Wallet</span>
                <span className="font-semibold text-blue-900">{request.walletUpdates.formatted.mainWallet}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">Benefit Wallet</span>
                <span className="font-semibold text-green-900">{request.walletUpdates.formatted.benefitWallet}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                <span className="text-sm font-medium text-purple-800">Total</span>
                <span className="font-bold text-purple-900">{request.walletUpdates.formatted.total}</span>
              </div>
            </div>
          </div>

          {/* Request Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                  <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                </div>
              </div>
              
              {request.status === 'approved' && request.approvedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Request Approved</p>
                    <p className="text-xs text-gray-500">{formatDate(request.approvedAt)}</p>
                  </div>
                </div>
              )}
              
              {request.status === 'rejected' && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Request Rejected</p>
                    <p className="text-xs text-gray-500">See rejection reason above</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Payment Request</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve this payment request for {request.formattedAmount}?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Notes (Optional)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Add any notes about this approval..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Payment Request</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this payment request.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this payment request is being rejected..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={request.paymentScreenshot}
              alt="Payment Screenshot"
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRequestDetails;
