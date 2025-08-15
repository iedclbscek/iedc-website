import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import TeamCard from "../components/ui/TeamCard";
import {
  getTeamForYear,
  getAvailableYears
} from "../data/teamData";

const TeamPage = () => {
  // Retrieve available years from the helper function (descending order)
  const availableYears = getAvailableYears();
  const currentYear = new Date().getFullYear();
  // Default to most recent year available if current year isn't present
  const initialYear = availableYears.includes(currentYear.toString())
    ? currentYear
    : parseInt(availableYears[0]);

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [filteredMembers, setFilteredMembers] = useState(getTeamForYear(initialYear));
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Whenever year changes, update visible members for that year
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFilteredMembers(getTeamForYear(selectedYear));
      setLoading(false);
    }, 100);
  }, [selectedYear]);

  // Handle search functionality
  useEffect(() => {
    const membersForYear = getTeamForYear(selectedYear);
    if (!searchQuery.trim()) {
      setFilteredMembers(membersForYear);
      return;
    }
    const query = searchQuery.toLowerCase();

    // Filtering helper
    const filterMembers = arr =>
      Array.isArray(arr)
        ? arr.filter(
            m =>
              m.name?.toLowerCase().includes(query) ||
              m.role?.toLowerCase().includes(query)
          )
        : [];

    setFilteredMembers({
      year: selectedYear,
      facultyMembers: filterMembers(membersForYear.facultyMembers),
      coreTeam: filterMembers(membersForYear.coreTeam),
      teamMembers: filterMembers(membersForYear.teamMembers)
    });
  }, [searchQuery, selectedYear]);

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Hero section */}
      <section className="bg-accent/10 pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-accent hover:text-accent-dark mb-8 transition-colors"
          >
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
                onChange={e => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year} {parseInt(year) === currentYear ? "(Current)" : ""}
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
                onChange={e => setSearchQuery(e.target.value)}
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
              {filteredMembers.facultyMembers && filteredMembers.facultyMembers.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-text-dark mb-6 text-center">Faculty Members</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMembers.facultyMembers.map(member => (
                      <TeamCard key={member.id} member={member} selectedYear={selectedYear} />
                    ))}
                  </div>
                </div>
              )}

              {/* Core team */}
              {filteredMembers.coreTeam && filteredMembers.coreTeam.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-text-dark mb-6 text-center">Core Team</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMembers.coreTeam.map(member => (
                      <TeamCard key={member.id} member={member} selectedYear={selectedYear} />
                    ))}
                  </div>
                </div>
              )}

              {/* Team members */}
              {filteredMembers.teamMembers && filteredMembers.teamMembers.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-text-dark mb-6 text-center">Team Members</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMembers.teamMembers.map(member => (
                      <TeamCard key={member.id} member={member} selectedYear={selectedYear} />
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {(!filteredMembers.facultyMembers ||
                filteredMembers.facultyMembers.length === 0) &&
                (!filteredMembers.coreTeam || filteredMembers.coreTeam.length === 0) &&
                (!filteredMembers.teamMembers || filteredMembers.teamMembers.length === 0) &&
                !loading && (
                  <div className="text-center py-12">
                    <p className="text-text-light">
                      {searchQuery
                        ? `No team members found for "${searchQuery}"`
                        : "No team members available"}
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
  