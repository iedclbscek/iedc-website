import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardStats from './DashboardStats';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminDashboard = () => {
  const [overviewStats, setOverviewStats] = useState({
    totalRegistrations: 0,
    totalEvents: 0,
    totalUsers: 0,
    totalCommunities: 0
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch multiple data sources
        const [registrationsRes, eventsRes, usersRes] = await Promise.all([
          api.get('/registrations'),
          api.get('/events'),
          api.get('/users')
        ]);

        const registrations = registrationsRes.data.data || [];
        const events = eventsRes.data.data || [];
        const users = usersRes.data.data || [];

        setOverviewStats({
          totalRegistrations: registrations.length,
          totalEvents: events.length,
          totalUsers: users.length,
          totalCommunities: 8 // Hardcoded for now, can be made dynamic
        });

        // Get recent registrations (last 5)
        setRecentRegistrations(registrations.slice(0, 5));
        
        // Get recent events (last 5)
        setRecentEvents(events.slice(0, 5));

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Access Denied:</strong> You need admin privileges to access this dashboard.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      label: 'Total Registrations',
      count: overviewStats.totalRegistrations,
      icon: '📝',
      color: 'bg-blue-500',
      description: 'All member registrations'
    },
    {
      label: 'Total Events',
      count: overviewStats.totalEvents,
      icon: '🎉',
      color: 'bg-green-500',
      description: 'All IEDC events'
    },
    {
      label: 'Total Users',
      count: overviewStats.totalUsers,
      icon: '👥',
      color: 'bg-purple-500',
      description: 'Registered users'
    },
    {
      label: 'Communities',
      count: overviewStats.totalCommunities,
      icon: '🏛️',
      color: 'bg-orange-500',
      description: 'IEDC communities'
    }
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your IEDC system.</p>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {overviewCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.count}</p>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Execom Call Responses Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Execom Call Responses</h2>
        <DashboardStats />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
          {recentRegistrations.length > 0 ? (
            <div className="space-y-3">
              {recentRegistrations.map((reg, index) => (
                <div key={reg._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{reg.firstName} {reg.lastName}</p>
                    <p className="text-sm text-gray-600">{reg.email}</p>
                    <p className="text-xs text-gray-500">{reg.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{reg.membershipId}</p>
                    <p className="text-xs text-gray-500">
                      {reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent registrations</p>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
          {recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event, index) => (
                <div key={event._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.description?.substring(0, 50)}...</p>
                    <p className="text-xs text-gray-500">{event.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent events</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm font-medium text-blue-900">View Registrations</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-sm font-medium text-green-900">Manage Events</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm font-medium text-purple-900">User Management</p>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-orange-900">Export Data</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
