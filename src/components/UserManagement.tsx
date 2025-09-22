import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import { userService } from '../services/userService';
import { adminService } from '../services/adminService';
import { useToastContext } from '../contexts/ToastContext';
import { UserWithDetails, UserListParams, CreateAdminRequest } from '../types/api';
import { validateForm, VALIDATION_RULES } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';

const UserManagement: React.FC = () => {
  const { success, error: showError } = useToastContext();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    current: string | number;
    pages: number;
    total: number;
  }>({
    current: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState<UserListParams>({
    page: 1,
    limit: 10,
    role: '',
    search: ''
  });
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState<UserWithDetails | null>(null);
  const [createAdminData, setCreateAdminData] = useState<CreateAdminRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [createAdminLoading, setCreateAdminLoading] = useState(false);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(filters);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err: any) {
      showError('Failed to load users', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof UserListParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when changing other filters
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  // Get current page as number
  const getCurrentPage = () => {
    return typeof pagination.current === 'string' ? parseInt(pagination.current) : pagination.current;
  };

  // Create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAdminLoading(true);

    try {
      // Validate form
      const validation = validateForm(createAdminData, {
        firstName: VALIDATION_RULES.name,
        lastName: VALIDATION_RULES.name,
        email: VALIDATION_RULES.email,
        phone: VALIDATION_RULES.phone,
        password: VALIDATION_RULES.password,
      });

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        showError('Validation Error', firstError);
        return;
      }

      await adminService.createAdmin(createAdminData);
      success('Admin Created', 'New admin user has been created successfully');
      setShowCreateAdmin(false);
      setCreateAdminData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
      });
      loadUsers(); // Refresh the list
    } catch (err: any) {
      showError('Failed to create admin', err.message);
    } finally {
      setCreateAdminLoading(false);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Use _id if available, otherwise use id
      const actualId = userId.includes('_id') ? userId : userId;
      await userService.toggleUserStatus(actualId, currentStatus ? 'inactive' : 'active');
      success('Status Updated', `User has been ${currentStatus ? 'deactivated' : 'activated'}`);
      loadUsers();
    } catch (err: any) {
      showError('Failed to update status', err.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        // Use _id if available, otherwise use id
        const actualId = userId.includes('_id') ? userId : userId;
        await userService.deleteUser(actualId);
        success('User Deleted', `${userName} has been deleted successfully`);
        loadUsers();
      } catch (err: any) {
        showError('Failed to delete user', err.message);
      }
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/30 rounded-2xl p-6 border border-gray-200/50 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-gray-600 font-medium">Manage users and admins in your system</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowCreateAdmin(true)}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              <span className="font-semibold">Create Admin</span>
            </button>
            <button
              onClick={loadUsers}
              disabled={loading}
              className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-200`} />
              <span className="font-semibold">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Search Users</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name, email, or phone"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Filter by Role</label>
            <select
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
            >
              <option value="">All Roles</option>
              <option value="user">👤 User</option>
              <option value="admin">🛡️ Admin</option>
              <option value="super_admin">👑 Super Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Items per page</label>
            <select
              value={filters.limit || 10}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ page: 1, limit: 10, role: '', search: '' })}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner size="lg" text="Loading users..." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      👤 User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      🛡️ Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      📊 Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      🔑 Password
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      💰 Wallets
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      💵 Earnings
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      👥 Referrals
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      📅 Created
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ⚙️ Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200/30">
                  {users.map((user) => {
                    const userId = user._id || user.id;
                    return (
                      <tr key={userId} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-gray-600 truncate">{user.email}</div>
                              <div className="text-xs text-gray-500 truncate">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'super_admin' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300' :
                            user.role === 'admin' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' :
                            'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                          }`}>
                            {user.role === 'super_admin' ? '👑 SUPER ADMIN' :
                             user.role === 'admin' ? '🛡️ ADMIN' : '👤 USER'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                          }`}>
                            {user.isActive ? '✅ Active' : '❌ Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-mono text-xs bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1 rounded border border-gray-300">
                            {user.originalPassword || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {user.wallets ? (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                <span className="text-xs">M: {formatCurrency(user.wallets.mainWallet)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span className="text-xs">B: {formatCurrency(user.wallets.benefitWallet)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                <span className="text-xs">W: {formatCurrency(user.wallets.withdrawalWallet)}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-semibold text-green-600 text-xs">
                            {user.totalEarnings ? formatCurrency(user.totalEarnings) : '$0.00'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">👥</span>
                            <span className="font-semibold text-xs">{user.totalReferrals || 0}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-xs">
                            {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => setShowUserDetails(user)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-all duration-200 transform hover:scale-110"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(userId, user.isActive || false)}
                              className={`p-1.5 rounded-md transition-all duration-200 transform hover:scale-110 ${
                                user.isActive ? 'text-red-600 hover:text-red-800 hover:bg-red-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                              }`}
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {user.isActive ? '⏸️' : '▶️'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(userId, `${user.firstName} ${user.lastName}`)}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-all duration-200 transform hover:scale-110"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4 flex items-center justify-between border-t border-gray-200/50 sm:px-8">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(getCurrentPage() - 1)}
                    disabled={getCurrentPage() === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(getCurrentPage() + 1)}
                    disabled={getCurrentPage() === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                  >
                    Next →
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Showing{' '}
                      <span className="font-bold text-blue-600">{(getCurrentPage() - 1) * (filters.limit || 10) + 1}</span>
                      {' '}to{' '}
                      <span className="font-bold text-blue-600">
                        {Math.min(getCurrentPage() * (filters.limit || 10), pagination.total)}
                      </span>
                      {' '}of{' '}
                      <span className="font-bold text-blue-600">{pagination.total}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-xl shadow-lg -space-x-px">
                      <button
                        onClick={() => handlePageChange(getCurrentPage() - 1)}
                        disabled={getCurrentPage() === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-bold transition-all duration-200 transform hover:scale-105 ${
                              page === getCurrentPage()
                                ? 'z-10 bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(getCurrentPage() + 1)}
                        disabled={getCurrentPage() === pagination.pages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 bg-white text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm">
            <div className="mt-3">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Create New Admin</h3>
              </div>
              <form onSubmit={handleCreateAdmin} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={createAdminData.firstName}
                      onChange={(e) => setCreateAdminData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={createAdminData.lastName}
                      onChange={(e) => setCreateAdminData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={createAdminData.email}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={createAdminData.phone}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <input
                    type="password"
                    value={createAdminData.password}
                    onChange={(e) => setCreateAdminData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 hover:bg-white/80"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateAdmin(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAdminLoading}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                  >
                    {createAdminLoading ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm">
            <div className="mt-3">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">User Details</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 rounded-xl border border-gray-200/50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Personal Information</label>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Name:</span>
                      <p className="text-sm font-bold text-gray-900">{showUserDetails.firstName} {showUserDetails.lastName}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Email:</span>
                      <p className="text-sm text-gray-900">{showUserDetails.email}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Phone:</span>
                      <p className="text-sm text-gray-900">{showUserDetails.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🛡️ Account Details</label>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Role:</span>
                      <p className="text-sm font-bold text-gray-900">{showUserDetails.role}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Original Password:</span>
                      <p className="text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
                        {showUserDetails.originalPassword || 'N/A'}
                      </p>
                    </div>
                    {showUserDetails.referralCode && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Referral Code:</span>
                        <p className="text-sm font-bold text-gray-900">{showUserDetails.referralCode}</p>
                      </div>
                    )}
                  </div>
                </div>

                {showUserDetails.wallets && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Wallet Information</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Main Wallet:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(showUserDetails.wallets.mainWallet)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Benefit Wallet:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(showUserDetails.wallets.benefitWallet)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Withdrawal Wallet:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(showUserDetails.wallets.withdrawalWallet)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {showUserDetails.referredBy && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-4 rounded-xl border border-purple-200/50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">👥 Referral Information</label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Referred By:</span>
                        <p className="text-sm font-bold text-gray-900">
                          {showUserDetails.referredBy.firstName} {showUserDetails.referredBy.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{showUserDetails.referredBy.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-6">
                <button
                  onClick={() => setShowUserDetails(null)}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
