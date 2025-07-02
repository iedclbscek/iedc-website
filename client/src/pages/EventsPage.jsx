import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import axios from 'axios';
import Loader from '../components/ui/Loader';
import ProposeEventModal from '../components/ui/ProposeEventModal';

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);
  const [showProposeModal, setShowProposeModal] = useState(false);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`, {
          params: {
            status: 'published',
            limit: 100
          }
        });

        if (response.data.success) {
          setEvents(response.data.events);
          
          // Extract unique categories
          const uniqueCategories = ['All', ...new Set(response.data.events
            .map(event => event.category)
            .filter(Boolean))];
          
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events by category and past/upcoming status
  useEffect(() => {
    if (!events.length) return;
    
    // Get current date for past/upcoming comparison
    const now = new Date();
    
    // Apply category filter
    let filtered = [...events];
    if (activeFilter !== 'All') {
      filtered = filtered.filter(event => event.category === activeFilter);
    }
    
    // Split into upcoming and past
    setUpcomingEvents(filtered.filter(event => {
      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
      return eventEndDate >= now;
    }));
    
    setPastEvents(filtered.filter(event => {
      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
      return eventEndDate < now;
    }));
  }, [events, activeFilter]);

  const openEventDetail = (event) => {
    navigate(`/events/${event._id}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-accent/10 pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-dark">Events</h1>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Join our events and workshops to learn, network, and grow your entrepreneurial skills
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeFilter === category 
                    ? 'bg-accent text-white shadow-md' 
                    : 'bg-primary hover:bg-primary-dark text-text-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-text-dark">
            Upcoming Events
          </h2>

          {upcomingEvents.length === 0 ? (
            <p className="text-center text-text-light py-8">No upcoming events in this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={`h-3 ${getCategoryColor(event.category)}`}></div>
                  
                  {/* Event image */}
                  <div className="h-40 bg-primary/20 relative overflow-hidden">
                    {event.images && event.images.length > 0 ? (
                      <img 
                        src={`${import.meta.env.VITE_API_URL}${event.images[0]}`}
                        alt={event.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/img/event-placeholder.jpg';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-text-light">
                        <Calendar size={24} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium rounded text-text-dark">
                        {event.category}
                      </span>
                    </div>
                    {event.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text-dark mb-2">{event.title}</h3>
                    <p className="text-text-light mb-4 line-clamp-2">{event.shortDescription}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-text-light text-sm">
                        <Calendar className="mr-2 text-accent" size={16} />
                        {formatDate(event.startDate)}
                      </div>
                      <div className="flex items-center text-text-light text-sm">
                        <MapPin className="mr-2 text-accent" size={16} />
                        {event.location}
                      </div>
                      <div className="flex items-center text-text-light text-sm">
                        <Users className="mr-2 text-accent" size={16} />
                        {event.registrationCount || 0} registered
                        {event.maxParticipants > 0 && ` / ${event.maxParticipants}`}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={() => openEventDetail(event)}
                        className="text-cta hover:text-cta-dark font-medium transition-colors"
                      >
                        Learn more →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-8 bg-primary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-text-dark">
              Past Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-text-dark mb-2">{event.title}</h3>
                  <p className="text-text-light text-sm mb-3 line-clamp-2">{event.shortDescription}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-accent">{formatDate(event.startDate)}</span>
                    <button 
                      onClick={() => openEventDetail(event)}
                      className="text-sm text-cta hover:text-cta-dark font-medium transition-colors"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-text-dark">Want to host an event with us?</h2>
            <p className="text-text-light mb-8">
              If you have an idea for an event or want to collaborate with IEDC LBSCEK, we'd love to hear from you!
            </p>
            <button 
              onClick={() => setShowProposeModal(true)}
              className="px-8 py-3 bg-cta text-white rounded-lg hover:bg-cta-hover transition-colors shadow-sm"
            >
              Propose an Event
            </button>
          </div>
        </div>
      </section>

      {/* Propose Event Modal */}
      <ProposeEventModal 
        isOpen={showProposeModal}
        onClose={() => setShowProposeModal(false)}
      />
    </div>
  );
};

// Helper function to get color based on category
const getCategoryColor = (category) => {
  switch (category) {
    case 'Workshop':
      return 'bg-blue-500';
    case 'Bootcamp':
      return 'bg-purple-500';
    case 'Hackathon':
      return 'bg-green-500';
    case 'Competition':
      return 'bg-accent';
    case 'Seminar':
      return 'bg-yellow-500';
    case 'Conference':
      return 'bg-orange-500';
    case 'Networking':
      return 'bg-pink-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default EventsPage;
