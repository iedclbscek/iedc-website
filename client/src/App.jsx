import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';
import ScrollToTop from './components/ui/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import TeamPage from './pages/TeamPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CommunityPage from './pages/CommunityPage';

// Placeholder page component
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen pt-24 pb-16 px-6">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-gray-600">🚧This page is under construction.🏗️</p>
    </div>
  </div>
);

// App router wrapper to access location
const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const handleLoadComplete = () => {
    setLoading(false);
  };

  useEffect(() => {
    // Reset loading state when navigating away from home
    if (location.pathname !== '/') {
      setLoading(false);
    }
    // Preload any assets if needed
    return () => {
      // Cleanup if needed
    };
  }, [location.pathname]);

  // Only show loader on home page
  if (loading && location.pathname === '/') {
    return <Loader onComplete={handleLoadComplete} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/communities/:id" element={<CommunityPage />} />
          <Route path="/login" element={<PlaceholderPage title="Dashboard Login" />} />
          <Route path="/dashboard/*" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
