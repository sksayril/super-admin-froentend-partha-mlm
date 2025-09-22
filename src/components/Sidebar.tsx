import React from 'react';
import { Home, Users, Settings, LogOut, Menu, BarChart3, Bell, Shield, ChevronLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onLogout
}) => {
  const { user } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { id: 'users', icon: Users, label: 'Users', color: 'from-emerald-500 to-emerald-600' },
    { id: 'payment-requests', icon: CreditCard, label: 'Payment Requests', color: 'from-amber-500 to-amber-600' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'from-purple-500 to-purple-600' },
    { id: 'notifications', icon: Bell, label: 'Notifications', color: 'from-orange-500 to-orange-600' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600' },
  ];

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'AD';
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Admin User';
  };

  const getUserEmail = () => {
    return user?.email || 'admin@demo.com';
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/50 shadow-2xl backdrop-blur-sm transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'} z-50`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">Super Admin</h1>
              <p className="text-xs text-gray-500 font-medium">Control Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105"
        >
          {collapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/25`
                  : 'text-gray-600 hover:bg-white/80 hover:shadow-md hover:border hover:border-gray-200/50'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-white/20' : 'group-hover:bg-gray-100'
              }`}>
                <Icon className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
              </div>
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
        {!collapsed && (
          <div className="flex items-center space-x-3 mb-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200/50 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{getUserName()}</p>
              <p className="text-xs text-gray-500 truncate">{getUserEmail()}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onLogout}
          className={`group w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50/80 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <div className="p-1 rounded-lg group-hover:bg-red-100 transition-all duration-200">
            <LogOut className="w-5 h-5" />
          </div>
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;