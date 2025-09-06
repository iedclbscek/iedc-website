import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { communities } from '../../data/communitiesData';

const CommunitiesSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate the list for seamless looping
  const marqueeCommunities = [...communities, ...communities];

  return (
    <section id="communities" className="py-24 bg-primary/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark inline-block relative">
            Our Communities
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-text-light mt-6 max-w-2xl mx-auto">
            Join our diverse range of technology communities to expand your knowledge, skills, and network
          </p>
        </motion.div>        {/* Marquee container with CSS animation */}
        <div className="relative overflow-hidden">
          <div 
            className={`marquee-wrapper ${isHovered ? 'paused' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="marquee-track">
              {/* First set of cards */}
              {communities.map((community, idx) => (
                <div
                  key={`set1-${community.id}-${idx}`}
                  className="community-card w-[260px] h-[280px] bg-white rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-center mx-3"
                >
                  <div className="text-5xl mb-4">{community.icon}</div>
                  <h3 className="text-xl font-bold text-text-dark mb-2 text-center truncate w-full">{community.name}</h3>
                  <div className="text-text-light text-center mb-4 line-clamp-2 flex-grow overflow-hidden">
                    {community.description}
                  </div>
                  <Link 
                    to={community.path} 
                    className="mt-auto text-accent hover:text-accent-dark font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
              
              {/* Second set of cards - duplicate for seamless loop */}
              {communities.map((community, idx) => (
                <div
                  key={`set2-${community.id}-${idx}`}
                  className="community-card w-[260px] h-[280px] bg-white rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-center mx-3"
                >
                  <div className="text-5xl mb-4">{community.icon}</div>
                  <h3 className="text-xl font-bold text-text-dark mb-2 text-center truncate w-full">{community.name}</h3>
                  <div className="text-text-light text-center mb-4 line-clamp-2 flex-grow overflow-hidden">
                    {community.description}
                  </div>
                  <Link 
                    to={community.path} 
                    className="mt-auto text-accent hover:text-accent-dark font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
              
              {/* Third set of cards - ensures no visible gaps */}
              {communities.slice(0, 3).map((community, idx) => (
                <div
                  key={`set3-${community.id}-${idx}`}
                  className="community-card w-[260px] h-[280px] bg-white rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-center mx-3"
                >
                  <div className="text-5xl mb-4">{community.icon}</div>
                  <h3 className="text-xl font-bold text-text-dark mb-2 text-center truncate w-full">{community.name}</h3>
                  <div className="text-text-light text-center mb-4 line-clamp-2 flex-grow overflow-hidden">
                    {community.description}
                  </div>
                  <Link 
                    to={community.path} 
                    className="mt-auto text-accent hover:text-accent-dark font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <Link 
            to="/nexus"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-accent text-accent font-medium rounded-full hover:bg-accent hover:text-white transition-colors transform hover:-translate-y-1"
          >
            Explore All Communities
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitiesSection;
