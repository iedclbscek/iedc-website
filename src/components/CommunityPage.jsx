import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaLinkedin, FaGithub } from 'react-icons/fa';

const communityData = {
  mulearn: {
    name: "Mulearn",
    description: "Learning community focused on peer learning and skill development",
    icon: "🎓",
    longDescription: "μLearn is a peer-learning platform that engages students in skill development using the power of technology. It provides students with opportunities to learn together, enhance their abilities, and achieve both technical and professional growth.",
    whyWeDoIt: "μLearn operates on Discord, a social platform, using a game-like learning structure. Students get access to the μLearn Discord server, where they receive diverse tasks. As they complete tasks, they progress through different levels. Certified mentors evaluate their submissions and provide genuine feedback. Students earn Karma Points for completing tasks, contributing to both personal skill growth and their college's collective performance on the leaderboard.",
    whatWeDo: "μLearn aims to engage students in global projects and focus on skill development. We provide technical and career-oriented soft skills through platforms like Wadhwani Foundation and GitHub, offer personalized guidance from suitable mentors, and connect students with national and international networking opportunities.",
    whatWeProvide: {
      title: "Benefits of μLearn",
      items: [
        {
          name: "Skill Development",
          description: "Students gain hands-on experience through workshops, hackathons, webinars, and coding challenges"
        },
        {
          name: "Healthy Competition",
          description: "The Karma Points leaderboard fosters friendly competition among colleges"
        },
        {
          name: "Career Opportunities",
          description: "Helps students become industry-ready professionals through internships, hackathons, and projects"
        },
        {
          name: "Mentorship",
          description: "Offers personalized guidance from the most suitable mentors"
        }
      ]
    },
    vision: "To empower students to reach their full potential by creating a tech-enabled success pathway through skills, collaboration, and mentoring.",
    mission: "To engage students in global projects and focus on skill development while providing technical and career-oriented soft skills through various platforms and mentorship opportunities.",
    activities: [
      "Peer Learning Sessions",
      "Skill Development Workshops",
      "Project Collaborations",
      "Mentorship Programs",
      "Hackathons",
      "Webinars",
      "Coding Challenges"
    ],
    achievements: [
      "Best Learning Community 2023",
      "500+ Active Members",
      "100+ Successfully Completed Projects"
    ],
    execomTeam: [
      {
        name: "Ajmal P K",
        role: "Lead",
        image: "/img/team/ajmal.jpg",
        contact: "ajmalwlwl@gmail.com",
        linkedin: "https://www.linkedin.com/in/ajmalllw",
        github: "#"
      },
      {
        name: "Monika Devi",
        role: "Co-Lead",
        image: "/img/team/monika.jpg",
        contact: "monikadevilbsksd@gmail.com",
        linkedin: "https://www.linkedin.com/in/monika-devi-a049b433a",
        github: "#"
      }
    ],
    joinUs: "Join MuLearn to enhance your skills and connect with a community of passionate learners and professionals. Together, we create a tech-enabled success pathway through skills, collaboration, and mentoring!",
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
    longDescription: "The Microsoft Learn Student Ambassadors (MLSA) Club is a dynamic community of students passionate about technology, innovation, and leadership. We aim to empower students with the right skills, opportunities, and networks to excel in the ever-evolving tech industry.",
    whyWeDoIt: "Technology is reshaping the world at an unprecedented pace. To stay ahead, students need hands-on experience, collaboration, and continuous learning. The MLSA Club provides a platform for students to explore new technologies, build projects, engage in hackathons, and share knowledge. Through Microsoft Learn resources, mentorship, and global networking, we ensure that our members are equipped to solve real-world problems and drive innovation.",
    whatWeDo: "At the MLSA Club, we are committed to creating a supportive and thriving tech ecosystem. We provide exclusive learning materials, coding challenges, expert sessions, and industry connections to help students develop skills in AI, cloud computing, web development, and more. Our community-driven approach fosters collaboration and knowledge-sharing, ensuring that every student can unlock their full potential.",
    vision: "To build a passionate community of student innovators who leverage technology to make a meaningful impact on the world.",
    mission: "By 2025, we aim to cultivate a strong developer and maker community that empowers 10,000 students with the knowledge and skills to innovate, code, and lead the future of technology. We achieve this through peer learning, hands-on projects, and access to Microsoft's world-class resources.",
    activities: [
      "Tech Workshops",
      "Azure Training",
      "Community Projects",
      "Microsoft Events",
      "Coding Challenges",
      "Expert Sessions",
      "Hackathons"
    ],
    achievements: [
      "Gold Level Ambassadors",
      "20+ Certified Members",
      "Best MLSA Chapter 2023"
    ],
    execomTeam: [
      {
        name: "Thanseeha nasrin PM",
        role: "Lead (S2 CSE C)",
        image: "/img/team/thanc.jpg",
        contact: "thanseehanasrinpm@gmail.com",
        linkedin: "https://linkedin.com/in/thanseeha-na",
        github: "#"
      },
      {
        name: "S Akhil",
        role: "Co-Lead (S2 CSE A)",
        image: "/img/team/akhil.jpg",
        contact: "akhilsanal2007@gmail.com",
        linkedin: "https://www.linkedin.com/in/s-akhil-92ba83337",
        github: "#"
      }
    ],
    joinUs: "🚀 Join us, learn, build, and lead the future with MLSA!",
    contact: {
      email: "mlsa@iedc.com",
      coordinator: "Thanseeha nasrin PM"
    }
  },
  space: {
    name: "Space Club",
    description: "Exploring the Cosmos & Fostering Astronomical Curiosity",
    icon: "🚀",
    longDescription: "The Space Club is a dynamic community of space enthusiasts, aspiring astronomers, and cosmic explorers. Our mission is to promote space science education, cultivate astronomical interest, and provide opportunities for hands-on exploration of the universe beyond our atmosphere.",
    whyWeDoIt: "Space exploration represents humanity's greatest adventure—it's about discovery, pushing boundaries, and understanding our place in the cosmos. At the Space Club, we aim to inspire students with the wonders of astronomy and equip them with the knowledge to appreciate and contribute to space science.",
    whatWeDo: "Through stargazing sessions, space technology workshops, and expert talks, we connect our members to the vast universe that surrounds us.",
    whatWeProvide: {
      title: "What We Offer",
      items: [
        {
          name: "Observation Opportunities",
          description: "Regular stargazing events and astronomical observation sessions guided by experienced persons"
        },
        {
          name: "Space Education",
          description: "From rocket science to exoplanet discovery, expand your knowledge through workshops, lectures, and hands-on projects related to space technology"
        },
        {
          name: "Community & Connection",
          description: "Join a passionate community that shares the excitement of cosmic discovery. Participate in space-themed competitions, NASA project simulations, and collaborative research initiatives"
        }
      ]
    },
    vision: "To create a community of space-inspired individuals who appreciate astronomical wonders and contribute to humanity's understanding of the cosmos.",
    mission: "By 2025, engage 5,000+ students in space science activities, develop critical thinking through astronomical observation, and inspire the next generation of space scientists and engineers.",
    activities: [
      "Regular Stargazing Events",
      "Space Technology Workshops",
      "Expert Talks",
      "NASA Project Simulations",
      "Space-themed Competitions",
      "Collaborative Research Initiatives"
    ],
    achievements: [
      "Created a Space Club stall at Innovation Corner"
    ],
    execomTeam: [
      {
        name: "Aneena Chandran",
        role: "Lead",
        image: "/img/team/aneena.jpg",
        contact: "aneenachandran179545@gmail.com",
        linkedin: "https://www.linkedin.com/in/aneena-chandran-aa9295324",
        github: "#"
      },
      {
        name: "Kasim Afraz A",
        role: "Co-Lead",
        image: "/img/team/afraz.jpg",
        contact: "Kasimafrazz@gmail.com",
        linkedin: "https://www.linkedin.com/in/kasim-afraz-159b8626b",
        github: "#"
      }
    ],
    joinUs: "Ready to embark on your cosmic journey? Join the Space Club today! Be part of an inspiring community, learn from space enthusiasts and professionals, and discover the wonders of the universe. Remember, every great astronomical discovery begins with looking up at the night sky. Let's explore the cosmos together! 🌠",
    contact: {
      email: "space@iedc.com",
      coordinator: "Aneena Chandran"
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
    description: "Fostering Innovation & Entrepreneurial Mindset",
    icon: "💼",
    longDescription: "The Entrepreneurship Development (ED) Club is a vibrant community of passionate innovators and aspiring entrepreneurs. Our mission is to foster creativity, empower future business leaders, and provide a platform for growth and success.",
    whyWeDoIt: "Entrepreneurship is more than just starting a business—it's about solving problems, creating value, and making a positive impact. At the ED Club, we aim to equip students with the skills, knowledge, and confidence to thrive in a competitive world.",
    whatWeDo: "Through expert mentorship, strategic networking, and hands-on projects, we empower our members to turn their ideas into successful ventures.",
    whatWeProvide: {
      title: "What We Offer",
      items: [
        {
          name: "Networking Opportunities",
          description: "Connect with fellow entrepreneurs, share ideas, and collaborate on exciting projects through regular networking events, workshops, and guest speaker sessions"
        },
        {
          name: "Skill Enhancement",
          description: "From idea development to business execution, gain valuable insights through skill-building workshops, mentorship programs, and expert resources"
        },
        {
          name: "Inspiration and Support",
          description: "Join a supportive community that understands the challenges and triumphs of entrepreneurship. We believe in lifting each other up and celebrating every milestone"
        }
      ]
    },
    vision: "To cultivate a thriving entrepreneurial ecosystem where students are inspired to innovate, create, and lead successful ventures.",
    mission: "By 2025, empower 5,000+ students to develop entrepreneurial skills, launch successful startups, and create meaningful solutions.",
    activities: [
      "Networking Events",
      "Skill-building Workshops",
      "Mentorship Programs",
      "Guest Speaker Sessions",
      "Startup Development Programs",
      "Business Plan Competitions"
    ],
    achievements: [
      "Recognized as a Leading ED Club 2024",
      "10+ Startups initiated by members",
      "5+ Funding Grants secured for innovative ideas"
    ],
    execomTeam: [
      {
        name: "Umar Al Mukhtar Ibrahimkutty",
        role: "Lead",
        image: "/img/team/umar.jpg",
        contact: "umar1868807@gmail.com",
        linkedin: "https://www.linkedin.com/in/umaralmukhtaribrahimkutty",
        github: "#"
      },
      {
        name: "Sanjay K P",
        role: "Co-Lead",
        image: "/img/team/sanjay.jpg",
        contact: "sanjutechzzz@gmail.com",
        linkedin: "https://www.linkedin.com/in/sanjaykp03",
        github: "#"
      }
    ],
    joinUs: "Ready to embark on your entrepreneurial journey? Join the ED Club today! Be part of a dynamic community, learn from experienced entrepreneurs, and turn your ideas into reality. Remember, every successful venture starts with a single step. Let's build something amazing together! 🚀",
    contact: {
      email: "edclub@iedc.com",
      coordinator: "Umar Al Mukhtar Ibrahimkutty"
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
  kba: {
    name: "KBA Chapter",
    description: "Kerala Blockchain Academy community",
    icon: "⛓️",
    longDescription: "The Kerala Blockchain Academy (KBA) Chapter is a dynamic community dedicated to exploring and advancing blockchain technology. We bring together students, developers, and enthusiasts passionate about decentralized systems, smart contracts, and the future of Web3.",
    whyWeDoIt: "The blockchain revolution is reshaping industries, and staying ahead requires continuous learning and collaboration. The KBA Chapter fosters a culture of innovation where members can gain hands-on experience, work on real-world projects, and engage with experts in the field.",
    vision: "To empower students with the knowledge and skills needed to drive blockchain adoption and innovation, creating a community of blockchain leaders ready to tackle the challenges of tomorrow.",
    mission: "By 2025, the KBA Chapter aims to build a thriving ecosystem of blockchain enthusiasts, providing resources, mentorship, and opportunities for students to develop and deploy blockchain solutions that create real-world impact.",
    whatWeProvide: {
      title: "What We Offer",
      items: [
        {
          name: "Blockchain Education",
          description: "Learn about blockchain technology, cryptocurrencies, and decentralized systems"
        },
        {
          name: "Project Development",
          description: "Work on real blockchain projects and smart contract development"
        },
        {
          name: "Expert Mentorship",
          description: "Learn from experienced blockchain developers and industry professionals"
        },
        {
          name: "Networking",
          description: "Connect with blockchain enthusiasts and industry experts"
        }
      ]
    },
    activities: [
      "Blockchain Technology Workshops",
      "Smart Contract Development",
      "DApp Building Sessions",
      "Web3 Project Development",
      "Industry Expert Talks",
      "Hands-on Training Programs"
    ],
    achievements: [
      "Building a strong blockchain community",
      "Successful implementation of blockchain projects",
      "Organizing blockchain workshops and events"
    ],
    execomTeam: [
      {
        name: "Naeem Muhammed NP",
        role: "Lead (S2 CSE C)",
        image: "/img/team/naeem.jpg",
        contact: "naeemmuhammed4321@gmail.com",
        linkedin: "https://www.linkedin.com/in/naeem-muhammed-4a539a33b",
        github: "#"
      },
      {
        name: "Diya Nandana P",
        role: "Co-Lead (S2 Civil)",
        image: "/img/team/diya.jpg",
        contact: "diyanandana14@gmail.com",
        linkedin: "https://www.linkedin.com/in/diya-nandana-p-1b3739334",
        github: "#"
      }
    ],
    joinUs: "Join KBA Chapter to be part of the blockchain revolution! Whether you're a beginner or an experienced developer, there's a place for you in our community. For more information, visit kba.ai",
    contact: {
      email: "kba@iedc.com",
      coordinator: "Naeem Muhammed"
    }
  },
  coders: {
    name: "Coders Club",
    description: "Code. Create. Conquer.",
    icon: "💻",
    longDescription: "Welcome to the Coders Club! Are you passionate about coding? Do you dream of building real-world projects, enhancing your technical skills, and boosting your career? The Coders Club at LBS College of Engineering is your gateway to an exciting world of coding, innovation, and collaboration. Whether you're just starting your coding journey or an experienced programmer looking for challenges, this is the place to learn, create, and grow!",
    vision: "To create a thriving community of programmers who learn, innovate, and collaborate to tackle real-world challenges through technology. We aim to bridge the gap between academic knowledge and industry demands, helping students transform into skilled professionals.",
    mission: "The Coders Club is dedicated to empowering students by providing hands-on experience, mentorship, and opportunities to work on real-world projects. Our goal is to help students develop strong problem-solving skills, build innovative applications, and become industry-ready developers.",
    whatWeProvide: {
      title: "Why Join the Coders Club?",
      items: [
        {
          name: "Real-World Projects",
          description: "Gain practical experience by working on exciting coding challenges"
        },
        {
          name: "Skill Development",
          description: "Improve your programming, debugging, and software development skills"
        },
        {
          name: "Expert Mentorship",
          description: "Learn from experienced coders and industry professionals"
        },
        {
          name: "Collaborative Learning",
          description: "Work with like-minded peers and share knowledge"
        },
        {
          name: "Resume & Profile Boosting",
          description: "Strengthen your portfolio with hands-on projects and certifications"
        },
        {
          name: "Hackathons & Competitions",
          description: "Prepare for coding challenges and industry events"
        },
        {
          name: "Career Guidance",
          description: "Get insights into job opportunities and industry trends"
        }
      ]
    },
    activities: [
      "Real-World Project Development",
      "Coding Workshops and Training",
      "Hackathons and Competitions",
      "Technical Skill Development",
      "Industry Expert Sessions",
      "Collaborative Learning Programs"
    ],
    achievements: [
      "Successfully completed multiple real-world projects",
      "Organized coding competitions and hackathons",
      "Helped members secure internships and job opportunities"
    ],
    execomTeam: [
      {
        name: "Mohammed Nihal A A",
        role: "Lead (S2 CSA)",
        image: "/img/team/nihal.jpg",
        contact: "mnaaksd2@gmail.com",
        linkedin: "https://www.linkedin.com/in/devnihal",
        github: "#"
      },
      {
        name: "ABUBACKER AFNAN K",
        role: "Co-Lead (S6 ECE)",
        image: "/img/team/afnan.jpg",
        contact: "abubackerafnan1211@gmail.com",
        linkedin: "https://www.linkedin.com/in/abubacker-afnan-k-475b12263",
        github: "#"
      }
    ],
    joinUs: "The Coders Club isn't just about writing code—it's about creating impact, solving real problems, and shaping the future of technology. Becoming a part of the Coders Club is simple! Just fill out the registration form and start your journey toward coding excellence. Join us to Code, Create, and Conquer! 🚀",
    contact: {
      email: "coders@iedc.com",
      coordinator: "Mohammed Nihal A A"
    }
  },
  wow: {
    name: "WOW (Women of Wonders)",
    description: "Empowering women in technology and engineering",
    icon: "👩‍💻",
    longDescription: "The WOW (Women of Wonders) Club at LBS College of Engineering is an empowering student-driven community dedicated to inspiring, educating, and uplifting women in technology and engineering. Our goal is to create an environment where female students can hone their skills, build confidence, and pursue leadership roles in the ever-evolving world of tech.",
    whyWeDoIt: "At WOW, we recognize the need for greater female representation and leadership in technology. The tech industry continues to thrive, and it's essential for women to be equally represented in this fast-growing field. We aim to create opportunities that encourage women to explore STEM careers, empower them with knowledge and skills, and foster a community of support and mentorship.",
    whatWeDo: "By focusing on skill development, networking, and leadership training, we work to ensure that women are not just participants but leaders in the tech world.",
    whatWeProvide: {
      title: "What We Offer",
      items: [
        {
          name: "Skill Development Workshops",
          description: "Master programming, coding, and emerging tech"
        },
        {
          name: "Mentorship Programs",
          description: "Connect with inspiring female tech leaders and role models"
        },
        {
          name: "Networking Events",
          description: "Engage with professionals and build lasting connections in the tech industry"
        },
        {
          name: "Interactive Competitions",
          description: "Join coding challenges, hackathons, and team-based contests"
        },
        {
          name: "Leadership Training",
          description: "Develop leadership and management skills for future roles in tech"
        },
        {
          name: "Career Guidance & Opportunities",
          description: "Gain access to internships, job placements, and career advice"
        }
      ]
    },
    vision: "To empower and inspire women to lead in technology by fostering a community that promotes growth, technical excellence, and leadership potential.",
    mission: "By 2025, we aim to equip women with the skills, confidence, and resources needed to excel in the tech industry. We will provide hands-on workshops, mentorship, and networking opportunities, creating a robust pipeline of women ready to take on leadership roles and innovation in the field of technology.",
    activities: [
      "Skill Development Workshops",
      "Mentorship Programs",
      "Networking Events",
      "Interactive Competitions",
      "Leadership Training",
      "Career Guidance Sessions"
    ],
    achievements: [
      "Building a supportive community for women in tech",
      "Organizing successful workshops and events",
      "Creating mentorship opportunities"
    ],
    execomTeam: [
      {
        name: "Gopika Ragesh",
        role: "Lead (S2 ME)",
        image: "/img/team/gopika.jpg",
        contact: "gopikaragesh1234@gmail.com",
        linkedin: "https://www.linkedin.com/in/gopika-ragesh-b00791305",
        github: "#"
      }
    ],
    joinUs: "Join the WOW Club and become a part of a transformative movement for women in all field! Together, we can create a future where women lead, innovate, and succeed in technology.",
    contact: {
      email: "wow@iedc.com",
      coordinator: "Gopika Ragesh"
    }
  },
  "aws-club": {
    name: "AWS Club",
    description: "Amazon Web Services community",
    icon: "☁️",
    longDescription: "The AWS Club at LBS College of Engineering is a student-driven community focused on cloud computing, AWS technologies, and innovation. We aim to empower students with cloud skills, hands-on experience, and career opportunities in the fast-growing tech industry.",
    whyWeDoIt: "Cloud computing is shaping the future, and AWS is at the forefront of this transformation. At AWS Club, we ensure students gain the knowledge, skills, and practical exposure needed to succeed in cloud-based careers. Technology is evolving rapidly, and students need to learn continuously, innovate, solve problems, and collaborate. Our workshops, hands-on projects, and interactive events are designed to develop these essential skills.",
    whatWeDo: "At AWS Club, we provide a dynamic learning environment through workshops, hands-on labs, orientation sessions, and interactive events.",
    whatWeProvide: {
      title: "What We Offer",
      items: [
        {
          name: "Workshops & Hands-on Labs",
          description: "Learn AWS fundamentals & cloud applications"
        },
        {
          name: "AWS Orientation Sessions",
          description: "Introducing students to cloud computing & career opportunities"
        },
        {
          name: "Interactive Events",
          description: "AWS Bingo, Cloud Quiz & fun learning activities"
        },
        {
          name: "Certifications & Career Guidance",
          description: "Helping students prepare for AWS certifications & job opportunities"
        }
      ]
    },
    vision: "To create a strong cloud computing community where students can learn, build, and grow with AWS, preparing for future careers in technology.",
    mission: "By 2025, we aim to train and equip students with AWS skills, enabling them to develop real-world projects, achieve certifications, and explore career opportunities in cloud computing. We achieve this through community-based learning, hands-on training, and industry collaboration.",
    activities: [
      "AWS Fundamentals Workshops",
      "Cloud Computing Labs",
      "AWS Certification Training",
      "Interactive Learning Events",
      "Career Guidance Sessions",
      "Project Development"
    ],
    achievements: [
      "Building a strong AWS community",
      "Conducting successful workshops and events",
      "Helping students achieve AWS certifications"
    ],
    execomTeam: [
      {
        name: "Thrisha K",
        role: "Lead (S2 IT)",
        image: "/img/team/thrisha.jpg",
        contact: "thrishathanish283@gmail.com",
        linkedin: "https://www.linkedin.com/in/thrisha-k-596514331",
        github: "#"
      },
      {
        name: "Fathima Rasha",
        role: "Co-Lead (S2 CSE C)",
        image: "/img/team/rasha.jpg",
        contact: "rashapaath@gmail.com",
        linkedin: "https://www.linkedin.com/in/fathima-rasha-2a35b5319",
        github: "#"
      },
      {
        name: "Liyana Langodan",
        role: "Co-Lead (S2 CSE C)",
        image: "/img/team/liyana.jpg",
        contact: "liyanalangodan96450@gmail.com",
        linkedin: "https://www.linkedin.com/in/liyana-langodan-b97724331",
        github: "#"
      }
    ],
    joinUs: "Join the AWS Club and be part of the cloud revolution! Whether you're a beginner or an experienced developer, there's something for everyone in our cloud community.",
    contact: {
      email: "aws@iedc.com",
      coordinator: "Thrisha K"
    }
  },
  wtm: {
    name: "Women Tech Makers (WTM)",
    description: "Google's Women Techmakers program empowering women in technology",
    icon: "👩‍💻",
    longDescription: "Google's Women Techmakers is a global program that provides visibility, community, and resources for women in technology, aiming to empower and encourage them to pursue and excel in tech careers.",
    whatWeProvide: {
      title: "What We Offer",
      items: [
        {
          name: "Community & Networking",
          description: "Connect with like-minded women, industry experts, and Google professionals"
        },
        {
          name: "Skill Development",
          description: "Gain hands-on experience in AI, coding, leadership, and professional growth"
        },
        {
          name: "Workshops & Events",
          description: "Attend exclusive talks, hackathons, and technical sessions"
        },
        {
          name: "Mentorship & Guidance",
          description: "Access mentorship programs to enhance career and personal development"
        },
        {
          name: "Visibility & Recognition",
          description: "Showcase your achievements and inspire the next generation"
        }
      ]
    },
    activities: [
      "Google-led Workshops",
      "Technical Training Sessions",
      "Leadership Development Programs",
      "Networking Events",
      "Mentorship Programs",
      "Hackathons"
    ],
    achievements: [
      "Building a supportive community for women in tech",
      "Organizing successful tech workshops and events",
      "Creating mentorship opportunities"
    ],
    execomTeam: [
      {
        name: "Sethulakshmi K V",
        role: "Lead (ME)",
        image: "/img/team/sethulakshmi.jpg",
        contact: "lsethu074@gmail.com",
        linkedin: "https://www.linkedin.com/in/sethu-lakshmi-1808ab331",
        github: "#"
      },
      {
        name: "Keerthana M",
        role: "Co-Lead (CSE A)",
        image: "/img/team/keerthana.jpg",
        contact: "keerthanakuthirakode@gmail.com",
        linkedin: "https://www.linkedin.com/in/keerthana-m-543929340",
        github: "#"
      }
    ],
    joinUs: "Women Techmakers is more than a program—it's a movement empowering women in technology. By joining us, you gain access to a global community, exclusive learning opportunities, and leadership development programs designed to help you thrive in tech.\n\nTop Reasons to Join:\n▪ Global Networking: Connect with tech professionals, mentors, and industry leaders worldwide.\n▪ Exclusive Learning Resources: Access Google-led workshops, talks, and training on AI, coding, and leadership.\n▪ Leadership & Impact: Organize events, mentor others, and contribute to a more inclusive tech community.\n▪ Career Growth: Enhance your skills, expand your network, and explore mentorship opportunities.\n▪ Visibility & Recognition: Get recognized for your contributions and inspire the next generation of women in tech.\n\nBe part of a supportive community driving change in the tech industry. Join us today!",
    contact: {
      email: "wtm@iedc.com",
      coordinator: "Sethulakshmi K V"
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
                {community.execomTeam && community.execomTeam.length > 0 ? (
                  <>
                    <p className="text-gray-600">Coordinator: {community.execomTeam[0].name}</p>
                    <p className="text-gray-600">Email: {community.execomTeam[0].contact}</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600">Coordinator: {community.contact.coordinator}</p>
                    <p className="text-gray-600">Email: {community.contact.email}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage; 