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
    id: "coders",
    name: "Coders Club",
    description: "Programming and coding community",
    icon: "💻",
    path: "/communities/coders",
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
    name: "TinkerHub",
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
      "60+ Successful Projects",
      "5+ Patent Applications",
      "300+ Makers",
    ],
    execomTeam: [
      {
        name: "Dr. Sarith Divakar M",
        role: "Staff Coordinator",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SD",
        contact: "sarith@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/sreeraj-r",
        github: "https://github.com/sarithdivakar",
      },
      {
        name: "Oneela Gopi",
        role: "Campus Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=OG",
        contact: "oneelagopi03@gmail.com",
        linkedin: "https://www.linkedin.com/in/oneelagopi",
        github: "https://github.com/Ch3rrycosmos",
      },
      {
        name: "Ajmal P K",
        role: "Learning Coordinator",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AK",
        contact: "ajmalwlwl@gmail.com",
        linkedin: "https://www.linkedin.com/in/ajmalllw/",
        github: "https://github.com/gleeaa",
      },
      {
        name: "Joel Joseph",
        role: "Outreach Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=JJ",
        contact: "joeljoseph6666@gmail.com",
        linkedin: "https://www.linkedin.com/in/joeljosephpj",
        github: "https://github.com/Joeljoseph12356",
      },
      {
        name: "Fidha K Naufal",
        role: "Women In Tech",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=FN",
        contact: "fidhaknaufal07@gmail.com",
        linkedin: "https://www.linkedin.com/in/fidha-k-naufal-a1b495293",
        github: "https://github.com/Fidhakn",
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
      "FOSS Club LBSCEK is a community of students passionate about Free and Open Source Software. We believe in learning, sharing, and contributing — the open way. Our club creates a space for collaboration, creativity, and innovation using open technologies.",
    whyWeDoIt:
      "FOSS gives us the freedom to learn, build, and share without barriers. Through the club, students get the opportunity to discover open tools, collaborate on projects, and contribute to the global open-source ecosystem while building real skills.",
    vision:
      "To build a vibrant open-source culture at LBSCEK where students actively learn, share, and contribute to the global community.",
    mission:
      "By 2025, engage 500+ students in FOSS activities, projects, and contributions that make a real-world impact.",
    activities: [
      "🚀 FOSS Awareness Sessions",
      "💻 Git/GitHub & Linux Workshops",
      "🎨 Open Source Tools for Creativity & Daily Use",
      "🤝 FOSS Meetups & Collaborative Projects",
    ],
    achievements: [
      "Organized the first FOSS Meetup in Kasaragod (2025)",
      "Conducted a series of Git Workshops with 100+ students",
      "Hosted Creative Tools with FOSS session",
    ],
    execomTeam: [
      {
        name: "Alvira Ruchbah",
        role: "Chief FOSS Ambassador",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AR",
        contact: "fossclub.lbscek@gmail.com",
        linkedin: "https://www.linkedin.com/in/alvira-ruchbah-759a24330/",
        github: "https://github.com/alviraruchbah",
      },
      {
        name: "Kadeejath Siraja",
        role: "Deputy Chief FOSS Ambassador",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=KS",
        contact: "fossclub.lbscek@gmail.com",
        linkedin: "https://www.linkedin.com/in/kadeejath-siraja-c-a-257608318",
        github: "https://github.com/Kadeejathsiraja",
      },
      {
        name: "Sreyas P",
        role: "Design Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SP",
        contact: "psreyas09@gmail.com",
        linkedin: "https://www.linkedin.com/in/psreyas09",
        github: "http://github.com/psreyas09",
      },
      {
        name: "Sidharth S",
        role: "Technical Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SS",
        contact: "sidharthsudhakaran16@gmail.com",
        linkedin: "https://www.linkedin.com/in/sidharth-s-ab0904267/",
        github: "https://github.com/sidharths9105",
      },
      {
        name: "Vaishakh O V",
        role: "Technical Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=VOV",
        contact: "vaishakhov710@gmail.com",
        linkedin: "https://www.linkedin.com/in/vaishakh-o-v-64314a343",
        github: "https://github.com/boredcosmicdeity",
      },
      {
        name: "muhammad b m",
        role: "creative lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=MBM",
        contact: "muhemmadbinmahabob@gmail.com",
        linkedin:
          "https://www.linkedin.com/in/muhemmad-bin-mahaboob-2a3a2b340?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        github: "https://github.com/muhdbm",
      },
      {
        name: "Divyashree M T",
        role: "4th year Ambassador",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=DMT",
        contact: "divyashree.vts@gmail.com",
        linkedin: "https://www.linkedin.com/in/divyashree-m-t",
        github: "https://github.com/DIVYASHREEMT",
      },
      {
        name: "Neeraj Rajeev",
        role: "2nd year ambassador",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=NR",
        contact: "neerajrajeevofficial@gmail.com",
        linkedin: "https://www.linkedin.com/in/idkneeraj",
        github: "https://github.com/idklevi",
      },
      {
        name: "Nandana Ganesh",
        role: "Quality lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=NG",
        contact: "nandana14231@gmail.com",
        linkedin:
          "https://www.linkedin.com/in/nandana-ganesh-b10a97327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        github: "https://github.com/Nandana6238",
      },
      {
        name: "veda sudheesan",
        role: "2nd year female Ambassador",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=VS",
        contact: "Vedas0907@gmail.com",
        linkedin:
          "https://www.linkedin.com/in/veda-sudheesan-14b073328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        github: "https://github.com/veda0907",
      },
    ],
    contact: {
      email: "fossclub.lbscek@gmail.com",
      coordinator: "Dr. Sarith Divakar M",
    },
  },
  mlsa: {
    name: "MLSA",
    description: "Microsoft Learn Student Ambassadors",
    icon: "📱",
    vision:
      "We aim to build a thriving community of learners and innovators at our college by leveraging the MLSA program’s resources, global network, and Microsoft’s ecosystem. With continuous workshops, certifications, and mentorship, we are committed to inspiring students to learn, build, and lead in the world of technology.",
    longDescription: `The Microsoft Learn Student Ambassadors (MLSA) program is a global initiative by Microsoft designed to empower students to become campus leaders in technology, innovation, and community building. Ambassadors gain exclusive access to Microsoft resources, mentorship, and certifications, enabling them to learn cutting-edge tools such as Azure, Power Platform, GitHub, AI, and more.As part of the program, students not only develop technical expertise but also build leadership, communication, and problem-solving skills by hosting events, mentoring peers, and contributing to real-world projects. MLSA provides a platform to connect with a worldwide network of student leaders, Microsoft professionals, and industry experts, helping ambassadors grow into innovators and changemakers.`,
    activities: [
      "Workshops & Hands-on - Labs Covering Microsoft technologies, programming, cloud computing, AI, and more.",
      "Azure & Cloud Training - Sessions to strengthen knowledge of Microsoft Azure and its applications.",
      "Community Interaction Sessions - Peer-to-peer learning and open discussions to share knowledge and explore opportunities.",
      "Tech Talks & Knowledge Sharing - Regular events to foster curiosity and collaboration among students.",
    ],
    achievements: [
      "Recognized Ambassador - Our college proudly has one official Microsoft Learn Student Ambassador, representing LBSCEK at the global level.",
      "Strong Aspirant Community - 10+ students are currently preparing to become part of the MLSA program, reflecting the enthusiasm and fast-growing interest in Microsoft technologies.",
      "Programs & Workshops - We have successfully conducted multiple tech workshops, interaction sessions, and hands-on events, creating impactful learning experiences for our peers.",
      "Growing Team - A dedicated and passionate team is actively working towards the growth of MLSA in our campus, with efforts being fast-tracked to bring more opportunities for students.",
    ],
    contact: {
      email: "mlsalbscek@gmail.com",
      coordinator: "Thanseeha Nasrin PM",
    },
  },
  coders: {
    name: "Coders LBSCEK",
    description: "Code. Create. Conquer.",
    longDescription: `Coders Club is the hub for all things programming at LBS College of Engineering Kasaragod. We bring together students who are curious about coding, problem-solving, and building real-world projects. Through workshops, coding sessions, and competitions, we help beginners take their first steps in programming while also challenging advanced learners to push their limits. Our mission is to create a collaborative space where ideas turn into skills, and skills turn into innovation.`,
    icon: "💻",
    activities: [
      "Webinars - Sessions such as “Vibe Coder”, highlighting the dangers of over-dependence on AI and the value of AI-assisted coding.",
      "Workshops - Practical, hands-on workshops to build coding confidence and technical skills.",
    ],
    whyWeDoIt:
      "We exist to help students explore coding, learn new technologies, and collaborate on projects. Through the club, members build practical skills, share knowledge, and grow as problem-solvers and innovators.",
    achievements: ["50+ Students Reached", "3 Successful Events Conducted"],
    mission:
      "To create a collaborative space where students of all levels can learn coding, share knowledge, and grow together through workshops, sessions, and real-world projects.",
    vision:
      "To build a strong community of innovators and problem-solvers who use technology not just to code, but to create meaningful impact.",
    execomTeam: [
      {
        name: "Mohammed Nihal A A",
        role: "Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=MN",
        contact: "mnaaksd2@gmail.com",
        linkedin: "https://www.linkedin.com/in/devnihal",
        github: "https://github.com/devnihal",
      },
      {
        name: "ABUBACKER AFNAN K",
        role: "Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AA",
        contact: "abubackerafnan1211@gmail.com",
        linkedin: "https://www.linkedin.com/in/abubacker-afnan-k-475b12263",
        github: "https://github.com/Afudude",
      },
    ],
    contact: {
      email: "coders.lbscek@gmail.com",
      coordinator: "",
    },
  },
  wow: {
    name: "Women of Wonders (WOW) Club",
    longDescription: `The Women of Wonder (WOW) Club is a student-led initiative that empowers women through creativity, leadership, and social impact. It provides an inclusive space where students can voice their ideas, showcase talents, and inspire positive change.`,
    icon: "💻",
    activities: [
      "Interactive Session with Ananya R(Tedx Speaker, DEI advocate Ex She Loves Tech, Ex Google Devrel Community Manager).",
      "Interactive Session with Sandra Miss(faculty LBSCEK)",
      "Independence Day: Unsung Women Freedom Fighters",
    ],
    achievements: [
      "Hosted Women Leadership Talks 2024 with 50+ participants.",
      "Organized Independence Day programs with 20+ submissions.",
      "Collaborated with WTM Club for women-in-tech initiatives.",
    ],
    execomTeam: [
      {
        name: "ARATHI.K",
        role: "Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AK",
        contact: "arathikuruvadath12@gmail.com",
        linkedin: "https://www.linkedin.com/in/arathi-kuruvadath-95066832a/",
        github: "https://github.com/arathikuruvadath",
      },
    ],
    mission:
      "We aim to empower students through skill development and leadership programs, build a safe and inclusive campus culture, and celebrate women achievers.",
    vision:
      "To build a community of women leaders who inspire confidence, creativity, and social transformation.",
    contact: {
      email: "lbscekwowiedc@gmail.com",
      coordinator: "NAYANA MURALI",
    },
  },
  wtm: {
    name: "Women Tech Makers(WTM)",
    longDescription: `Google's Women Techmakers (WTM) is a global program that provides visibility, community, and resources for women in technology, aiming to empower and encourage them to pursue and excel in tech careers.`,
    icon: "💻",
    whyWeDoIt:
      "We believe that technology should be inclusive and diverse. However, women remain underrepresented in the tech field. By building a supportive community, we aim to break barriers, provide equal opportunities, and empower women to pursue, grow, and lead in technology.",
    achievements: [
      "Successfully conducted She Votes Quiz Competition with 11 participants.",
      "Organized Digital Poster Making Competition with 7 creative submissions.",
      "Collaborated with WOW Club for impactful initiatives on women empowerment and innovation.",
    ],
    activities: [
      "She Votes Quiz Competition - Encouraging awareness and engagement through a quiz on women's rights and leadership.",
      "Independence Day Special Digital Poster Making Competition - Fostering creativity and innovation through design.",
      "Interactive Session with Sandra Ma'am (Faculty,LBSCEK) - Gaining insights and guidance from experienced educators.",
    ],
    mission:
      "We aim to empower students through skill development and leadership programs, build a safe and inclusive campus culture, and celebrate women achievers.",
    vision:
      "We need to provide visibility, resources, and opportunities for women at every stage of their technology careers. By building a strong community, we can support collaboration, mentorship, and leadership. We should also equip women with skills in emerging technologies to foster growth and innovation, inspiring and empowering the next generation of women leaders in tech.",
    contact: {
      email: "wtmclublbs@gmail.com",
      coordinator: "Sajina.K",
    },
  },
  // Add remaining communities with basic details
};

// Helper function to get community by ID
export const getCommunityById = (id) => {
  return communities.find((community) => community.id === id) || null;
};
