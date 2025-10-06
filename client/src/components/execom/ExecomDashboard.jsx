import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaHome, FaChartBar, FaRoad } from 'react-icons/fa';
import execomService from '../../services/execomService';

const ExecomDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData, roadmapData] = await Promise.all([
        execomService.getProfile(),
        execomService.getDashboardStats(),
        execomService.getRoadmap(),
      ]);
      
      setProfile(profileData.data);
      setStats(statsData.data);
      setRoadmap(roadmapData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'home', label: 'Home', icon: FaHome },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'roadmap', label: 'Roadmap', icon: FaRoad },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadInitialData}
            className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-text-dark">Execom Dashboard</h2>
          {profile && (
            <p className="text-sm text-text-light mt-1">Welcome, {profile.user.name}</p>
          )}
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === item.id 
                  ? 'bg-accent/10 text-accent border-r-2 border-accent' 
                  : 'text-text-light'
              }`}
            >
              <item.icon className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'home' && <HomeTab stats={stats} profile={profile} />}
        {activeTab === 'profile' && <ProfileTab profile={profile} onProfileUpdate={setProfile} />}
        {activeTab === 'roadmap' && <RoadmapTab roadmap={roadmap} />}
      </div>
    </div>
  );
};

// Home Tab Component
const HomeTab = ({ stats, profile }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <h1 className="text-3xl font-bold text-text-dark">Dashboard Home</h1>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaUser className="text-accent text-2xl mr-4" />
          <div>
            <p className="text-sm text-text-light">Total Members</p>
            <p className="text-2xl font-bold text-text-dark">{stats?.totalMembers || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaChartBar className="text-green-500 text-2xl mr-4" />
          <div>
            <p className="text-sm text-text-light">Execom Members</p>
            <p className="text-2xl font-bold text-text-dark">{stats?.totalExecom || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaUser className="text-blue-500 text-2xl mr-4" />
          <div>
            <p className="text-sm text-text-light">Total Registrations</p>
            <p className="text-2xl font-bold text-text-dark">{stats?.totalRegistrations || 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <FaUser className="text-orange-500 text-2xl mr-4" />
          <div>
            <p className="text-sm text-text-light">Pending Registrations</p>
            <p className="text-2xl font-bold text-text-dark">{stats?.pendingRegistrations || 0}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Info */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-text-dark mb-4">Your Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-text-light">Role</p>
          <p className="font-medium text-text-dark capitalize">{profile?.user.role}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Team Year</p>
          <p className="font-medium text-text-dark">{profile?.user.teamYear}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Department</p>
          <p className="font-medium text-text-dark">{profile?.user.department || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Username</p>
          <p className="font-medium text-text-dark">{profile?.user.username}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Profile Tab Component
const ProfileTab = ({ profile, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    linkedin: '',
    github: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile?.user) {
      setFormData({
        name: profile.user.name || '',
        bio: profile.user.bio || '',
        linkedin: profile.user.linkedin || '',
        github: profile.user.github || '',
      });
    }
  }, [profile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await execomService.updateProfile(formData);
      onProfileUpdate({ ...profile, user: response.data });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await execomService.changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-text-dark">Profile Settings</h1>
      
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-text-dark mb-4">Profile Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">GitHub Profile</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="https://github.com/yourusername"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-text-dark mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              minLength={6}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || passwordData.newPassword !== passwordData.confirmPassword}
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-dark disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

// Roadmap Tab Component
const RoadmapTab = ({ roadmap }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <h1 className="text-3xl font-bold text-text-dark">Your Learning Roadmap</h1>
    
    {roadmap && roadmap.roadmap ? (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-text-dark mb-2">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-light">Academic Year</p>
              <p className="font-medium text-text-dark">{roadmap.yearLabel}</p>
            </div>
            <div>
              <p className="text-sm text-text-light">Current Semester</p>
              <p className="font-medium text-text-dark">Semester {roadmap.currentSemester}</p>
            </div>
            <div>
              <p className="text-sm text-text-light">Progress Level</p>
              <p className="font-medium text-text-dark">Year {roadmap.academicYear}</p>
            </div>
          </div>
        </div>

        {roadmap.roadmap.map((semester, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                semester.semester === roadmap.currentSemester ? 'bg-accent' : 'bg-gray-400'
              }`}>
                {semester.semester}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-dark">{semester.title}</h3>
                <p className="text-sm text-text-light">
                  {semester.semester === roadmap.currentSemester ? 'Current Semester' : `Semester ${semester.semester}`}
                </p>
              </div>
            </div>
            
            <ul className="space-y-2">
              {semester.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="text-accent mr-2 mt-1">•</span>
                  <span className="text-text-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-text-light">No roadmap data available. Please contact the admin to update your academic information.</p>
      </div>
    )}
  </motion.div>
);

export default ExecomDashboard;
