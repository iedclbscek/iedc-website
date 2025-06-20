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
      <section className="bg-accent/10 pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-accent hover:text-accent-dark mb-8 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">IEDC Execom '{selectedYear.substring(2)}</h1>
            <div className="w-20 h-1 bg-accent mb-6 mx-auto"></div>
            <p className="text-lg text-text-light leading-relaxed max-w-3xl mx-auto">
              Meet the passionate individuals driving innovation and entrepreneurship at IEDC LBSCEK.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Main content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Year tabs */}
          <Tabs 
            tabs={availableYears}
            activeTab={selectedYear}
            onTabChange={handleYearChange}
          />
          
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </div>
          
          {/* Team sections */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              {/* Faculty members */}
              {filteredMembers.facultyMembers.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-text-dark mb-6 text-center">Faculty Members</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMembers.facultyMembers.map(member => (
                      <TeamCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Core team */}
              {filteredMembers.coreTeam.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-text-dark mb-6 text-center">Core Team</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMembers.coreTeam.map(member => (
                      <TeamCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Team members */}
              {filteredMembers.teamMembers.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-text-dark mb-6 text-center">Team Members</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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