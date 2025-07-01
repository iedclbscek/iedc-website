import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import TeamCard from '../components/ui/TeamCard';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Add year filter
  const [filteredMembers, setFilteredMembers] = useState({
    facultyMembers: [],
    coreTeam: [],
    teamMembers: []
  });

  // Generate available years (2020 to current year + 1)
  const currentYear = new Date().getFullYear();
  const availableYears = [];
  for (let year = 2020; year <= currentYear + 1; year++) {
    availableYears.push(year);
  }

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const url = selectedYear 
          ? `${import.meta.env.VITE_API_URL}/api/users/public-team?year=${selectedYear}`
          : `${import.meta.env.VITE_API_URL}/api/users/public-team`;
        
        const response = await fetch(url);
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
  }, [selectedYear]); // Add selectedYear as dependency

  // Organize members by category and filter based on search query
  useEffect(() => {
    const organizeMembersByCategory = (members) => {
      // Ensure members is an array and filter out admin users
      if (!Array.isArray(members)) {
        return { facultyMembers: [], coreTeam: [], teamMembers: [] };
      }
      
      // Filter out admin users from public display
      const publicMembers = members.filter(member => member.role !== 'admin');
      
      // Helper function to get role and team role for the selected year
      const getRoleForYear = (member, year) => {
        const yearlyRole = member.yearlyRoles?.find(yr => yr.year === year);
        if (yearlyRole) {
          return {
            role: yearlyRole.role,
            teamRole: yearlyRole.teamRole
          };
        }
        // Fallback to general role if no yearly role found
        return {
          role: member.role,
          teamRole: member.teamRole
        };
      };
      
      const facultyMembers = publicMembers.filter(member => {
        const memberRole = getRoleForYear(member, selectedYear);
        return memberRole.role === 'nodal_officer' || 
               (memberRole.teamRole && memberRole.teamRole.toLowerCase().includes('faculty'));
      });
      
      const coreTeam = publicMembers.filter(member => {
        const memberRole = getRoleForYear(member, selectedYear);
        return ['ceo', 'lead', 'co_lead', 'coordinator'].includes(memberRole.role) ||
               (memberRole.teamRole && ['CEO', 'Lead', 'Co-Lead', 'Coordinator'].some(role => 
                 memberRole.teamRole.toLowerCase().includes(role.toLowerCase())
               ));
      });
      
      const teamMembersFiltered = publicMembers.filter(member => {
        const memberRole = getRoleForYear(member, selectedYear);
        return !['ceo', 'lead', 'co_lead', 'coordinator', 'nodal_officer'].includes(memberRole.role) &&
               !(memberRole.teamRole && ['President', 'Vice President', 'Secretary', 'Treasurer', 'Faculty', 'CEO', 'Lead', 'Co-Lead', 'Coordinator'].some(role => 
                 memberRole.teamRole.toLowerCase().includes(role.toLowerCase())
               ));
      });
      
      return { facultyMembers, coreTeam, teamMembers: teamMembersFiltered };
    };

    if (!searchQuery.trim()) {
      setFilteredMembers(organizeMembersByCategory(teamMembers));
      return;
    }
    
    const query = searchQuery.toLowerCase();
    // Helper function to get role and team role for the selected year for search
    const getRoleForYear = (member, year) => {
      const yearlyRole = member.yearlyRoles?.find(yr => yr.year === year);
      if (yearlyRole) {
        return {
          role: yearlyRole.role,
          teamRole: yearlyRole.teamRole
        };
      }
      return {
        role: member.role,
        teamRole: member.teamRole
      };
    };
    
    // Ensure teamMembers is an array before filtering and exclude admin users
    const filtered = Array.isArray(teamMembers) ? teamMembers.filter(
      member => {
        if (member.role === 'admin') return false; // Exclude admin users from search results
        
        const memberRole = getRoleForYear(member, selectedYear);
        return member.name?.toLowerCase().includes(query) || 
               memberRole.role?.toLowerCase().includes(query) ||
               memberRole.teamRole?.toLowerCase().includes(query);
      }
    ) : [];
    
    setFilteredMembers(organizeMembersByCategory(filtered));
  }, [searchQuery, teamMembers, selectedYear]); // Add selectedYear to dependencies
  
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
          {/* Search and Filter controls */}
          <div className="max-w-2xl mx-auto mb-8 space-y-4">
            {/* Year Filter */}
            <div className="text-center">
              <label className="block text-sm font-medium text-text-dark mb-2">
                Select Team Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year} {year === currentYear ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Search bar */}
            <div>
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>
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
                      <TeamCard key={member._id || member.id} member={member} selectedYear={selectedYear} />
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
                      <TeamCard key={member._id || member.id} member={member} selectedYear={selectedYear} />
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
                      <TeamCard key={member._id || member.id} member={member} selectedYear={selectedYear} />
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