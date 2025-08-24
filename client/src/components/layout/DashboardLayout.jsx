import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaSignOutAlt, 
  FaUser, 
  FaCalendarAlt, 
  FaUsers, 
  FaCog,
  FaBars,
  FaTimes,
  FaHome,
  FaClipboardList
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, isAuthenticated, loading, initialized, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Check authentication
  useEffect(() => {
    if (initialized && !loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [initialized, loading, isAuthenticated, navigate]);

  // Close sidebar on route change (only on mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Show loading while checking auth
  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const getNavigation = () => {
    if (user?.role === 'iic_admin') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: FaHome },
        { name: 'IIC Registrations', href: '/dashboard/iic-registrations', icon: FaUsers },
        { name: 'IIC Execom Responses', href: '/dashboard/iic-execom-responses', icon: FaClipboardList },
        { name: 'Profile', href: '/dashboard/profile', icon: FaUser },
      ];
    }
    
    return [
      { name: 'Dashboard', href: '/dashboard', icon: FaHome },
      { name: 'Registrations', href: '/dashboard/registrations', icon: FaUsers },
      { name: 'Events', href: '/dashboard/events', icon: FaCalendarAlt },
      { name: 'Team', href: '/dashboard/team', icon: FaUsers },
      { name: 'Profile', href: '/dashboard/profile', icon: FaUser },
      { name: 'Settings', href: '/dashboard/settings', icon: FaCog },
    ];
  };

  const navigation = getNavigation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on large screens */}
      <div className="hidden lg:block w-64 bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-accent to-accent-dark">
            <div className="flex items-center">
              <img
                src="/img/logo/IEDCLBSLogoColor.webp"
                alt="IEDC Logo"
                className="h-10 w-auto"
              />
              <span className="ml-3 text-lg font-bold text-white">Dashboard</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-lg transform translate-x-1'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-accent hover:shadow-md'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-accent'
                  }`} />
                  {item.name}
                </motion.a>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:shadow-md transition-all duration-200 border border-red-200"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-accent to-accent-dark">
            <div className="flex items-center">
              <img
                src="/img/logo/IEDCLBSLogoColor.webp"
                alt="IEDC Logo"
                className="h-10 w-auto"
              />
              <span className="ml-3 text-lg font-bold text-white">Dashboard</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-lg transform translate-x-1'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-accent hover:shadow-md'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-accent'
                  }`} />
                  {item.name}
                </motion.a>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:shadow-md transition-all duration-200 border border-red-200"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-lg border-b border-gray-100">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
            >
              <FaBars className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  Welcome back, {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:shadow-md transition-all duration-200 border border-red-200"
              >
                <FaSignOutAlt className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
