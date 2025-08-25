
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Import icons for dashboard
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaClipboardList,
  FaUser
} from 'react-icons/fa';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import RegistrationManagement from '../components/admin/RegistrationManagement';
import IicRegistrationView from '../components/admin/IicRegistrationView';
import IicExecomCallResponses from '../components/admin/IicExecomCallResponses';
import IicDashboardHome from '../components/admin/IicDashboardHome';

// Add placeholder import
const ExecomCallResponsesPage = React.lazy(() => import('../components/admin/ExecomCallResponsesPage'));

// Dashboard Home Component
const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    activeRegistrations: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    // Fetch actual stats from API
    setStats({
      totalMembers: 156,
      totalEvents: 24,
      activeRegistrations: 89,
      pendingApprovals: 12
    });
  }, []);

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: FaCalendarAlt,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Active Registrations',
      value: stats.activeRegistrations,
      icon: FaChartLine,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: FaBell,
      color: 'bg-orange-500',
      change: '-3%',
      changeType: 'decrease'
    }
  ];

     return (
     <div className="space-y-3 p-4 lg:p-6 h-full">
       {/* Welcome Section */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-gradient-to-r from-accent via-accent-dark to-primary rounded-lg p-4 lg:p-6 text-white shadow-lg"
       >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-accent-light text-lg">
              Here's what's happening with IEDC today. Manage your team, events, and registrations.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <FaUsers className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

             {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.color} text-white shadow-lg`}>
                <stat.icon className="h-7 w-7" />
              </div>
            </div>
            <div className="flex items-center">
              {stat.changeType === 'increase' ? (
                <FaArrowUp className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <FaArrowDown className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className={`text-sm font-semibold ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/team')}
            className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
              <FaUsers className="h-8 w-8 text-accent group-hover:text-white" />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-accent">Manage Team</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/registrations')}
            className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
              <FaClipboardList className="h-8 w-8 text-accent group-hover:text-white" />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-accent">View Registrations</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/events')}
            className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
              <FaCalendarAlt className="h-8 w-8 text-accent group-hover:text-white" />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-accent">Create Event</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/execom-call-responses')}
            className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
              <FaClipboardList className="h-8 w-8 text-accent group-hover:text-white" />
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-accent">Execom Call Responses</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New member registration', time: '2 minutes ago', type: 'registration', icon: FaUsers },
            { action: 'Event "Tech Workshop" created', time: '1 hour ago', type: 'event', icon: FaCalendarAlt },
            { action: 'Team member profile updated', time: '3 hours ago', type: 'profile', icon: FaUser },
            { action: 'Monthly report generated', time: '1 day ago', type: 'report', icon: FaChartLine }
          ].map((activity, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  activity.type === 'registration' ? 'bg-green-100 text-green-600' :
                  activity.type === 'event' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'profile' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{activity.action}</span>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      activity.type === 'registration' ? 'bg-green-500' :
                      activity.type === 'event' ? 'bg-blue-500' :
                      activity.type === 'profile' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Placeholder components for other dashboard routes
const EventsManagement = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Events Management</h2>
    <p className="text-gray-600">Events management functionality coming soon...</p>
  </div>
);

const TeamManagement = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Management</h2>
    <p className="text-gray-600">Team management functionality coming soon...</p>
  </div>
);

const ProfilePage = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
    <p className="text-gray-600">Profile management functionality coming soon...</p>
  </div>
);

const SettingsPage = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
    <p className="text-gray-600">Settings functionality coming soon...</p>
  </div>
);

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/registrations" element={<RegistrationManagement />} />
        <Route path="/events" element={<EventsManagement />} />
        <Route path="/team" element={<TeamManagement />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/execom-call-responses" element={<React.Suspense fallback={<div>Loading...</div>}><ExecomCallResponsesPage /></React.Suspense>} />
        
        {/* IIC Admin Routes */}
        <Route path="/iic-registrations" element={<IicRegistrationView />} />
        <Route path="/iic-execom-responses" element={<IicExecomCallResponses />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;