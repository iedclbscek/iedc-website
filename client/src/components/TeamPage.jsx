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
        linkedin: "https://www.linkedin.com/in/sarithdivakarm/",
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
        linkedin: "https://www.linkedin.com/in/vinodu-george-bb227611/",
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
        linkedin: "https://www.linkedin.com/in/hridyaprabha-m-109214280/",
        github: "#"
      },
      {
        name: "Fathima Basheer MTP",
        role: "Operations Lead",
        image: "/img/team/2024/fathima.jpg",
        linkedin: "https://www.linkedin.com/in/fathimabasheermtp/",
        github: "#"
      },
      {
        name: "Oneela Gopi  ",
        role: "Operations Co-Lead",
        image: "/img/team/2024/oneela.jpg",
        linkedin: "https://www.linkedin.com/in/oneelagopi/",
        github: "#"
      },
      {
        name: "Umar Al Mukhtar Ibrahimkutty",
        role: "Technical Lead ",
        image: "/img/team/2024/umar.jpg",
        linkedin: "https://www.linkedin.com/in/umaralmukhtaribrahimkutty/",
        github: "#"
      },
      {
        name: "Krishnendu S",
        role: "Technical Co-Lead ",
        image: "/img/team/2024/krish.jpg",
        linkedin: "https://www.linkedin.com/in/krishnendu-s-933532328/",
        github: "#"
      },
      {
        name: "Fathima Rifda ",
        role: "Marketing Lead ",
        image: "/img/team/2024/rifda.jpg",
        linkedin: "https://www.linkedin.com/in/fathima-rifda-170486304/",
        github: "#"
      },
      {
        name: "Mohammed Riza ",
        role: "Marketing Co-Lead",
        image: "/img/team/2024/riza.jpg",
        linkedin: "https://www.linkedin.com/in/mohammed-riza-534820296/",
        github: "#"
      },
      {
        name: "Yadumithra U N ",
        role: "Creative Lead ",
        image: "/img/team/2024/yadu.jpg",
        linkedin: "https://www.linkedin.com/in/yadumithra-u-n/",
        github: "#"
      },
      {
        name: "Adhish R",
        role: "Creative  Co-Lead ",
        image: "/img/team/2024/adish.jpg",
        linkedin: "https://www.linkedin.com/in/adhishratheesh/",
        github: "#"
      },
      {
        name: "Sreesha S ",
        role: "Women Innovation Lead",
        image: "/img/team/2024/sreesha.jpg",
        linkedin: "https://www.linkedin.com/in/sreesha-sreedharan-410197292/",
        github: "#"
      },
      {
        name: "Harithasree P ",
        role: "Women Innovation  Co-Lead",
        image: "/img/team/2024/haritha.jpg",
        linkedin: "https://www.linkedin.com/in/harithasree-p-5824b2320/",
        github: "#"
      },
      {
        name: "Aiswarya A",
        role: "Community Lead",
        image: "/img/team/2024/aiswarya.jpg",
        linkedin: "https://www.linkedin.com/in/aiswarya-a-81187b280/",
        github: "#"
      },
      {
        name: "Remitha Mol A P",
        role: "Community Co-Lead",
        image: "/img/team/2024/remitha.jpg",
        linkedin: "https://www.linkedin.com/in/remitha-mol-a-p-951915280/",
        github: "#"
      },
      {
        name: "Anagha A ",
        role: "Finance Lead ",
        image: "/img/team/2024/anagha.jpg",
        linkedin: "https://www.linkedin.com/in/anagha-a-365838287/",
        github: "#"
      },
      {
        name: "Vishal Kodoth",
        role: "Finance Co-Lead",
        image: "/img/team/2024/vishal.jpg",
        linkedin: "https://www.linkedin.com/in/vishal-kodoth/",
        github: "#"
      },
      {
        name: "Shamil Cherukattuparambil",
        role: "IPR & Research Lead",
        image: "/img/team/2024/shamil.jpg",
        linkedin: "https://www.linkedin.com/in/shamil-shameer-336747272/",
        github: "#"
      },
      {
        name: "Abin N R",
        role: "IPR & Research Co-Lead",
        image: "/img/team/2024/abin.jpg",
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
      className="bg-white rounded-xl shadow-lg relative overflow-hidden group"
      onMouseEnter={() => setShowLinkedIn(true)}
      onMouseLeave={() => setShowLinkedIn(false)}
    >
      <div className="relative w-full aspect-square">
        {/* Profile Image */}
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-center group-hover:opacity-80 transition-all duration-300"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/150?text=${member.name.charAt(0)}`;
          }}
        />

        {/* LinkedIn Popup */}
        {member.linkedin && (
          <motion.div
            className="absolute bottom-4 left-0 w-full flex justify-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: showLinkedIn ? 0 : 100,
              opacity: showLinkedIn ? 1 : 0 
            }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            <motion.a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin size={20} />
              <span className="font-medium">Connect</span>
            </motion.a>
          </motion.div>
        )}
      </div>

      {/* Member Info */}
      <div className="p-4 bg-white">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{member.name}</h3>
        <p className="text-blue-600 font-semibold">{member.role}</p>
      </div>
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
      we welcome all—no prior experience needed! Just bring your enthusiasm and a sense of adventure. As for an application process, we believe in 'Join now, ask questions later! 
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