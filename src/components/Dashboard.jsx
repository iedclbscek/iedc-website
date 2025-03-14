import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CEO');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setUser(data);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/invite`,
        { username, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Invitation sent successfully');
      setUsername('');
      setEmail('');
      setRole('CEO');
    } catch (error) {
      alert('Error sending invitation');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome, {user.username}</h2>
        <p>Your Role: {user.role}</p>
        {user.role === 'quality_lead' && <p>You can review quality checks.</p>}
        {user.role === 'event_lead' && <p>You can manage event approvals.</p>}
        {user.role === 'admin' && <p>You have full system access.</p>}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-8">
        <form onSubmit={handleInvite}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="CEO">CEO</option>
              <option value="CIO">CIO</option>
              <option value="COO">COO</option>
              <option value="CMO">CMO</option>
              <option value="CTO">CTO</option>
              <option value="CQO">CQO</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Invitation
          </button>
        </form>
        <button
          onClick={() => navigate('/edit-profile')}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
