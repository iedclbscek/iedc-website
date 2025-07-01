import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTrash, FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableTeamMember from './ui/SortableTeamMember';

const TeamManagement = () => {
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Add year filter
  const [sortedMembers, setSortedMembers] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Update sorted members when team members change
  useEffect(() => {
    const sorted = [...teamMembers].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    setSortedMembers(sorted);
  }, [teamMembers]);

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
        teamRole: inviteForm.yearlyRoles[year]?.teamRole || '',
        academicYear: inviteForm.yearlyRoles[year]?.academicYear || ''
      }));
      
      // Create clean request payload without conflicting fields
      const requestPayload = {
        name: inviteForm.name,
        email: inviteForm.email,
        teamYears: inviteForm.teamYears,
        yearlyRoles: yearlyRolesArray,
        sendEmail: inviteForm.teamYears.includes(currentYear) // Only send email if current year is selected
      };
      
      // Only add optional fields if they have values
      if (inviteForm.department && inviteForm.department.trim()) {
        requestPayload.department = inviteForm.department.trim();
      }
      if (inviteForm.phoneNumber && inviteForm.phoneNumber.trim()) {
        requestPayload.phoneNumber = inviteForm.phoneNumber.trim();
      }
      if (inviteForm.linkedin && inviteForm.linkedin.trim()) {
        requestPayload.linkedin = inviteForm.linkedin.trim();
      }
      if (inviteForm.github && inviteForm.github.trim()) {
        requestPayload.github = inviteForm.github.trim();
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/invite`,
        requestPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const isCurrentYearIncluded = inviteForm.teamYears.includes(currentYear);
        const isUpdate = response.data.updated;
        
        if (isUpdate) {
          // Handle existing user update
          if (isCurrentYearIncluded && response.data.emailSent) {
            toast.success('Years added to existing member and invitation email sent!');
          } else if (isCurrentYearIncluded) {
            toast.success('Years added to existing member successfully!');
          } else {
            toast.success('Years added to existing member (no email sent - not in current year)');
          }
        } else {
          // Handle new user creation
          if (isCurrentYearIncluded) {
            toast.success('Member added successfully! Invitation email sent.');
          } else {
            toast.success('Member added successfully! (No email sent - not in current year)');
          }
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
      console.error('Response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Failed to send invitation';
      const errorDetails = error.response?.data?.details;
      
      if (errorDetails && Array.isArray(errorDetails)) {
        console.error('Validation errors:', errorDetails);
        toast.error(`Validation Error: ${errorDetails.map(err => err.msg).join(', ')}`);
      } else {
        toast.error(errorMessage);
      }
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

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortedMembers((items) => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasUnsavedChanges(true);
        return newOrder;
      });
    }
  };

  // Save the new order to backend
  const saveOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const updates = sortedMembers.map((member, index) => ({
        userId: member._id,
        displayOrder: index
      }));

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/users/update-order`,
        { updates },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local state
      setTeamMembers(sortedMembers.map((member, index) => ({
        ...member,
        displayOrder: index
      })));
      
      setHasUnsavedChanges(false);
      toast.success('Team order saved successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save team order');
    } finally {
      setLoading(false);
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Academic Year (Optional)
                          </label>
                          <select
                            value={inviteForm.yearlyRoles[year]?.academicYear || ''}
                            onChange={(e) => handleYearlyRoleChange(year, 'academicYear', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                          </select>
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
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Team Members {selectedYear ? `- ${selectedYear}` : '(All Years)'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop to reorder team members. This will affect how they appear on the public team page.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Year Filter */}
              <div>
                <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Year
                </label>
                <select
                  id="yearFilter"
                  value={selectedYear || ''}
                  onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Years</option>
                  {teamYears.map(year => (
                    <option key={year} value={year}>
                      {year} {year === currentYear ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {hasUnsavedChanges && (
                <button
                  onClick={saveOrder}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FaSave className="mr-2" />
                  {loading ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </div>
          </div>
          
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
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
                  <SortableContext 
                    items={sortedMembers
                      .filter(member => {
                        if (!selectedYear) return true;
                        return member.teamYears?.includes(selectedYear) || 
                               (member.teamYear && parseInt(member.teamYear) === selectedYear);
                      })
                      .map(member => member._id)
                    }
                    strategy={verticalListSortingStrategy}
                  >
                    {sortedMembers
                      .filter(member => {
                        if (!selectedYear) return true;
                        return member.teamYears?.includes(selectedYear) || 
                               (member.teamYear && parseInt(member.teamYear) === selectedYear);
                      })
                      .map((member) => (
                        <SortableTeamMember
                          key={member._id}
                          member={member}
                          selectedYear={selectedYear}
                          onToggleStatus={toggleUserStatus}
                          onDelete={deleteMember}
                        />
                      ))
                    }
                  </SortableContext>
                </tbody>
              </table>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
