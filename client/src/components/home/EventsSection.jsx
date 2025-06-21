import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { events } from '../../data/eventsData';
import EventDetailModal from '../ui/EventDetailModal';

const EventsSection = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the latest 3 upcoming events
  const upcomingEvents = [...events]
    .filter(event => !event.isPast)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const openEventDetail = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section id="events" className="py-24 bg-primary/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cta/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark">Upcoming Events</h2>
            <Link to="/events" className="flex items-center text-accent hover:text-accent-dark font-medium group">
              <span>View All</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-text-light max-w-2xl">
            Join our workshops, hackathons, and expert sessions to learn new skills,
            network with industry professionals, and develop your entrepreneurial mindset.
          </motion.p>
        </motion.div>
        
        {upcomingEvents.length === 0 ? (
          <p className="text-center text-text-light py-8">No upcoming events scheduled at the moment.</p>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {upcomingEvents.map((event, index) => (
              <motion.div
                variants={itemVariants}
                key={event.title}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Category color strip */}
                <div className={`h-2 ${getCategoryColor(event.category)}`}></div>
                
                {/* Event image */}
                <div className="h-48 relative overflow-hidden bg-primary/20">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/event-placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-text-light">
                      No image available
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium rounded-md text-text-dark">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-dark mb-2">{event.title}</h3>
                  <p className="text-text-light mb-4 line-clamp-2">{event.shortDescription}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-text-light text-sm">
                      <FaCalendarAlt className="mr-2 text-accent" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-text-light text-sm">
                      <FaMapMarkerAlt className="mr-2 text-accent" />
                      {event.location}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => openEventDetail(event)}
                      className="text-cta hover:text-cta-hover font-medium transition-colors"
                    >
                      Learn more →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Event Detail Modal */}
      <EventDetailModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
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
    case 'Talk':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    return dateString; // Return original string if parsing fails
  }
};

export default EventsSection;
