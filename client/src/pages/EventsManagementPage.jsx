import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Users, MapPin, Edit, Trash2, Eye, Camera, Clock, CheckCircle, XCircle, Filter, Search, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EventFormModal from '../components/ui/EventFormModal';
import EventPhotosModal from '../components/ui/EventPhotosModal';
import EventParticipantsModal from '../components/ui/EventParticipantsModal';
import Loader from '../components/ui/Loader';

const EventsManagementPage = () => {
  const { user, api } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    timeframe: 'all',
    coordinated: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFilters();
  }, [events, filters, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/dashboard', {
        params: { limit: 100 }
      });

      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Timeframe filter
    const now = new Date();
    if (filters.timeframe === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.startDate) >= now);
    } else if (filters.timeframe === 'past') {
      filtered = filtered.filter(event => new Date(event.endDate) < now);
    } else if (filters.timeframe === 'ongoing') {
      filtered = filtered.filter(event => 
        new Date(event.startDate) <= now && new Date(event.endDate) >= now
      );
    }

    // Coordinated events filter
    if (filters.coordinated) {
      filtered = filtered.filter(event => 
        event.coordinators.some(coord => coord._id === user?.id) ||
        event.createdBy._id === user?.id
      );
    }

    setFilteredEvents(filtered);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  const handleManagePhotos = (event) => {
    setSelectedEvent(event);
    setShowPhotosModal(true);
  };
  
  const handleViewParticipants = (event) => {
    setSelectedEvent(event);
    setShowParticipantsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (event.status === 'cancelled') return 'Cancelled';
    if (event.status === 'completed') return 'Completed';
    if (endDate < now) return 'Past';
    if (startDate <= now && endDate >= now) return 'Ongoing';
    return 'Upcoming';
  };

  const categories = ['Workshop', 'Bootcamp', 'Hackathon', 'Competition', 'Seminar', 'Conference', 'Networking', 'Other'];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events Management</h1>
            <p className="text-gray-600">Create, manage, and track your events</p>
          </div>
          
          <motion.button
            onClick={handleCreateEvent}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={20} />
            Create Event
          </motion.button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Timeframe Filter */}
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>

            {/* Coordinated Filter */}
            <label className="flex items-center gap-2 px-4 py-2">
              <input
                type="checkbox"
                checked={filters.coordinated}
                onChange={(e) => setFilters({ ...filters, coordinated: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">My Events</span>
            </label>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <motion.div
              key={event._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              {/* Event Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                {event.images && event.images.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${event.images[0]}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="text-white" size={48} />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {getEventStatus(event)}
                  </span>
                </div>

                {/* Featured Badge */}
                {event.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Event Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{event.title}</h3>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium ml-2">
                    {event.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.shortDescription}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} />
                    {event.registrationCount || 0} registered
                    {event.maxParticipants > 0 && ` / ${event.maxParticipants}`}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={16} />
                    Registration {event.isRegistrationOpen ? 'Open' : 'Closed'}
                  </div>
                </div>

                {/* Coordinators */}
                {event.coordinators && event.coordinators.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Coordinators:</p>
                    <div className="flex -space-x-2">
                      {event.coordinators.slice(0, 3).map(coordinator => (
                        <img
                          key={coordinator._id}
                          src={coordinator.profilePicture 
                            ? `${import.meta.env.VITE_API_URL}${coordinator.profilePicture}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(coordinator.name)}&background=random&size=32`
                          }
                          alt={coordinator.name}
                          className="w-8 h-8 rounded-full border-2 border-white"
                          title={coordinator.name}
                        />
                      ))}
                      {event.coordinators.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{event.coordinators.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/events/${event._id}`, '_blank')}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  {/* Show Photos button for past events */}
                  {(event.isPast || event.status === 'completed') && (
                    <button
                      onClick={() => handleManagePhotos(event)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Camera size={16} />
                      Photos
                    </button>
                  )}
                  
                  {/* Participants button */}
                  <button
                    onClick={() => handleViewParticipants(event)}
                    className="flex-1 bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <UserCheck size={16} />
                    {event.registrations?.length || 0}
                  </button>

                  {/* Delete button for event creators */}
                  {event.createdBy._id === user?.id && (
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.status !== 'all' || filters.category !== 'all' || filters.timeframe !== 'all' || filters.coordinated
                ? 'Try adjusting your filters or search term'
                : 'Create your first event to get started'
              }
            </p>
            {!(searchTerm || filters.status !== 'all' || filters.category !== 'all' || filters.timeframe !== 'all' || filters.coordinated) && (
              <button
                onClick={handleCreateEvent}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Event
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showEventForm && (
        <EventFormModal
          isOpen={showEventForm}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          event={editingEvent}
          onSuccess={() => {
            fetchEvents();
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      {showPhotosModal && selectedEvent && (
        <EventPhotosModal
          isOpen={showPhotosModal}
          onClose={() => {
            setShowPhotosModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSuccess={() => {
            fetchEvents();
          }}
        />
      )}
      
      {showParticipantsModal && selectedEvent && (
        <EventParticipantsModal
          isOpen={showParticipantsModal}
          onClose={() => {
            setShowParticipantsModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default EventsManagementPage;
