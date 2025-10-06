import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import { getTeamForYear } from '../../data/teamData';

const TeamPreviewSection = () => {
  const [hovered, setHovered] = useState(null);
  // const [teamMembers, setTeamMembers] = useState([]);
  // const [loading, setLoading] = useState(true);
  
  // Get current year team data from static data instead of API
  const currentYear = new Date().getFullYear();
  const teamData = getTeamForYear(currentYear);
  
  // Combine faculty and core team members
  const allMembers = [
    ...teamData.facultyMembers,
    ...teamData.coreTeam
  ];
  
  // // Fetch team members from API - COMMENTED OUT
  // useEffect(() => {
  //   const fetchTeamMembers = async () => {
  //     try {
  //       const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/public-team`);
  //       if (response.data && response.data.success && Array.isArray(response.data.users)) {
  //         setTeamMembers(response.data.users);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching team members:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTeamMembers();
  // }, []);
  
  // Get top team members for preview - only first nodal officer and CEOs of current year
  // const currentYear = new Date().getFullYear();
  
  // Get display members - first nodal officer and CEOs/leads
  const displayMembers = [];
  
  // Add first nodal officer
  const firstNodalOfficer = allMembers.find(member => 
    member.role && member.role.toLowerCase().includes('nodal officer')
  );
  
  if (firstNodalOfficer) {
    displayMembers.push(firstNodalOfficer);
  }
  
  // Add CEOs and leads from core team
  const ceos = allMembers.filter(member => 
    member.role && (
      member.role.toLowerCase().includes('ceo') || 
      member.role.toLowerCase().includes('lead')
    )
  );
  
  displayMembers.push(...ceos);
  
  // Limit to maximum 3 members total
  const finalDisplayMembers = displayMembers.slice(0, 3);
  
  return (
    <section id="team" className="py-24 bg-primary/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-cta/5 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark inline-block relative">
            Meet Our Team
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-text-light mt-6 max-w-2xl mx-auto">
            Passionate individuals driving innovation and entrepreneurship at IEDC LBSCEK
          </p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {finalDisplayMembers.map((member, index) => (
            <motion.div
              key={member?._id || member?.id || index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
              onMouseEnter={() => setHovered(member?._id || member?.id || index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden">
                <img 
                  src={member?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member?.name || 'Team Member')}&background=random&size=200`} 
                  alt={member?.name || 'Team Member'}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member?.name || 'TM')}&background=random&size=200`;
                  }}
                />
              </div>
              
              <motion.div 
                className="text-center mt-4"
                animate={{ 
                  y: hovered === (member?._id || member?.id || index) ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-bold text-text-dark">{member?.name || 'Team Member'}</h3>
                <p className="text-accent">{member?.role || 'Member'}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <Link 
            to="/team"
            className="inline-flex items-center justify-center px-8 py-3 bg-cta text-white font-semibold rounded-full hover:bg-cta-hover transition-colors transform hover:-translate-y-1 hover:shadow-lg"
          >
            Meet the Full Team
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamPreviewSection;
