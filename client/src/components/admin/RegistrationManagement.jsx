import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaDownload,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendarAlt
} from 'react-icons/fa';
import { fetchRegistrations, updateRegistrationStatus, deleteRegistration } from '../../services/adminService';
import toast from 'react-hot-toast';

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await fetchRegistrations();
      setRegistrations(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateRegistrationStatus(id, newStatus);
      toast.success(`Registration ${newStatus} successfully`);
      loadRegistrations(); // Reload data
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await deleteRegistration(id);
        toast.success('Registration deleted successfully');
        loadRegistrations(); // Reload data
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.membershipId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = [
      'Name', 'Membership ID', 'Email', 'Phone', 'Department', 'Year', 'Semester', 'Status', 'Applied Date'
    ];
    
         const csvData = filteredRegistrations.map(reg => [
       `${reg.firstName} ${reg.lastName}`,
       reg.membershipId || 'N/A',
       reg.email,
       reg.phone,
       reg.department,
       reg.yearOfJoining,
       reg.semester,
       reg.status || 'pending',
       new Date(reg.createdAt).toLocaleDateString()
     ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'iedc-registrations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-accent to-accent-dark rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Registration Management</h1>
        <p className="text-accent-light">
          Manage and review all IEDC member registrations
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                             <input
                 type="text"
                 placeholder="Search by name, email, admission number, or membership ID..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
               />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total', value: registrations.length, color: 'bg-blue-500' },
          { label: 'Pending', value: registrations.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Approved', value: registrations.filter(r => r.status === 'approved').length, color: 'bg-green-500' },
          { label: 'Rejected', value: registrations.filter(r => r.status === 'rejected').length, color: 'bg-red-500' }
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <FaUser className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Registrations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membership ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.firstName} {registration.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.admissionNo || 'No Admission No'}
                        </div>
                      </div>
                    </div>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900 font-mono">
                       {registration.membershipId || 'N/A'}
                     </div>
                     <div className="text-sm text-gray-500">
                       {registration.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}
                     </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{registration.email}</div>
                    <div className="text-sm text-gray-500">{registration.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{registration.department}</div>
                    <div className="text-sm text-gray-500">
                      {registration.yearOfJoining} - {registration.semester}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                      registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowModal(true);
                        }}
                        className="text-accent hover:text-accent-dark transition-colors"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      
                      {registration.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(registration._id, 'approved')}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Approve"
                        >
                          <FaCheck className="h-4 w-4" />
                        </button>
                      )}
                      
                      {registration.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Reject"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(registration._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <FaUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No registrations have been submitted yet.'
              }
            </p>
          </div>
        )}
      </motion.div>

      {/* Registration Detail Modal */}
      {showModal && selectedRegistration && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Registration Details
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Personal Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.phone}</p>
                        </div>
                                                 <div>
                           <label className="block text-sm font-medium text-gray-700">Admission No</label>
                           <p className="text-sm text-gray-900">{selectedRegistration.admissionNo || 'Not provided'}</p>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700">Membership ID</label>
                           <p className="text-sm text-gray-900 font-mono">{selectedRegistration.membershipId || 'Not provided'}</p>
                         </div>
                      </div>

                      {/* Academic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Department</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.department}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Year of Joining</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.yearOfJoining}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Semester</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.semester}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.status || 'pending'}</p>
                        </div>
                      </div>

                      {/* Interests */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Technical Interests</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedRegistration.interests?.map((interest, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-white">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Non-technical Interests */}
                      {selectedRegistration.nonTechInterests && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Non-Technical Interests</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.nonTechInterests}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {selectedRegistration.experience && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Experience</label>
                          <p className="text-sm text-gray-900">{selectedRegistration.experience}</p>
                        </div>
                      )}

                      {/* Motivation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Motivation</label>
                        <p className="text-sm text-gray-900">{selectedRegistration.motivation}</p>
                      </div>

                      {/* Online Profiles */}
                      {(selectedRegistration.linkedin || selectedRegistration.github || selectedRegistration.portfolio) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Online Profiles</label>
                          <div className="space-y-1 mt-1">
                            {selectedRegistration.linkedin && (
                              <a href={selectedRegistration.linkedin} target="_blank" rel="noopener noreferrer" className="block text-sm text-accent hover:underline">
                                LinkedIn Profile
                              </a>
                            )}
                            {selectedRegistration.github && (
                              <a href={selectedRegistration.github} target="_blank" rel="noopener noreferrer" className="block text-sm text-accent hover:underline">
                                GitHub Profile
                              </a>
                            )}
                            {selectedRegistration.portfolio && (
                              <a href={selectedRegistration.portfolio} target="_blank" rel="noopener noreferrer" className="block text-sm text-accent hover:underline">
                                Portfolio Website
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-accent text-base font-medium text-white hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:ml-3 sm:w-auto sm:text-sm"
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

export default RegistrationManagement;
