import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaLinkedin, FaGithub } from 'react-icons/fa';

const communityData = {
  mulearn: {
    name: "Mulearn",
    description: "Learning community focused on peer learning and skill development",
    icon: "🎓",
    longDescription: "Mulearn is an innovative learning platform that offers personalized educational experiences through adaptive technology, interactive content, and community collaboration. It enables learners to acquire new skills and knowledge at their own pace, with expert instructors and engaging content tailored to meet personal and professional development needs.",
    whatWeProvide: {
      title: "What We Provide",
      items: [
        {
          name: "Practical Learning",
          description: "Emphasizing hands-on experience through projects and workshops."
        },
        {
          name: "Accessibility",
          description: "Providing learning resources that are available to a wide audience."
        },
        {
          name: "Community Building",
          description: "Fostering a supportive network of learners and mentors."
        },
        {
          name: "Career Advancement",
          description: "Helping individuals improve their employability and career prospects."
        }
      ]
    },
    joinUs: "Join MuLearn to enhance your skills and connect with a community of passionate learners and professionals.",
    activities: ["Peer Learning Sessions", "Skill Development Workshops", "Project Collaborations", "Mentorship Programs"],
    achievements: ["Best Learning Community 2023", "500+ Active Members", "100+ Successfully Completed Projects"],
    contact: {
      email: "mulearn@iedc.com",
      coordinator: "Ajmal P K"
    }
  },
  thinkerhub: {
    name: "Thinkerhub",
    description: "Innovation and technology learning community",
    icon: "💡",
    longDescription: "TinkerHub Foundation is a community of tinkerers, makers & students - working towards mapping and empowering people who share a passion to innovate.",
    vision: "We are here to ensure that everyone has access to the knowledge required to set the course for a better future.",
    mission: "By 2025, cultivate a thriving maker culture in Kerala to ignite creativity and equip 10,000 young makers with the skills to innovate and shape the future.",
    whyWeDoIt: "The world is changing rapidly, and we must adapt. At TinkerHub Campus Community, we ensure the young generation acquires the knowledge and tools to build a better future for themselves and the world. Over the last decade, we realized, to drive large-scale change, our students need to learn continuously, innovate, solve problems, and collaborate massively. Our programs, projects, and resources revolve around developing these core areas.",
    whatWeDo: "At TinkerHub, we are committed to empowering our Campus Community through a combination of comprehensive resources, personalized mentorship, and engaging learning events. We have an extensive library of learning materials and tools, ensuring students have everything they need to manifest their true potential.",
    activities: ["Innovation Workshops", "Hackathons", "Tech Talks", "Project Showcases"],
    achievements: ["Best Innovation Hub 2023", "20+ Successful Projects", "5+ Patent Applications"],
    execomTeam: [
      {
        name: "Dr. Sarith Divakar M",
        role: "Staff Coordinator",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SR",
        contact: "sarith@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/sreeraj-r",
        github: "https://github.com/sarithdivakar"
      },
      {
        name: "Sreenidhi CV",
        role: "Campus Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=RK",
        contact: "rahul@thinkerhub.org",
        linkedin: "https://linkedin.com/in/sreenidhi-cv",
        github: "https://github.com/sreenidhicv"
      },
      {
        name: "Mariyamath Luba",
        role: "Co-lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=PS",
        contact: "mariyamathluba@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/mariyamathluba",
        github: "https://github.com/mariyamathluba"
      },
      {
        name: "Shivanandh V",
        role: "Co-lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AM",
        contact: "shivanandh@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/shivanandh-v",
        github: "https://github.com/shivanandh-v"
      },
      {
        name: "Oneela Gopi",
        role: "Women in tech lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SP",
        contact: "oneelagopi@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/oneelagopi",
        github: "https://github.com/oneelagopi"
      },
      {
        name: "joyal Josaph",
        role: "outreach Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=KR",
        contact: "joyaljosaph@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/joyaljosaph",
        github: "https://github.com/joyaljosaph"
      }
    ],
    contact: {
      email: "thinkerhub@iedc.com",
      coordinator: "Srinidhi C V"
    }
  },
  cyber: {
    name: "Cyber",
    description: "Cybersecurity and digital safety community",
    icon: "🔒",
    longDescription: "The Cyber community focuses on cybersecurity awareness, ethical hacking, and digital safety. Members learn about the latest security threats and how to protect against them.",
    activities: ["Security Workshops", "CTF Competitions", "Security Audits", "Cyber Awareness Programs"],
    achievements: ["Best Security Community 2023", "10+ Security Certifications", "Successfully Protected College Network"],
    contact: {
      email: "cyber@iedc.com",
      coordinator: "Abin N R"
    }
  },
  floss: {
    name: "Floss",
    description: "Free/Libre and Open Source Software community",
    icon: "🔓",
    longDescription: "FLOSS promotes the use and development of free and open-source software. The community contributes to various open-source projects and helps students understand the importance of open source.",
    activities: ["Open Source Contributions", "Linux Workshops", "Code Sprints", "FOSS Awareness Programs"],
    achievements: ["100+ Open Source Contributions", "Best FOSS Community 2023", "5+ Major Project Releases"],
    contact: {
      email: "floss@iedc.com",
      coordinator: "Sarah Williams"
    }
  },
  mlsa: {
    name: "MLSA",
    description: "Microsoft Learn Student Ambassadors",
    icon: "📱",
    longDescription: "MLSA is a global program that provides students with resources and opportunities to learn about Microsoft technologies and develop leadership skills.",
    activities: ["Tech Workshops", "Azure Training", "Community Projects", "Microsoft Events"],
    achievements: ["Gold Level Ambassadors", "20+ Certified Members", "Best MLSA Chapter 2023"],
    contact: {
      email: "mlsa@iedc.com",
      coordinator: "Michael Brown"
    }
  },
  space: {
    name: "Space",
    description: "Space technology and astronomy enthusiasts",
    icon: "🚀",
    longDescription: "The Space community brings together students interested in space technology, astronomy, and exploration. Members work on space-related projects and organize stargazing events.",
    activities: ["Astronomy Nights", "Satellite Projects", "Space Tech Workshops", "Research Programs"],
    achievements: ["Best Space Tech Project 2023", "2 Satellite Launches", "NASA Space Apps Challenge Winners"],
    contact: {
      email: "space@iedc.com",
      coordinator: "Emily Clark"
    }
  },
  gdg: {
    name: "GDG",
    description: "Google Developer Groups community",
    icon: "🌐",
    longDescription: "GDG is a community of developers interested in Google's developer technology. The group organizes events and workshops to help members learn and grow.",
    activities: ["DevFests", "Code Labs", "Study Jams", "Tech Talks"],
    achievements: ["Best GDG Chapter 2023", "1000+ Event Participants", "10+ Google Certifications"],
    contact: {
      email: "gdg@iedc.com",
      coordinator: "David Lee"
    }
  },
  "ed-club": {
    name: "ED club",
    description: "Entrepreneurship Development club",
    icon: "💼",
    longDescription: "The ED Club focuses on developing entrepreneurial skills and mindset among students. Members work on business ideas and learn from successful entrepreneurs.",
    activities: ["Startup Workshops", "Business Plan Competitions", "Mentorship Sessions", "Networking Events"],
    achievements: ["10+ Successful Startups", "Best ED Club 2023", "₹1M+ Funding Raised"],
    contact: {
      email: "edclub@iedc.com",
      coordinator: "Rachel Green"
    }
  },
  "yip-club": {
    name: "YIP club",
    description: "Young Innovators Program club",
    icon: "✨",
    longDescription: "YIP Club nurtures young innovators by providing them with resources, mentorship, and opportunities to work on innovative projects.",
    activities: ["Innovation Workshops", "Project Development", "Design Thinking Sessions", "Prototype Development"],
    achievements: ["15+ Patents Filed", "Best Innovation Club 2023", "National Innovation Awards"],
    contact: {
      email: "yip@iedc.com",
      coordinator: "Tom Wilson"
    }
  },
  robotics: {
    name: "Robotics",
    description: "Robotics and automation community",
    icon: "🤖",
    longDescription: "The Robotics community focuses on building and programming robots. Members work on various robotics projects and participate in competitions.",
    activities: ["Robot Building", "Programming Workshops", "Competition Training", "Project Showcases"],
    achievements: ["National Robotics Champions", "10+ Competition Wins", "5+ Industrial Projects"],
    contact: {
      email: "robotics@iedc.com",
      coordinator: "Chris Anderson"
    }
  },
  "fsa-club": {
    name: "FSA club",
    description: "Firefox Student Ambassadors club",
    icon: "🦊",
    longDescription: "FSA Club promotes Mozilla's mission of keeping the internet open and accessible. Members contribute to Mozilla projects and organize web literacy programs.",
    activities: ["Web Literacy Programs", "Firefox Contribution", "Open Web Workshops", "Mozilla Events"],
    achievements: ["Best FSA Chapter 2023", "100+ Web Literacy Programs", "Mozilla Recognition"],
    contact: {
      email: "fsa@iedc.com",
      coordinator: "Lisa Thompson"
    }
  },
  kba: {
    name: "KBA",
    description: "Kerala Blockchain Academy community",
    icon: "⛓️",
    longDescription: "KBA community focuses on blockchain technology education and development. Members learn about blockchain applications and work on related projects.",
    activities: ["Blockchain Courses", "DApp Development", "Research Projects", "Industry Collaborations"],
    achievements: ["Best Blockchain Community 2023", "5+ Enterprise Projects", "Successful ICO Launch"],
    contact: {
      email: "kba@iedc.com",
      coordinator: "Mark Davis"
    }
  },
  coders: {
    name: "Coders",
    description: "Programming and coding community",
    icon: "💻",
    longDescription: "The Coders community brings together programming enthusiasts to learn, collaborate, and build projects. Members participate in coding competitions and hackathons.",
    activities: ["Coding Competitions", "Algorithm Workshops", "Project Development", "Code Reviews"],
    achievements: ["ACM ICPC Finalists", "100+ Competition Wins", "Best Coding Club 2023"],
    contact: {
      email: "coders@iedc.com",
      coordinator: "Peter Zhang"
    }
  },
  wow: {
    name: "WOW",
    description: "Women in Tech community",
    icon: "👩‍💻",
    longDescription: "WOW empowers women in technology through mentorship, skill development, and networking opportunities. The community promotes diversity and inclusion in tech.",
    activities: ["Tech Workshops", "Mentorship Programs", "Career Guidance", "Networking Events"],
    achievements: ["Best Women in Tech Community 2023", "50+ Tech Leaders", "Gender Diversity Award"],
    contact: {
      email: "wow@iedc.com",
      coordinator: "Emma Martinez"
    }
  },
  "aws-club": {
    name: "AWS club",
    description: "Amazon Web Services community",
    icon: "☁️",
    longDescription: "AWS Club helps students learn about cloud computing and Amazon Web Services. Members work on cloud projects and prepare for AWS certifications.",
    activities: ["AWS Training", "Cloud Projects", "Certification Prep", "Industry Connect"],
    achievements: ["50+ AWS Certifications", "Best Cloud Community 2023", "AWS Community Day Hosts"],
    contact: {
      email: "aws@iedc.com",
      coordinator: "James Wilson"
    }
  }
};

