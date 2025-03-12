import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const teamData = {
  "2025": {
    year: "2025",
    teachingStaff: [
      {
        name: "Dr. Faculty One",
        role: "Professor",
        image: "/img/teaching/2025/faculty1.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Dr. Faculty Two",
        role: "Assistant Professor",
        image: "/img/teaching/2025/faculty2.jpg",
        linkedin: "#",
        github: "#"
      }
    ],
    members: Array(20).fill(null).map((_, index) => ({
      name: `Team Member ${index + 1}`,
      role: ["Student CEO", "Technical Lead", "Marketing Lead", "Design Lead", "Project Manager", "Community Manager", "Innovation Lead", "Operations Lead"][index % 8],
      image: `/img/team/2025/${index + 1}.jpg`,
      bio: "Contributing to the growth and success of IEDC LBSCEK",
      linkedin: "#",
      github: "#"
    }))
  },
  "2024": {
    year: "2024",
    teachingStaff: [
      {
        name: "Dr. Sarith Divakar M",
        role: "Nodal Officer",
        image: "/img/team/2024/sarith.jpeg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Dr. Arathi T",
        role: "Nodal Officer",
        image: "/img/team/2024/arathi.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Dr. Vinodu George",
        role: "President(IIC)",
        image: "/img/team/2024/vinod.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Prof. Sheeja V",
        role: "Vice President(IIC)",
        image: "/img/team/2024/sheeja.jpg",
        linkedin: "#",
        github: "#"
      }
    ],
    
    members: [
      {
        name: "K E Nandagopal",
        role: "CEO",
        image: "/img/team/2024/ke.jpg",
        linkedin: "https://www.linkedin.com/in/kenandagopal/",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },
      {
        name: "Hridyaprabha M ",
        role: "CO-CEO",
        image: "/img/team/2024/haridapriya.jpg",
        linkedin: "#",
        github: "#"
      },

    ]
  },

};
const TeamMember = ({ member }) => {
  const [showLinkedIn, setShowLinkedIn] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 text-center relative"
      onMouseEnter={() => setShowLinkedIn(true)}
      onMouseLeave={() => setShowLinkedIn(false)}
    >
      <div className="relative w-40 h-40 mx-auto mb-4">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=' + member.name.charAt(0);
          }}
        />
        {showLinkedIn && member.linkedin && (
          <motion.a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-700 text-white rounded-full p-2 transition-opacity"
            style={{ opacity: showLinkedIn ? 1 : 0 }}
          >
            <FaLinkedin size={20} />
          </motion.a>
        )}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-2">{member.name}</h3>
      <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
    </motion.div>
  );
};

const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-start mb-12" // Adjusted to flex and items-start
  >
    <div className="w-1/2 text-left pr-8"> {/* Left side with text */}
      <h1 className="text-5xl font-bold text-blue-900 mb-4">IEDC TEAM</h1>
      <h2 className="text-3xl text-green-500 mb-4">It's our team!</h2>
      <FaInfoCircle className="inline-block text-gray-600 text-xl mb-4" />
      <p className="text-xl text-gray-600 max-w-3xl">
        The soul of an organisation is its team who consistently works for its upliftment.
        IEDC TKMCE holds the most creative and innovative leaders to guide you to your dreams and visions.
      </p>
    </div>
    <div className="w-1/2">
      {/* Placeholder for plus signs or other graphic elements. This is just an example. */}
      <div className="text-gray-300 text-5xl flex flex-wrap justify-end">
        {Array(30).fill('+').map((plus, index) => (
          <span key={index}>{plus}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

const YearNavigation = ({ selectedYear, onYearClick }) => (
  <div className="flex justify-center space-x-4 mb-8">
    {Object.keys(teamData)
      .sort((a, b) => b - a)
      .map(year => (
        <button
          key={year}
          className={`px-4 py-2 rounded-md ${selectedYear === year ? 'text-red-500 border-b-2 border-red-500 font-bold' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
          onClick={() => onYearClick(year)}
        >
          {year}
        </button>
      ))}
  </div>
);

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Search"
        className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};


const TeamSection = ({ year, teachingStaff, members, searchTerm }) => {
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachingStaff = teachingStaff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-20"
    >

      {teachingStaff && teachingStaff.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Teaching Staff {year}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {filteredTeachingStaff.map((member) => (
              <TeamMember key={member.name} member={member} />
            ))}
          </div>
        </>
      )}

      <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Team {year}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <TeamMember key={member.name} member={member} />
        ))}
      </div>
    </motion.div>
  );
};

const TeamPage = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [searchTerm, setSearchTerm] = useState('');

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredTeamData = selectedYear ? { [selectedYear]: teamData[selectedYear] } : teamData;


  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <HeroSection />

        <YearNavigation selectedYear={selectedYear} onYearClick={handleYearClick} />

        <SearchBar onSearch={handleSearch} />

        {Object.keys(filteredTeamData)
          .sort((a, b) => b - a)
          .map(year => (
            <TeamSection
              key={year}
              year={year}
              teachingStaff={filteredTeamData[year].teachingStaff} // Pass teaching staff
              members={filteredTeamData[year].members}
              searchTerm={searchTerm}
            />
          ))}
      </div>
    </div>
  );
};

export default TeamPage;