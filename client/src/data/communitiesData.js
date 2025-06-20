export const communities = [
  {
    id: "mulearn",
    name: "Mulearn",
    description:
      "Learning community focused on peer learning and skill development",
    icon: "🎓",
    path: "/communities/mulearn",
  },
  {
    id: "thinkerhub",
    name: "Thinkerhub",
    description: "Innovation and technology learning community",
    icon: "💡",
    path: "/communities/thinkerhub",
  },
  {
    id: "cyber",
    name: "Cyber",
    description: "Cybersecurity and digital safety community",
    icon: "🔒",
    path: "/communities/cyber",
  },
  {
    id: "floss",
    name: "FOSS Club",
    description: "Free/Libre and Open Source Software community",
    icon: "🔓",
    path: "/communities/floss",
  },
  {
    id: "mlsa",
    name: "MLSA",
    description: "Microsoft Learn Student Ambassadors",
    icon: "📱",
    path: "/communities/mlsa",
  },
  {
    id: "space",
    name: "Space Club",
    description: "Space technology and astronomy enthusiasts",
    icon: "🚀",
    path: "/communities/space",
  },
  {
    id: "gdg",
    name: "GDG",
    description: "Google Developer Groups community",
    icon: "🌐",
    path: "/communities/gdg",
  },
  {
    id: "ed-club",
    name: "ED club",
    description: "Entrepreneurship Development club",
    icon: "💼",
    path: "/communities/ed-club",
  },
  {
    id: "yip-club",
    name: "YIP club",
    description: "Young Innovators Program club",
    icon: "✨",
    path: "/communities/yip-club",
  },
  {
    id: "wtm",
    name: "Women Tech Makers",
    description:
      "Google's Women Techmakers program empowering women in technology",
    icon: "👩‍💻",
    path: "/communities/wtm",
  },
  {
    id: "kba",
    name: "KBA Chapter",
    description: "Kerala Blockchain Academy community",
    icon: "⛓️",
    path: "/communities/kba",
  },
  {
    id: "coders",
    name: "Coders Club",
    description: "Programming and coding community",
    icon: "💻",
    path: "/communities/coders",
  },
  {
    id: "wow",
    name: "WOW",
    description: "Women of Wonders community",
    icon: "👩‍💻",
    path: "/communities/wow",
  },
  {
    id: "aws-club",
    name: "AWS Club",
    description: "Amazon Web Services community",
    icon: "☁️",
    path: "/communities/aws-club",
  },
];

