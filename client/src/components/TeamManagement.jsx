import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import axios from 'axios';

const TeamManagement = () => {
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Add year filter
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'member',
    teamRole: '',
    department: '',
    year: '',
    phoneNumber: '',
    linkedin: '',
    github: '',
    teamYears: [new Date().getFullYear()], // Default to current year
    yearlyRoles: {} // Object with year as key and {role, teamRole} as value
  });
  const [showInviteForm, setShowInviteForm] = useState(false);

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
    'Computer Science',
    'Electronics',
    'Electrical',
    'Mechanical',
    'Civil',
    'Other'
  ];

  // Generate team years (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear();
  const teamYears = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    teamYears.push(year);
  }

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Initialize yearly roles when component mounts
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setInviteForm(prev => ({
      ...prev,
      yearlyRoles: {
        [currentYear]: { role: 'member', teamRole: '' }
      }
    }));
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter out admin users from team management display
        const nonAdminUsers = response.data.users.filter(user => user.role !== 'admin');
        setTeamMembers(nonAdminUsers);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to fetch team members');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInviteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamYearToggle = (year) => {
    setInviteForm(prev => {
      const newTeamYears = prev.teamYears.includes(year)
        ? prev.teamYears.filter(y => y !== year)
        : [...prev.teamYears, year];
      
      // Remove role for unchecked years, add default role for new years
      const newYearlyRoles = { ...prev.yearlyRoles };
      if (!newTeamYears.includes(year)) {
        delete newYearlyRoles[year];
      } else if (!prev.teamYears.includes(year)) {
        // New year added, set default role
        newYearlyRoles[year] = { role: 'member', teamRole: '' };
      }
      
      return {
        ...prev,
        teamYears: newTeamYears,
        yearlyRoles: newYearlyRoles
      };
    });
  };

  const handleYearlyRoleChange = (year, field, value) => {
    setInviteForm(prev => ({
      ...prev,
      yearlyRoles: {
        ...prev.yearlyRoles,
        [year]: {
          ...prev.yearlyRoles[year],
          [field]: value
        }
      }
    }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    
    // Validate team years selection
    if (inviteForm.teamYears.length === 0) {
      toast.error('Please select at least one team year');
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Convert yearlyRoles object to array format expected by backend
      const yearlyRolesArray = inviteForm.teamYears.map(year => ({
        year: year,
        role: inviteForm.yearlyRoles[year]?.role || 'member',
        teamRole: inviteForm.yearlyRoles[year]?.teamRole || ''
      }));
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/invite`,
        {
          ...inviteForm,
          yearlyRoles: yearlyRolesArray,
          sendEmail: inviteForm.teamYears.includes(currentYear) // Only send email if current year is selected
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const isCurrentYearIncluded = inviteForm.teamYears.includes(currentYear);
        if (isCurrentYearIncluded) {
          toast.success('Member added successfully! Invitation email sent.');
        } else {
          toast.success('Member added successfully! (No email sent - not in current year)');
        }
        setInviteForm({
          name: '',
          email: '',
          role: 'member',
          teamRole: '',
          department: '',
          year: '',
          phoneNumber: '',
          linkedin: '',
          github: '',
          teamYears: [new Date().getFullYear()],
          yearlyRoles: {}
        });
        setShowInviteForm(false);
        fetchTeamMembers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/status`,
        { isActive: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const deleteMember = async (userId, memberName) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to permanently delete ${memberName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        toast.success(`${memberName} has been deleted successfully`);
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      if (error.response?.status === 400 && error.response?.data?.error === "Cannot delete own account") {
        toast.error('You cannot delete your own account');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete member');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Team Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage team members, send invitations, and control access.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Years</option>
            {teamYears.map(year => (
              <option key={year} value={year}>
                {year} {year === currentYear ? '(Current)' : ''}
              </option>
            ))}
          </select>
          
          <button
            type="button"
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="block rounded-md bg-blue-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {showInviteForm ? 'Cancel' : 'Invite Member'}
          </button>
        </div>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Invite New Team Member</h2>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={inviteForm.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={inviteForm.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  System Role *
                </label>
                <select
                  name="role"
                  id="role"
                  required
                  value={inviteForm.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="teamRole" className="block text-sm font-medium text-gray-700">
                  Team Role (Optional)
                </label>
                <input
                  type="text"
                  name="teamRole"
                  id="teamRole"
                  value={inviteForm.teamRole}
                  onChange={handleInputChange}
                  placeholder="e.g., Technical Lead, Marketing Head"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department (Optional)
                </label>
                <select
                  name="department"
                  id="department"
                  value={inviteForm.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Academic Year (Optional)
                </label>
                <select
                  name="year"
                  id="year"
                  value={inviteForm.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={inviteForm.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  pattern="[6-9]\d{9}"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="text"
                  name="linkedin"
                  id="linkedin"
                  value={inviteForm.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                  GitHub Profile (Optional)
                </label>
                <input
                  type="text"
                  name="github"
                  id="github"
                  value={inviteForm.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Team Years Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Team Years * (Select at least one year)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {teamYears.map(year => (
                  <label key={year} className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={inviteForm.teamYears.includes(year)}
                      onChange={() => handleTeamYearToggle(year)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{year}</span>
                    {year === currentYear && (
                      <span className="ml-1 text-xs text-blue-600 font-medium">(Current)</span>
                    )}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 Only members added to the current year ({currentYear}) will receive email invitations. 
                Others will be created as inactive members for historical records.
              </p>
            </div>

            {/* Yearly Roles Configuration */}
            {inviteForm.teamYears.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Role Configuration for Selected Years
                </label>
                <div className="space-y-4">
                  {inviteForm.teamYears.sort().map(year => (
                    <div key={year} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        {year} {year === currentYear && '(Current Year)'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            System Role
                          </label>
                          <select
                            value={inviteForm.yearlyRoles[year]?.role || 'member'}
                            onChange={(e) => handleYearlyRoleChange(year, 'role', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            {roles.map(role => (
                              <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Team Role (Optional)
                          </label>
                          <input
                            type="text"
                            value={inviteForm.yearlyRoles[year]?.teamRole || ''}
                            onChange={(e) => handleYearlyRoleChange(year, 'teamRole', e.target.value)}
                            placeholder="e.g., Technical Lead, Marketing Head"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  ℹ️ Configure different roles for each year. The member can have different responsibilities across years.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Team Members {selectedYear ? `- ${selectedYear}` : '(All Years)'}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Years
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers
                  .filter(member => {
                    if (!selectedYear) return true;
                    return member.teamYears?.includes(selectedYear) || 
                           (member.teamYear && parseInt(member.teamYear) === selectedYear);
                  })
                  .map((member) => (
                  <tr key={member._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={member.profilePicture 
                              ? `${import.meta.env.VITE_API_URL}${member.profilePicture}` 
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">@{member.username || 'Not set'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {selectedYear ? (
                        // Show role for specific year
                        <div>
                          {member.yearlyRoles?.find(yr => yr.year === selectedYear) ? (
                            <>
                              <div className="text-sm text-gray-900">
                                {member.yearlyRoles.find(yr => yr.year === selectedYear).role}
                              </div>
                              {member.yearlyRoles.find(yr => yr.year === selectedYear).teamRole && (
                                <div className="text-sm text-gray-500">
                                  {member.yearlyRoles.find(yr => yr.year === selectedYear).teamRole}
                                </div>
                              )}
                            </>
                          ) : (
                            // Fallback to general role if no yearly role found
                            <>
                              <div className="text-sm text-gray-900">{member.role}</div>
                              {member.teamRole && (
                                <div className="text-sm text-gray-500">{member.teamRole}</div>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        // Show all yearly roles when no year filter
                        <div className="space-y-1">
                          {member.yearlyRoles && member.yearlyRoles.length > 0 ? (
                            member.yearlyRoles.map(yearRole => (
                              <div key={yearRole.year} className="text-xs">
                                <span className="font-medium">{yearRole.year}:</span>
                                <span className="ml-1">{yearRole.role}</span>
                                {yearRole.teamRole && (
                                  <span className="text-gray-500 ml-1">({yearRole.teamRole})</span>
                                )}
                              </div>
                            ))
                          ) : (
                            // Fallback to general role
                            <>
                              <div className="text-sm text-gray-900">{member.role}</div>
                              {member.teamRole && (
                                <div className="text-sm text-gray-500">{member.teamRole}</div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {(member.teamYears || [parseInt(member.teamYear || new Date().getFullYear())]).map(year => (
                          <span 
                            key={year}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              year === currentYear 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {year}
                            {year === currentYear && ' (Current)'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {!member.password && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleUserStatus(member._id, member.isActive)}
                          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                            member.isActive
                              ? 'text-red-700 bg-red-100 hover:bg-red-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          } transition-colors`}
                        >
                          {member.isActive ? <FaToggleOff className="mr-1" /> : <FaToggleOn className="mr-1" />}
                          {member.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteMember(member._id, member.name)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
