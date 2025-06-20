import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const TeamCard = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Default image if member image is not available
  const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;

  return (
    <motion.div
      className="text-center"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      {/* Member Photo in a clean circle format */}
      <div className="relative mx-auto mb-3">
        <div className="w-32 h-32 rounded-lg overflow-hidden mx-auto shadow-md">
          <img
            src={member.image || defaultImage}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>
        
        {/* Social links overlay on hover */}
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-accent/20 rounded-lg"
          >
            <div className="flex gap-2">
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-1.5 rounded-full text-accent hover:bg-accent hover:text-white transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin size={16} />
                </a>
              )}
              {member.github && (
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white p-1.5 rounded-full text-accent hover:bg-accent hover:text-white transition-colors"
                  aria-label="GitHub Profile"
                >
                  <FaGithub size={16} />
                </a>
              )}
              {member.email && (
                <a 
                  href={`mailto:${member.email}`}
                  className="bg-white p-1.5 rounded-full text-accent hover:bg-accent hover:text-white transition-colors"
                  aria-label="Email Contact"
                >
                  <FaEnvelope size={16} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Member name and role */}
      <h3 className="font-bold text-text-dark text-base">{member.name}</h3>
      <p className="text-accent text-sm font-medium">{member.role}</p>
    </motion.div>
  );
};

export default TeamCard;
