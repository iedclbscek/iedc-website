import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { events } from '../contexts/eventsData';
import EventDetailModal from '../components/ui/EventDetailModal';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-background text-text-dark pt-16">
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-text-dark">
                Innovate.<br />
                Create.<br />
                <span className="text-accent">Entrepreneuriate.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-light mb-8 max-w-lg">
                IEDC LBSCEK fosters the innovative and entrepreneurial spirit of students through 
                mentorship, resources, and opportunities to build the next generation of leaders.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/events" className="px-8 py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-hover transition-colors shadow-lg">
                  Explore Programs
                </a>
                <a href="https://www.whatsapp.com/channel/0029VaAYL1D2f3EAIot5Yl2N" className="px-8 py-3 border-2 border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-white transition-colors" target='_blank'>
                  Join Us
                </a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full h-80 lg:h-96 bg-primary/30 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/img/IMG_3351.JPG" 
                    alt="IEDC Activities" 
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-lg shadow-lg"></div>
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-cta/20 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">What We Offer</h2>
            <p className="text-lg text-text-light">
              IEDC LBSCEK provides a comprehensive ecosystem to support students in their entrepreneurial journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation Labs",
                description: "Access state-of-the-art equipment and resources to bring your ideas to life",
                icon: "🧪"
              },
              {
                title: "Mentorship",
                description: "Connect with industry experts and successful entrepreneurs for guidance",
                icon: "👥"
              },
              {
                title: "Funding Support",
                description: "Get access to seed funding, grants, and investment opportunities",
                icon: "💰"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Students Involved" },
              { number: "50+", label: "Successful Events" },
              { number: "20+", label: "Startups Incubated" },
              { number: "10+", label: "Years of Excellence" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-text-dark">Upcoming Events</h2>
            <Link to="/events" className="text-accent hover:text-accent-dark font-medium flex items-center">
              View All
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-text-light py-8">No upcoming events scheduled at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Category color strip */}
                  <div className={`h-2 ${getCategoryColor(event.category)}`}></div>
                  
                  {/* Event image */}
                  <div className="h-40 bg-primary/20 relative overflow-hidden">
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
                      <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium rounded text-text-dark">
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
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-dark">Ready to Begin Your Entrepreneurial Journey?</h2>
          <p className="text-lg text-text-light mb-8">
            Join IEDC LBSCEK and be a part of a growing community of innovators and entrepreneurs
            shaping the future.
          </p>
          <a href="https://www.whatsapp.com/channel/0029VaAYL1D2f3EAIot5Yl2N" className="px-8 py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-hover transition-colors shadow-lg mx-auto" target='_blank'>
            Join IEDC LBSCEK Today
          </a>
        </div>
      </section>

      {/* Event Detail Modal */}
      <EventDetailModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
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

export default HomePage;