const CommunityPage = () => {
  const { id } = useParams();
  const community = communityData[id] || {
    name: "Community Not Found",
    description: "This community page does not exist.",
    icon: "❓",
    longDescription: "Please check the URL or go back to the communities page.",
    activities: [],
    achievements: [],
    contact: {
      email: "",
      coordinator: ""
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link to="/communities" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <FaArrowLeft className="mr-2" />
          Back to Communities
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-6xl mb-6">{community.icon}</div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">{community.name}</h1>
          <p className="text-xl text-gray-600 mb-8">{community.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-4">About</h2>
              <p className="text-gray-600 mb-6">{community.longDescription}</p>

              {community.whatWeProvide && (
                <>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">{community.whatWeProvide.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {community.whatWeProvide.items.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-blue-900 mb-2">{item.name}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {community.joinUs && (
                <>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Join us!!</h2>
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <p className="text-blue-900 text-lg italic">{community.joinUs}</p>
                    <a
                      href="https://mulearn.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Visit MuLearn to read more →
                    </a>
                  </div>
                </>
              )}

              {community.whyWeDoIt && (
                <>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Why we do what we do?</h2>
                  <p className="text-gray-600 mb-6">{community.whyWeDoIt}</p>
                </>
              )}

              {community.whatWeDo && (
                <>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Then what?</h2>
                  <p className="text-gray-600 mb-6">{community.whatWeDo}</p>
                </>
              )}

              {community.vision && (
                <>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Vision</h2>
                  <p className="text-gray-600 mb-6">{community.vision}</p>
                </>
              )}

              {community.mission && (
                <>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Mission</h2>
                  <p className="text-gray-600 mb-6">{community.mission}</p>
                </>
              )}

              <h2 className="text-2xl font-bold text-blue-900 mb-4">Activities</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {community.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Achievements</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {community.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>

              {community.execomTeam && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6">Execom Team</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {community.execomTeam.map((member, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg text-blue-900">{member.name}</h3>
                          <p className="text-gray-600">{member.role}</p>
                          <p className="text-sm text-blue-600">{member.contact}</p>
                          <div className="flex space-x-3 mt-2">
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaLinkedin size={20} />
                            </a>
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-gray-900"
                            >
                              <FaGithub size={20} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Contact</h2>
                <p className="text-gray-600">Coordinator: {community.contact.coordinator}</p>
                <p className="text-gray-600">Email: {community.contact.email}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage; 