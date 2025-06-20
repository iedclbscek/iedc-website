import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { teamData, getAvailableYears } from '../data/teamData';
import TeamCard from '../components/ui/TeamCard';
import Tabs from '../components/ui/Tabs';

const TeamPage = () => {
  const availableYears = getAvailableYears();
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || '2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState({
    facultyMembers: [],
    coreTeam: [],
    teamMembers: []
  });
  const currentTeam = teamData[selectedYear] || { facultyMembers: [], coreTeam: [], teamMembers: [] };
  
  // Filter members based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers({
        facultyMembers: currentTeam.facultyMembers || [],
        coreTeam: currentTeam.coreTeam || [],
        teamMembers: currentTeam.teamMembers || []
      });
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    setFilteredMembers({
      facultyMembers: (currentTeam.facultyMembers || []).filter(
        member => member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query)
      ),
      coreTeam: (currentTeam.coreTeam || []).filter(
        member => member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query)
      ),
      teamMembers: (currentTeam.teamMembers || []).filter(
        member => member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query)
      )
    });
  }, [searchQuery, selectedYear, currentTeam]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSearchQuery(''); // Reset search when changing years
  };
  
  return (
    <div className="min-h-screen bg-primary/5">
      {/* Hero section */}
      <section className="bg-accent/10 pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-accent hover:text-accent-dark mb-8 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">Our Team</h1>
              <div className="w-20 h-1 bg-accent mb-6"></div>
              <p className="text-lg text-text-light leading-relaxed">
                Meet the passionate individuals driving innovation and entrepreneurship at IEDC LBSCEK. 
                Our team is dedicated to fostering a culture of innovation and helping students realize 
                their entrepreneurial potential.
              </p>
            </div>
            
            <div className="hidden md:flex justify-end">
              <motion.div 
                className="relative w-full max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-accent/30 rounded-lg"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cta/20 rounded-full"></div>
                <div className="bg-white shadow-lg p-6 rounded-lg relative z-10">
                  <h3 className="text-xl font-bold text-text-dark mb-2">IEDC LBSCEK Team {selectedYear}</h3>
                  <p className="text-text-light">
                    Innovation isn't just about ideas; it's about making those ideas happen through 
                    the efforts of dedicated individuals working together.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Year tabs */}
          <Tabs 
            tabs={availableYears}
            activeTab={selectedYear}
            onTabChange={handleYearChange}
          />
          
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-12">
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>
          
          {/* Team sections */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Faculty members */}
              {filteredMembers.facultyMembers.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">Faculty Members</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMembers.facultyMembers.map(member => (
                      <TeamCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Core team */}
              {filteredMembers.coreTeam.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">Core Team</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMembers.coreTeam.map(member => (
                      <TeamCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Team members */}
              {filteredMembers.teamMembers.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">Team Members</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMembers.teamMembers.map(member => (
                      <TeamCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* No results message */}
              {filteredMembers.facultyMembers.length === 0 && 
               filteredMembers.coreTeam.length === 0 && 
               filteredMembers.teamMembers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-text-light">
                    {searchQuery ? `No team members found for "${searchQuery}"` : `No team data available for ${selectedYear}`}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
