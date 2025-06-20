import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';

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
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadComplete = () => {
    setLoading(false);
  };

  useEffect(() => {
    // Preload any assets if needed
    return () => {
      // Cleanup if needed
    };
  }, []);

  if (loading) {
    return <Loader onComplete={handleLoadComplete} />;
  }

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