// Community details data - moving from separate file to avoid import issues
export const communityData = {
  mulearn: {
    name: "Mulearn",
    description:
      "Learning community focused on peer learning and skill development",
    icon: "🎓",
    longDescription:
      "Mulearn is an innovative learning platform that offers personalized educational experiences through adaptive technology, interactive content, and community collaboration. It enables learners to acquire new skills and knowledge at their own pace, with expert instructors and engaging content tailored to meet personal and professional development needs.",
    whatWeProvide: {
      title: "What We Provide",
      items: [
        {
          name: "Practical Learning",
          description:
            "Emphasizing hands-on experience through projects and workshops.",
        },
        {
          name: "Accessibility",
          description:
            "Providing learning resources that are available to a wide audience.",
        },
        {
          name: "Community Building",
          description:
            "Fostering a supportive network of learners and mentors.",
        },
        {
          name: "Career Advancement",
          description:
            "Helping individuals improve their employability and career prospects.",
        },
      ],
    },
    joinUs:
      "Join MuLearn to enhance your skills and connect with a community of passionate learners and professionals.",
    activities: [
      "Peer Learning Sessions",
      "Skill Development Workshops",
      "Project Collaborations",
      "Mentorship Programs",
    ],
    achievements: [
      "Best Learning Community 2023",
      "500+ Active Members",
      "100+ Successfully Completed Projects",
    ],
    contact: {
      email: "mulearn@iedc.com",
      coordinator: "Ajmal P K",
    },
  },
  thinkerhub: {
    name: "Thinkerhub",
    description: "Innovation and technology learning community",
    icon: "💡",
    longDescription:
      "TinkerHub Foundation is a community of tinkerers, makers & students - working towards mapping and empowering people who share a passion to innovate.",
    vision:
      "We are here to ensure that everyone has access to the knowledge required to set the course for a better future.",
    mission:
      "By 2025, cultivate a thriving maker culture in Kerala to ignite creativity and equip 10,000 young makers with the skills to innovate and shape the future.",
    whyWeDoIt:
      "The world is changing rapidly, and we must adapt. At TinkerHub Campus Community, we ensure the young generation acquires the knowledge and tools to build a better future for themselves and the world. Over the last decade, we realized, to drive large-scale change, our students need to learn continuously, innovate, solve problems, and collaborate massively. Our programs, projects, and resources revolve around developing these core areas.",
    whatWeDo:
      "At TinkerHub, we are committed to empowering our Campus Community through a combination of comprehensive resources, personalized mentorship, and engaging learning events. We have an extensive library of learning materials and tools, ensuring students have everything they need to manifest their true potential.",
    activities: [
      "Innovation Workshops",
      "Hackathons",
      "Tech Talks",
      "Project Showcases",
    ],
    achievements: [
      "Best Innovation Hub 2023",
      "20+ Successful Projects",
      "5+ Patent Applications",
    ],
    execomTeam: [
      {
        name: "Dr. Sarith Divakar M",
        role: "Staff Coordinator",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SR",
        contact: "sarith@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/sreeraj-r",
        github: "https://github.com/sarithdivakar",
      },
      {
        name: "Sreenidhi CV",
        role: "Campus Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=RK",
        contact: "rahul@thinkerhub.org",
        linkedin: "https://linkedin.com/in/sreenidhi-cv",
        github: "https://github.com/sreenidhicv",
      },
      {
        name: "Mariyamath Luba",
        role: "Co-lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=PS",
        contact: "mariyamathluba@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/mariyamathluba",
        github: "https://github.com/mariyamathluba",
      },
      // More team members...
    ],
    contact: {
      email: "thinkerhub@iedc.com",
      coordinator: "Srinidhi C V",
    },
  },
  cyber: {
    name: "Cyber",
    description: "Cybersecurity and digital safety community",
    icon: "🔒",
    longDescription:
      "The Cyber community focuses on cybersecurity awareness, ethical hacking, and digital safety. Members learn about the latest security threats and how to protect against them.",
    activities: [
      "Security Workshops",
      "CTF Competitions",
      "Security Audits",
      "Cyber Awareness Programs",
    ],
    achievements: [
      "Best Security Community 2023",
      "10+ Security Certifications",
      "Successfully Protected College Network",
    ],
    contact: {
      email: "cyber@iedc.com",
      coordinator: "Abin N R",
    },
  },
  floss: {
    name: "FOSS Club",
    description: "Free/Libre and Open Source Software community",
    icon: "🔓",
    longDescription:
      "FLOSS promotes the use and development of free and open-source software.",
    activities: [
      "Open Source Contributions",
      "Linux Workshops",
      "Code Sprints",
    ],
    achievements: [
      "100+ Open Source Contributions",
      "Best FOSS Community 2023",
    ],
    contact: {
      email: "floss@iedc.com",
      coordinator: "Sarah Williams",
    },
  },
  mlsa: {
    name: "MLSA",
    description: "Microsoft Learn Student Ambassadors",
    icon: "📱",
    longDescription:
      "MLSA is a global program providing students with resources to learn Microsoft technologies.",
    activities: ["Tech Workshops", "Azure Training", "Community Projects"],
    achievements: ["Gold Level Ambassadors", "20+ Certified Members"],
    contact: {
      email: "mlsa@iedc.com",
      coordinator: "Michael Brown",
    },
  },
  // Add remaining communities with basic details
};

// Helper function to get community by ID
export const getCommunityById = (id) => {
  return communities.find((community) => community.id === id) || null;
};
