import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import TeamCard from '../components/ui/TeamCard';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState({
    facultyMembers: [],
    coreTeam: [],
    teamMembers: []
  });

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/public-team`);
        if (response.ok) {
          const data = await response.json();
          // Handle the server response format { success, users, count }
          if (data.success && Array.isArray(data.users)) {
            setTeamMembers(data.users);
          } else {
            console.error('Invalid API response format:', data);
            setTeamMembers([]);
          }
        } else {
          console.error('Failed to fetch team members:', response.status);
          setTeamMembers([]);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Organize members by category and filter based on search query
  useEffect(() => {
    const organizeMembersByCategory = (members) => {
      // Ensure members is an array
      if (!Array.isArray(members)) {
        return { facultyMembers: [], coreTeam: [], teamMembers: [] };
      }
      
      const facultyMembers = members.filter(member => 
        member.role === 'nodal_officer' || 
        (member.teamRole && member.teamRole.toLowerCase().includes('faculty'))
      );
      
      const coreTeam = members.filter(member => 
        ['admin', 'ceo', 'lead'].includes(member.role) ||
        (member.teamRole && ['President', 'Vice President', 'Secretary', 'Treasurer'].includes(member.teamRole))
      );
      
      const teamMembersFiltered = members.filter(member => 
        !['admin', 'ceo', 'lead', 'nodal_officer'].includes(member.role) &&
        !(member.teamRole && ['President', 'Vice President', 'Secretary', 'Treasurer', 'Faculty'].some(role => 
          member.teamRole.toLowerCase().includes(role.toLowerCase())
        ))
      );
      
      return { facultyMembers, coreTeam, teamMembers: teamMembersFiltered };
    };

    if (!searchQuery.trim()) {
      setFilteredMembers(organizeMembersByCategory(teamMembers));
      return;
    }
    
    const query = searchQuery.toLowerCase();
    // Ensure teamMembers is an array before filtering
    const filtered = Array.isArray(teamMembers) ? teamMembers.filter(
      member => 
        member.name?.toLowerCase().includes(query) || 
        member.role?.toLowerCase().includes(query) ||
        member.teamRole?.toLowerCase().includes(query)
    ) : [];
    
    setFilteredMembers(organizeMembersByCategory(filtered));
  }, [searchQuery, teamMembers]);
  
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
            <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">IEDC Team</h1>
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-light">Loading team members...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
               filteredMembers.teamMembers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-text-light">
                    {searchQuery ? `No team members found for "${searchQuery}"` : 'No team members available'}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;