import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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

const ExecomCallStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/registrations/execom-call-responses');
        const data = response.data.data || [];
        
        // Calculate statistics
        const total = data.length;
        const pending = data.filter(item => item.status === 'pending').length;
        const approved = data.filter(item => item.status === 'approved').length;
        const rejected = data.filter(item => item.status === 'rejected').length;
        
        setStats({ total, pending, approved, rejected });
      } catch (err) {
        console.error('Error fetching Execom Call stats:', err);
        setError('Failed to fetch Execom Call statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded-full w-12 ml-auto mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total',
      count: stats.total,
      icon: '👥',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Pending',
      count: stats.pending,
      icon: '⏳',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Approved',
      count: stats.approved,
      icon: '✅',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Rejected',
      count: stats.rejected,
      icon: '❌',
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
            </div>
            <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExecomCallStats;
