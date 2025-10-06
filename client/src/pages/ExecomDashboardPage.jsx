import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import ExecomDashboard from '../components/execom/ExecomDashboard';

const ExecomDashboardPage = () => {
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    // Set page title
    document.title = 'Execom Dashboard - IEDC LBSCEK';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-light">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has execom role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'execom') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-dark mb-4">Access Denied</h1>
          <p className="text-text-light mb-4">You need execom privileges to access this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-dark"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <ExecomDashboard />;
};

export default ExecomDashboardPage;
