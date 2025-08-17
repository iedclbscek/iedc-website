import React from 'react';

const DashboardDemo = () => {
  // Demo data - replace with real data from your API
  const demoStats = {
    total: 204,
    pending: 10,
    approved: 0,
    rejected: 0
  };

  const statCards = [
    {
      label: 'Total',
      count: demoStats.total,
      icon: '👥',
      color: 'bg-blue-500',
      description: 'Total Execom Call Responses'
    },
    {
      label: 'Pending',
      count: demoStats.pending,
      icon: '⏳',
      color: 'bg-yellow-500',
      description: 'Responses awaiting review'
    },
    {
      label: 'Approved',
      count: demoStats.approved,
      icon: '✅',
      color: 'bg-green-500',
      description: 'Approved responses'
    },
    {
      label: 'Rejected',
      count: demoStats.rejected,
      icon: '❌',
      color: 'bg-red-500',
      description: 'Rejected responses'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IEDC Admin Dashboard</h1>
        <p className="text-gray-600">Execom Call Response Management</p>
      </div>

      {/* Stats Cards - Similar to your image */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📝</span>
                <span className="font-medium text-blue-900">Review Pending Responses</span>
              </div>
            </button>
            <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">📊</span>
                <span className="font-medium text-green-900">Export Data</span>
              </div>
            </button>
            <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <div className="flex items-center">
                <span className="text-xl mr-3">⚙️</span>
                <span className="font-medium text-purple-900">Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New response submitted</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Response approved</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Response pending review</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{demoStats.total}</p>
            <p className="text-sm text-blue-800">Total Responses</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{demoStats.pending}</p>
            <p className="text-sm text-yellow-800">Need Review</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{demoStats.approved}</p>
            <p className="text-sm text-green-800">Approved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemo;
