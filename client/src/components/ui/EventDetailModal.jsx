import { AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Calendar, User } from 'lucide-react';

const EventDetailModal = ({ event, isOpen, onClose }) => {
  if (!event) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header with color strip */}
            <div className={`h-2 ${getCategoryColor(event.category)}`}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-text-dark">{event.title}</h2>
                <button 
                  className="text-text-light hover:text-accent p-1 rounded-full transition-colors"
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-primary text-text-light text-sm font-medium rounded-full">
                  {event.category}
                </span>
                <span className={`px-3 py-1 ${new Date(event.endDate || event.startDate) < new Date() ? 'bg-text-light/20' : 'bg-cta/20'} text-sm font-medium rounded-full`}>
                  {new Date(event.endDate || event.startDate) < new Date() ? 'Past Event' : 'Upcoming'}
                </span>
              </div>
              
              {/* Event image */}
              <div className="mt-6 rounded-lg overflow-hidden bg-primary/20 h-48 flex items-center justify-center">
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
                  <div className="flex items-center justify-center h-full w-full bg-primary/10">
                    <Calendar size={48} className="text-primary" />
                  </div>
                )}
              </div>
              
              {/* Event details */}
              <div className="mt-6 space-y-4">
                {/* Date and Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-accent mt-1 flex-shrink-0" size={16} />
                  <div>
                    <h3 className="font-semibold text-text-dark">Date</h3>
                    <p className="text-text-light">
                      {new Date(event.startDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                      {event.endDate && new Date(event.startDate).toDateString() !== new Date(event.endDate).toDateString() && (
                        <> to {new Date(event.endDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Time */}
                <div className="flex items-start gap-3">
                  <Clock className="text-accent mt-1 flex-shrink-0" size={16} />
                  <div>
                    <h3 className="font-semibold text-text-dark">Time</h3>
                    <p className="text-text-light">
                      {event.startTime ? event.startTime : new Date(event.startDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                      {event.endTime && ` - ${event.endTime}`}
                      {!event.endTime && event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}`}
                    </p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="text-accent mt-1 flex-shrink-0" size={16} />
                  <div>
                    <h3 className="font-semibold text-text-dark">Location</h3>
                    <p className="text-text-light">{event.location}</p>
                  </div>
                </div>
                
                {/* Speakers */}
                {event.speakers && event.speakers.length > 0 && (
                  <div className="flex items-start gap-3">
                    <User className="text-accent mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h3 className="font-semibold text-text-dark">Speakers</h3>
                      <p className="text-text-light">{event.speakers.join(', ')}</p>
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div className="mt-6">
                  <h3 className="font-semibold text-text-dark mb-2">About this event</h3>
                  <p className="text-text-light">{event.fullDescription}</p>
                </div>
              </div>
              
              {/* Action Button */}
              {!event.isPast && (
                <div className="mt-8">
                  <button className="w-full py-3 bg-cta hover:bg-cta-hover text-white font-medium rounded-lg transition-colors">
                    Register Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
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

export default EventDetailModal;
