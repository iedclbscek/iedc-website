import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaClipboardList, 
  FaDownload,
  FaChartLine,
  FaBell
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const IicDashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalResponses: 0,
    recentRegistrations: 0,
    recentResponses: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch registration stats
      const regResponse = await fetch('/api/registrations');
      if (regResponse.ok) {
        const registrations = await regResponse.json();
        setStats(prev => ({
          ...prev,
          totalRegistrations: registrations.length,
          recentRegistrations: registrations.filter(reg => {
            const regDate = new Date(reg.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return regDate >= weekAgo;
          }).length
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: FaUsers,
      color: 'bg-blue-500',
      description: 'Total IIC member registrations'
    },
    {
      title: 'Total Responses',
      value: stats.totalResponses,
      icon: FaClipboardList,
      color: 'bg-green-500',
      description: 'Total execom call responses'
    },
    {
      title: 'Recent Registrations',
      value: stats.recentRegistrations,
      icon: FaChartLine,
      color: 'bg-purple-500',
      description: 'Registrations in last 7 days'
    },
    {
      title: 'Recent Responses',
      value: stats.recentResponses,
      icon: FaBell,
      color: 'bg-orange-500',
      description: 'Responses in last 7 days'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent via-accent-dark to-primary rounded-lg p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-accent-light text-lg">
              Manage IIC registrations and execom call responses. View member details and export data as needed.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p className="text-sm text-gray-500">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="group p-6 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
            onClick={() => window.location.href = '/dashboard/iic-registrations'}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <FaUsers className="h-8 w-8 text-accent group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent">View Registrations</h3>
                <p className="text-gray-600">Access IIC member registrations with limited details</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="group p-6 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
            onClick={() => window.location.href = '/dashboard/iic-execom-responses'}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <FaClipboardList className="h-8 w-8 text-accent group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent">Execom Responses</h3>
                <p className="text-gray-600">View execom call responses and details</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Access Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Data</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FaUsers className="h-4 w-4 text-green-500 mr-2" />
                Member names and contact information
              </li>
              <li className="flex items-center">
                <FaUsers className="h-4 w-4 text-green-500 mr-2" />
                Department and semester details
              </li>
              <li className="flex items-center">
                <FaUsers className="h-4 w-4 text-green-500 mr-2" />
                Registration dates and status
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Export Options</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FaDownload className="h-4 w-4 text-blue-500 mr-2" />
                CSV export for registrations
              </li>
              <li className="flex items-center">
                <FaDownload className="h-4 w-4 text-blue-500 mr-2" />
                CSV export for responses
              </li>
              <li className="flex items-center">
                <FaDownload className="h-4 w-4 text-blue-500 mr-2" />
                Filtered data exports
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IicDashboardHome;


