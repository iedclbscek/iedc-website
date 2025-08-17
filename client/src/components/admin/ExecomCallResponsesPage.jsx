import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExecomCallStats from './ExecomCallStats';

// Import the configured axios instance from AuthContext
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

const ExecomCallResponsesPage = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated) {
      setError('Please log in to access this page.');
      setLoading(false);
      return;
    }

    if (user?.role !== 'admin') {
      setError('You need admin privileges to access this page.');
      setLoading(false);
      return;
    }

    const fetchResponses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/registrations/execom-call-responses');
        setResponses(res.data.data);
      } catch (err) {
        console.error('Error fetching responses:', err);
        if (err.response?.status === 401) {
          setError('You are not authorized. Please log in as an admin.');
        } else if (err.response?.status === 403) {
          setError('Access denied. You need admin privileges.');
        } else {
          setError('Failed to fetch responses. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [isAuthenticated, user]);

  // Filter and search logic
  const filteredResponses = responses.filter(resp => {
    const matchesSearch = searchTerm === '' || 
      resp.membershipId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || resp.department === filterDepartment;
    const matchesStatus = filterStatus === '' || resp.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Action functions
  const handleExport = () => {
    const csvContent = [
      ['Membership ID', 'Name', 'Email', 'Department', 'Submitted At', 'Q1', 'Q2', 'Q3', 'Motivation', 'Role', 'Skills', 'Experience', 'Area', 'Time', 'Vision'],
      ...filteredResponses.map(resp => [
        resp.membershipId,
        resp.firstName || '',
        resp.email || '',
        resp.department || '',
        resp.submittedAt ? new Date(resp.submittedAt).toLocaleString() : '',
        resp.q1 || '',
        resp.q2 || '',
        resp.q3 || '',
        resp.motivation || '',
        resp.role || '',
        resp.skills || '',
        resp.experience || '',
        resp.area || '',
        resp.time || '',
        resp.vision || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execom-call-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleApprove = async (membershipId) => {
    try {
      await api.put(`/registrations/execom-call/${membershipId}/approve`);
      // Refresh the data
      const res = await api.get('/registrations/execom-call-responses');
      setResponses(res.data.data);
    } catch (err) {
      console.error('Error approving response:', err);
    }
  };

  const handleReject = async (membershipId) => {
    try {
      await api.put(`/registrations/execom-call/${membershipId}/reject`);
      // Refresh the data
      const res = await api.get('/registrations/execom-call-responses');
      setResponses(res.data.data);
    } catch (err) {
      console.error('Error rejecting response:', err);
    }
  };

  const handleDelete = async (membershipId) => {
    if (window.confirm('Are you sure you want to delete this response? This action cannot be undone.')) {
      try {
        await api.delete(`/registrations/execom-call/${membershipId}`);
        // Refresh the data
        const res = await api.get('/registrations/execom-call-responses');
        setResponses(res.data.data);
      } catch (err) {
        console.error('Error deleting response:', err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Authentication Required:</strong> Please log in to access this page.
          <button 
            onClick={() => navigate('/login')}
            className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Access Denied:</strong> You need admin privileges to view Execom Call responses.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Execom Call Response Stats */}
      <ExecomCallStats />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Execom Call Responses</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="Computer Science and Engineering">CSE</option>
              <option value="Computer Science and Business Systems">CSBS</option>
              <option value="Computer Science and Engineering(AI & Data Science)">CSE(AI & DS)</option>
              <option value="Electrical and Electronics Engineering">EEE</option>
              <option value="Electronics and Communication Engineering">ECE</option>
              <option value="Information Technology">IT</option>
              <option value="Mechanical Engineering">ME</option>
              <option value="Civil Engineering">CE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('');
                setFilterStatus('');
              }}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading responses...</div>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {!loading && !error && filteredResponses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {responses.length === 0 ? 'No Execom Call responses found.' : 'No responses match your filters.'}
        </div>
      )}
      {!loading && !error && filteredResponses.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <p className="text-sm text-gray-600">
              Showing {filteredResponses.length} of {responses.length} responses
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.map((resp, idx) => (
                  <tr key={resp._id || idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{resp.membershipId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{resp.firstName || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{resp.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{resp.department || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{resp.submittedAt ? new Date(resp.submittedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        resp.status === 'approved' ? 'bg-green-100 text-green-800' :
                        resp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {resp.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 underline"
                          onClick={() => setSelected(resp)}
                        >
                          View
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleApprove(resp.membershipId)}
                          title="Approve"
                        >
                          ✅
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleReject(resp.membershipId)}
                          title="Reject"
                        >
                          ❌
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleDelete(resp.membershipId)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Enhanced Modal for details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Execom Call Response</h2>
                  <p className="text-blue-100">Detailed application information</p>
                </div>
                <button 
                  className="text-white hover:text-gray-200 text-2xl font-bold p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                  onClick={() => setSelected(null)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-blue-600 mr-2">👤</span>
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Membership ID:</span>
                      <span className="font-bold text-gray-900 bg-blue-100 px-3 py-1 rounded-full text-sm">
                        {selected.membershipId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="font-semibold text-gray-900">{selected.firstName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="font-semibold text-gray-900 text-sm break-all">{selected.email || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Department:</span>
                      <span className="font-semibold text-gray-900">{selected.department || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Submitted:</span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {selected.submittedAt ? new Date(selected.submittedAt).toLocaleString() : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-green-600 mr-2">🏛️</span>
                    Club Affiliation
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Currently in other clubs?</span>
                      <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                        selected.q1 === 'Yes' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selected.q1 || '-'}
                      </span>
                    </div>
                    {selected.q1 === 'Yes' && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Willing to step down?</span>
                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          selected.q2 === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selected.q2 || '-'}
                        </span>
                      </div>
                    )}
                    {(selected.q1 === 'No' || (selected.q1 === 'Yes' && selected.q2 === 'Yes')) && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Agree to removal?</span>
                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                          selected.q3 === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selected.q3 || '-'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Motivation & Skills Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-purple-600 mr-2">💡</span>
                  Motivation & Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Motivation</h4>
                    <p className="text-gray-800 bg-white p-3 rounded border-l-4 border-purple-500">
                      {selected.motivation || 'No motivation provided'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Role in Innovation</h4>
                    <p className="text-gray-800 bg-white p-3 rounded border-l-4 border-blue-500">
                      {selected.role || 'No role specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Experience & Preferences Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-orange-600 mr-2">🎯</span>
                    Experience & Skills
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Skills/Qualities</h4>
                      <p className="text-gray-800 bg-white p-3 rounded border-l-4 border-orange-500">
                        {selected.skills || 'No skills specified'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
                      <p className="text-gray-800 bg-white p-3 rounded border-l-4 border-green-500">
                        {selected.experience || 'No experience specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-indigo-600 mr-2">⚡</span>
                    Preferences & Vision
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Preferred Area</h4>
                      <p className="text-gray-800 bg-white p-3 rounded border-l-4 border-indigo-500">
                        {selected.area || 'No area specified'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Time Commitment</h4>
                      <p className="text-gray-800 bg-white p-3 rounded border-l-4 border-pink-500">
                        {selected.time || 'No time commitment specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-red-600 mr-2">🚀</span>
                  Vision & Goals
                </h3>
                <p className="text-gray-800 bg-white p-4 rounded border-l-4 border-red-500 leading-relaxed">
                  {selected.vision || 'No vision statement provided'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    onClick={() => handleApprove(selected.membershipId)}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    onClick={() => handleReject(selected.membershipId)}
                  >
                    ❌ Reject
                  </button>
                </div>
                <button 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  onClick={() => setSelected(null)}
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

export default ExecomCallResponsesPage;


