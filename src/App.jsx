import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Highlights from './components/Highlights';
import Team from './components/Team';
import TeamPage from './components/TeamPage';
import Communities from './components/Communities';
import CommunitiesPage from './components/CommunitiesPage';
import CommunityPage from './components/CommunityPage';
import EventPage from './components/EventPage';
import Footer from './components/Footer';
import Login from './components/Login';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import NodalOfficerDashboard from './components/NodalOfficerDashboard';
import { FaBars, FaTimes } from 'react-icons/fa';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  const Navigation = () => (
    <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-blue-900 bg-opacity-90'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 pl-4">
            <img 
              src="/img/IEDCLBSLogoColorWhiteText.webp" 
              alt="IEDC LBSCEK Logo" 
              className="h-10 w-auto"
            />
            <span className={`text-xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-blue-900' : 'text-white'
            }`}>
              IEDC LBSCEK
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 pr-4">
            <a href="/#about" className={`transition-colors ${
              isScrolled ? 'text-blue-900 hover:text-blue-700' : 'text-white hover:text-blue-200'
            }`}>About</a>
            <Link to="/events" className={`transition-colors ${
              isScrolled ? 'text-blue-900 hover:text-blue-700' : 'text-white hover:text-blue-200'
            }`}>Events</Link>
            <a href="/#highlights" className={`transition-colors ${
              isScrolled ? 'text-blue-900 hover:text-blue-700' : 'text-white hover:text-blue-200'
            }`}>Highlights</a>
            <a href="/#team" className={`transition-colors ${
              isScrolled ? 'text-blue-900 hover:text-blue-700' : 'text-white hover:text-blue-200'
            }`}>Team</a>
            <Link to="/communities" className={`transition-colors ${
              isScrolled ? 'text-blue-900 hover:text-blue-700' : 'text-white hover:text-blue-200'
            }`}>Communities</Link>
          </div>

          <button
            className={`md:hidden transition-colors ${
              isScrolled ? 'text-blue-900' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-blue-900 bg-opacity-90 py-4">
            <div className="flex flex-col space-y-4">
              <a href="/#about" className="text-white hover:text-blue-200 transition-colors px-4">About</a>
              <Link to="/events" className="text-white hover:text-blue-200 transition-colors px-4">Events</Link>
              <a href="/#highlights" className="text-white hover:text-blue-200 transition-colors px-4">Highlights</a>
              <a href="/#team" className="text-white hover:text-blue-200 transition-colors px-4">Team</a>
              <Link to="/communities" className="text-white hover:text-blue-200 transition-colors px-4">Communities</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  const HomePage = () => (
    <>
      <Hero />
      <About />
      <Events />
      <Highlights />
      <Team />
      <Communities />
    </>
  );

  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/nodal-login" element={<Login />} />
            <Route path="/nodal-dashboard" element={<PrivateRoute><NodalOfficerDashboard /></PrivateRoute>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
