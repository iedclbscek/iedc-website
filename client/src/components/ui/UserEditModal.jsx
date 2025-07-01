import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTimes, FaSave, FaKey } from 'react-icons/fa';
import axios from 'axios';

const UserEditModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    teamRole: '',
    department: '',
    year: '',
    phoneNumber: '',
    linkedin: '',
    github: '',
    bio: '',
    teamYears: [],
    yearlyRoles: [],
    isActive: true,
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'nodal_officer', label: 'Nodal Officer' },
    { value: 'ceo', label: 'CEO' },
    { value: 'lead', label: 'Lead' },
    { value: 'co_lead', label: 'Co-Lead' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'member', label: 'Member' }
  ];

  const departments = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Other'
  ];

  // Generate team years (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear();
  const teamYears = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    teamYears.push(year);
  }

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'member',
        teamRole: user.teamRole || '',
        department: user.department || '',
        year: user.year || '',
        phoneNumber: user.phoneNumber || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        bio: user.bio || '',
        teamYears: user.teamYears || [],
        yearlyRoles: user.yearlyRoles || [],
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
      setNewPassword('');
      setShowPasswordReset(false);
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTeamYearToggle = (year) => {
    setFormData(prev => {
      const newTeamYears = prev.teamYears.includes(year)
        ? prev.teamYears.filter(y => y !== year)
        : [...prev.teamYears, year];
      
      // Update yearly roles accordingly
      const newYearlyRoles = prev.yearlyRoles.filter(yr => newTeamYears.includes(yr.year));
      
      // Add default role for new years
      newTeamYears.forEach(year => {
        if (!newYearlyRoles.find(yr => yr.year === year)) {
          newYearlyRoles.push({
            year: year,
            role: 'member',
            teamRole: '',
            order: 0
          });
        }
      });
      
      return {
        ...prev,
        teamYears: newTeamYears,
        yearlyRoles: newYearlyRoles
      };
    });
  };

  const handleYearlyRoleChange = (year, field, value) => {
    setFormData(prev => ({
      ...prev,
      yearlyRoles: prev.yearlyRoles.map(yr => 
        yr.year === year 
          ? { ...yr, [field]: value }
          : yr
      )
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'teamYears' || key === 'yearlyRoles') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append profile picture if selected
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/admin-edit`,
        formDataToSend,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('User updated successfully!');
        onUpdate(response.data.user);
        onClose();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/reset-password-admin`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Password reset successfully!');
        setNewPassword('');
        setShowPasswordReset(false);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Edit User: {user?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Team Role</label>
              <input
                type="text"
                name="teamRole"
                value={formData.teamRole}
                onChange={handleInputChange}
                placeholder="e.g., Technical Lead, Marketing Head"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Academic Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active User</span>
            </label>
          </div>

          {/* Team Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Team Years</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {teamYears.map(year => (
                <label key={year} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.teamYears.includes(year)}
                    onChange={() => handleTeamYearToggle(year)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{year}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Yearly Roles */}
          {formData.teamYears.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Yearly Roles</label>
              <div className="space-y-4">
                {formData.teamYears.sort().map(year => {
                  const yearlyRole = formData.yearlyRoles.find(yr => yr.year === year) || {};
                  return (
                    <div key={year} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">{year}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                          <select
                            value={yearlyRole.role || 'member'}
                            onChange={(e) => handleYearlyRoleChange(year, 'role', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            {roles.map(role => (
                              <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Team Role</label>
                          <input
                            type="text"
                            value={yearlyRole.teamRole || ''}
                            onChange={(e) => handleYearlyRoleChange(year, 'teamRole', e.target.value)}
                            placeholder="e.g., Technical Lead"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Password Reset Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Password Management</h4>
              <button
                type="button"
                onClick={() => setShowPasswordReset(!showPasswordReset)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaKey className="mr-2" />
                {showPasswordReset ? 'Cancel' : 'Reset Password'}
              </button>
            </div>

            {showPasswordReset && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={loading || !newPassword}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
