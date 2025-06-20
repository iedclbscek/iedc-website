import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const TeamCard = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Default image if member image is not available
  const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden shadow-md bg-white transition-all duration-300 hover:shadow-lg group"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      layout
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={member.image || defaultImage}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      </div>
      
      {/* Content overlay that slides up on hover */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 pb-5"
        initial={{ y: isHovered ? 0 : "auto" }}
        animate={{ y: isHovered ? 0 : "auto" }}
      >
        <h3 className="text-lg font-bold text-text-dark mb-0.5 tracking-tight">{member.name}</h3>
        <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
        
        {/* Social links */}
        <div className={`flex gap-3 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {member.linkedin && (
            <a 
              href={member.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-light hover:text-accent transition-colors"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin size={18} />
            </a>
          )}
          {member.github && (
            <a 
              href={member.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-light hover:text-accent transition-colors"
              aria-label="GitHub Profile"
            >
              <FaGithub size={18} />
            </a>
          )}
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="text-text-light hover:text-accent transition-colors"
              aria-label="Email Contact"
            >
              <FaEnvelope size={18} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamCard;
