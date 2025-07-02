import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TeamManagement from '../components/TeamManagement';
import EventsManagementPage from './EventsManagementPage';
import ProfilePage from './ProfilePage';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
  };

  const canManageTeam = user?.role === 'admin' || user?.role === 'nodal_officer';

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'events', name: 'Events', icon: '📅' },
    ...(canManageTeam ? [{ id: 'team', name: 'Team Management', icon: '👥' }] : []),
    { id: 'profile', name: 'Profile', icon: '👤' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to IEDC Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                Hello {user?.name}! You are logged in as a {user?.role}.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Role</h3>
                  <p className="text-blue-700 capitalize">{user?.role?.replace('_', ' ')}</p>
                  {user?.teamRole && (
                    <p className="text-blue-600 text-sm mt-1">{user.teamRole}</p>
                  )}
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Department</h3>
                  <p className="text-green-700">{user?.department || 'Not specified'}</p>
                  {user?.year && (
                    <p className="text-green-600 text-sm mt-1">Year {user.year}</p>
                  )}
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Team Year</h3>
                  <p className="text-purple-700">{user?.teamYear || '2025'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  🏠 Back to Website
                </a>
                
                {canManageTeam && (
                  <button
                    onClick={() => setActiveTab('team')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    👥 Manage Team
                  </button>
                )}
                
                <button
                  onClick={() => setActiveTab('events')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  📅 Manage Events
                </button>
                
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'events':
        return <EventsManagementPage />;
      
      case 'team':
        return canManageTeam ? <TeamManagement /> : null;
      
      case 'profile':
        return <ProfilePage />;
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 sm:px-0">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
