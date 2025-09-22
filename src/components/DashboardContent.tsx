import React from 'react';
import { Users, Activity, DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-sky-500 to-blue-600'
    },
    {
      title: 'Active Sessions',
      value: '1,429',
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Revenue',
      value: '$45,290',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Growth Rate',
      value: '23.1%',
      change: '-2.4%',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Logged in', time: '2 minutes ago', type: 'login' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '5 minutes ago', type: 'update' },
    { id: 3, user: 'Mike Johnson', action: 'Made a purchase', time: '12 minutes ago', type: 'purchase' },
    { id: 4, user: 'Sarah Wilson', action: 'Created account', time: '25 minutes ago', type: 'signup' },
    { id: 5, user: 'Tom Brown', action: 'Reset password', time: '1 hour ago', type: 'security' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'login' ? 'bg-sky-500' :
                  activity.type === 'update' ? 'bg-emerald-500' :
                  activity.type === 'purchase' ? 'bg-amber-500' :
                  activity.type === 'signup' ? 'bg-purple-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.user}</p>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                </div>
                <p className="text-gray-500 text-xs">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 text-left rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 border border-sky-200 transition-all duration-200">
              <h3 className="font-semibold text-sky-800">Add New User</h3>
              <p className="text-sky-600 text-sm">Create a new user account</p>
            </button>
            <button className="w-full p-4 text-left rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 transition-all duration-200">
              <h3 className="font-semibold text-emerald-800">Generate Report</h3>
              <p className="text-emerald-600 text-sm">Create analytics report</p>
            </button>
            <button className="w-full p-4 text-left rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 transition-all duration-200">
              <h3 className="font-semibold text-amber-800">System Settings</h3>
              <p className="text-amber-600 text-sm">Configure system preferences</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;