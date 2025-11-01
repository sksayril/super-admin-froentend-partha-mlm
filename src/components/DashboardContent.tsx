import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Building2,
  Activity,
  Calendar,
  RefreshCw,
  AlertCircle,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { dashboardService, DashboardPeriod, SuperAdminDashboardData } from '../services/dashboardService';
import LoadingSpinner from './LoadingSpinner';
import { useToastContext } from '../contexts/ToastContext';

const DashboardContent: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<SuperAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<DashboardPeriod>('all');
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToastContext();

  const fetchDashboardData = useCallback(async (selectedPeriod: DashboardPeriod = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getSuperAdminDashboard(selectedPeriod);
      setDashboardData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
      showError('Dashboard Error', errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData(period);
  }, [period, fetchDashboardData]);

  const handlePeriodChange = (newPeriod: DashboardPeriod) => {
    setPeriod(newPeriod);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchDashboardData(period)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { summary, adminBalances, revenue, systemStatistics, recentActivity } = dashboardData;

  const stats = [
    {
      title: 'Total Revenue',
      value: summary.formattedTotalRevenue,
      subtitle: `${summary.totalRevenueTransactions} transactions`,
      icon: DollarSign,
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Total Admins',
      value: `${summary.totalAdmins}`,
      subtitle: `${summary.activeAdmins} active`,
      icon: Building2,
      color: 'from-sky-500 to-blue-600'
    },
    {
      title: 'Total Users',
      value: systemStatistics.totalUsers.toLocaleString(),
      subtitle: `${systemStatistics.pendingDeposits} pending deposits`,
      icon: Users,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Pending Transfers',
      value: `${summary.pendingTransfers}`,
      subtitle: 'Awaiting approval',
      icon: Activity,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Period Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h1>
            <p className="text-gray-600">Comprehensive overview of your platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {(['all', 'today', 'week', 'month'] as DashboardPeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    period === p
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetchDashboardData(period)}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              {stat.subtitle && (
                <p className="text-gray-500 text-xs mt-1">{stat.subtitle}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin Balances and System Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Balances */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-blue-600" />
            Admin Balances
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Main Wallet</p>
                <p className="text-xl font-bold text-blue-900">{adminBalances.formatted.totalMainWallet}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Benefit Wallet</p>
                <p className="text-xl font-bold text-green-900">{adminBalances.formatted.totalBenefitWallet}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Withdrawal Wallet</p>
                <p className="text-xl font-bold text-orange-900">{adminBalances.formatted.totalWithdrawalWallet}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                <p className="text-xl font-bold text-purple-900">{adminBalances.formatted.totalBalance}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Admins</span>
                <span className="font-semibold text-gray-900">{adminBalances.adminCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600">Active Admins</span>
                <span className="font-semibold text-green-600">{adminBalances.activeAdmins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-emerald-600" />
            System Statistics
          </h2>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700">Total Deposits</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-900">{systemStatistics.totalDeposits.formatted}</p>
                  <p className="text-xs text-gray-600">{systemStatistics.totalDeposits.count} transactions</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ArrowUpCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-700">Total Commissions</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-900">{systemStatistics.totalCommissions.formatted}</p>
                  <p className="text-xs text-gray-600">{systemStatistics.totalCommissions.count} transactions</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <ArrowDownCircle className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm text-gray-700">Total Withdrawals</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-900">{systemStatistics.totalWithdrawals.formatted}</p>
                  <p className="text-xs text-gray-600">{systemStatistics.totalWithdrawals.count} transactions</p>
                </div>
              </div>
              {systemStatistics.pendingDeposits > 0 && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                    <span className="text-sm text-gray-700">Pending Deposits</span>
                  </div>
                  <span className="font-bold text-amber-900">{systemStatistics.pendingDeposits}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
          Revenue Breakdown
        </h2>
        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900">{revenue.formattedTotal}</p>
          <p className="text-sm text-gray-600 mt-1">Total Revenue ({revenue.byType.reduce((sum, type) => sum + type.count, 0)} transactions)</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {revenue.byType.map((type, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1 capitalize">{type.type.replace(/_/g, ' ')}</p>
              <p className="text-xl font-bold text-gray-900">{type.formattedTotal}</p>
              <p className="text-xs text-gray-500 mt-1">{type.count} transactions</p>
            </div>
          ))}
        </div>
        {revenue.topAdmins.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Performing Admins</h3>
            <div className="space-y-2">
              {revenue.topAdmins.slice(0, 5).map((admin, index) => (
                <div key={admin.admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{admin.admin.name}</p>
                      <p className="text-xs text-gray-600">{admin.admin.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{admin.formattedTotalRevenue}</p>
                    <p className="text-xs text-gray-600">{admin.transactionCount} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity and Admin List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Revenue Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Recent Revenue Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.revenues.length > 0 ? (
              recentActivity.revenues.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.admin.name}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{activity.transferType.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{activity.formattedAmount}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Admin Wallets
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {adminBalances.admins.length > 0 ? (
              adminBalances.admins.map((admin) => (
                <div key={admin.id} className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{admin.name}</p>
                      <p className="text-xs text-gray-600">{admin.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Main</p>
                      <p className="text-sm font-semibold text-blue-900">{admin.wallets.mainWallet.formatted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Benefit</p>
                      <p className="text-sm font-semibold text-green-900">{admin.wallets.benefitWallet.formatted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total</p>
                      <p className="text-sm font-semibold text-purple-900">{admin.wallets.total.formatted}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No admins found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
