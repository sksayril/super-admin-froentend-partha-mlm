import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import UsersContent from './UsersContent';
import RevenueContent from './RevenueContent';
import PaymentRequests from './PaymentRequests';
import PaymentRequestDetails from './PaymentRequestDetails';
import { DepositRequest } from '../types/api';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState<DepositRequest | null>(null);

  const handleViewPaymentRequest = (request: DepositRequest) => {
    setSelectedPaymentRequest(request);
  };

  const handleBackToPaymentRequests = () => {
    setSelectedPaymentRequest(null);
  };

  const handlePaymentRequestUpdated = (updatedRequest: DepositRequest) => {
    setSelectedPaymentRequest(updatedRequest);
  };

  const renderContent = () => {
    // Show payment request details if one is selected
    if (selectedPaymentRequest) {
      return (
        <PaymentRequestDetails
          request={selectedPaymentRequest}
          onBack={handleBackToPaymentRequests}
          onRequestUpdated={handlePaymentRequestUpdated}
        />
      );
    }

    // Show main content based on active tab
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <UsersContent />;
      case 'revenue':
        return <RevenueContent />;
      case 'payment-requests':
        return <PaymentRequests onViewDetails={handleViewPaymentRequest} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={onLogout}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;