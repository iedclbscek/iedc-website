import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

const IicExecomCallResponses = () => {
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  useEffect(() => {
    fetchResponses();
  }, []);

  useEffect(() => {
    filterResponses();
  }, [responses, searchTerm, departmentFilter, semesterFilter]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      // Remove the view=iic parameter since the backend now automatically handles role-based filtering
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/registrations/execom-call-responses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResponses(data.data || []);
      } else {
        console.error('Failed to fetch execom call responses');
      }
    } catch (error) {
      console.error('Error fetching execom call responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResponses = () => {
    let filtered = responses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resp => 
        (resp.firstName && resp.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resp.lastName && resp.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resp.email && resp.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply department filter
    if (departmentFilter) {
      filtered = filtered.filter(resp => resp.department === departmentFilter);
    }

    // Apply semester filter
    if (semesterFilter) {
      filtered = filtered.filter(resp => resp.semester === semesterFilter);
    }

    setFilteredResponses(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Department', 'Semester', 'Response Date'];
    const csvData = filteredResponses.map(resp => [
      `${resp.firstName || ''} ${resp.lastName || ''}`.trim(),
      resp.phone || '',
      resp.email || '',
      resp.department || '',
      resp.semester || '',
      new Date(resp.submittedAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iic_execom_responses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const departments = [
    'Computer Science and Engineering',
    'Computer Science and Business Systems',
    'Computer Science and Engineering(AI & Data Science)',
    'Electrical and Electronics Engineering',
    'Electronics and Communication Engineering',
    'Information Technology',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const semesters = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IIC Execom Call Responses</h1>
            <p className="text-gray-600">View and manage IIC execom call responses</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaDownload className="mr-2" />
              Export CSV
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center px-4 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              {filteredResponses.length} responses
            </span>
          </div>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResponses.map((response, index) => (
                <motion.tr
                  key={response.membershipId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {`${response.firstName || ''} ${response.lastName || ''}`.trim()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{response.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{response.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{response.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{response.semester}</div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredResponses.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No responses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IicExecomCallResponses;


