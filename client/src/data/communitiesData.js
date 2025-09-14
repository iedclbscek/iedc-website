export const communities = [
  {
    id: "mulearn",
    name: "Mulearn",
    description:
      "Learning community focused on peer learning and skill development",
    icon: "🎓",
    path: "/nexus/mulearn",
  },
  {
    id: "tinkerhub",
    name: "Tinkerhub",
    description: "Innovation and technology learning community",
    icon: "💡",
    path: "/nexus/tinkerhub",
  },
  {
    id: "cyber",
    name: "Cyber",
    description: "Cybersecurity and digital safety community",
    icon: "🔒",
    path: "/nexus/cyber",
  },
  {
    id: "floss",
    name: "FOSS Club",
    description: "Free/Libre and Open Source Software community",
    icon: "🐧",
    path: "/nexus/floss",
  },
  {
    id: "mlsa",
    name: "MLSA",
    description: "Microsoft Learn Student Ambassadors",
    icon: "📱",
    path: "/nexus/mlsa",
  },
  {
    id: "coders",
    name: "Coders Club",
    description: "Programming and coding community",
    icon: "💻",
    path: "/nexus/coders",
  },
  {
    id: "galaxia",
    name: "Galaxia LBSCEK",
    description: "Space technology and astronomy enthusiasts",
    icon: "🚀",
    path: "/nexus/galaxia",
  },
  {
    id: "gdg",
    name: "GDG",
    description: "Google Developer Groups community",
    icon: "🌐",
    path: "/nexus/gdg",
  },
  /*{
    id: "edc",
    name: "ED club",
    description: "Entrepreneurship Development club",
    icon: "💼",
    path: "/nexus/edc",
  },*/
  {
    id: "yip",
    name: "YIP club",
    description: "Young Innovators Program club",
    icon: "✨",
    path: "/nexus/yip",
  },
  {
    id: "wtm",
    name: "Women Tech Makers",
    description:
      "Google's Women Techmakers program empowering women in technology",
    icon: "👩‍💻",
    path: "/nexus/wtm",
  },
  {
    id: "kba",
    name: "KBA Chapter",
    description: "Kerala Blockchain Academy community",
    icon: "⛓️",
    path: "/nexus/kba",
  },
  {
    id: "wow",
    name: "WOW",
    description: "Women of Wonders community",
    icon: "👩‍💻",
    path: "/nexus/wow",
  },
  {
    id: "aws",
    name: "AWS Club",
    description: "Amazon Web Services community",
    icon: "☁️",
    path: "/nexus/aws",
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
      coordinator: "Monika Devi",
    },
  },
  tinkerhub: {
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
        image: "/img/team/2024/sarith.jpeg",
        contact: "sarith@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/sreeraj-r",
        github: "https://github.com/sarithdivakar",
      },
      {
        name: "Oneela Gopi",
        role: "Campus Lead",
        image: "/img/team/2024/oneela.jpg",
        contact: "oneelagopi03@gmail.com",
        linkedin: "https://www.linkedin.com/in/oneelagopi",
        github: "https://github.com/Ch3rrycosmos",
      },
      {
        name: "Ajmal P K",
        role: "Learning Coordinator",
        image: "/img/communities/tinkerhub/execom/ajmal.jpg",
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
      email: "oneelagopi03@gmail.com",
      coordinator: "Oneela Gopi",
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
    icon: "🐧",
    longDescription:
      "FOSS Club LBSCEK is a community of students passionate about Free and Open Source Software. We believe in learning, sharing, and contributing – the open way. Our club creates a space for collaboration, creativity, and innovation using open technologies.",
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
        class: "S3 CSE-A",
        regNo: "KSD24CS025",
        image: "/img/team/2025/alvira.jpg",
        contact: "alviraruchbah123@gmail.com",
        phone: "9526942235",
        linkedin: "https://www.linkedin.com/in/alviraruchbah123/",
        github: "https://github.com/alviraruchbah",
        fossUnited: "https://fossunited.org/u/alvira_ruchbah",
      },
      {
        name: "Kadeejath Siraja C A",
        role: "Deputy Chief FOSS Ambassador",
        class: "S5 CSE-A",
        regNo: "KSD23CS065",
        image: "/img/communities/foss/execom/siraja.jpeg",
        contact: "Kadeejathsiraja@gmail.com",
        phone: "8137878398",
        linkedin: "https://www.linkedin.com/in/kadeejathsirajaca",
        github: "https://github.com/kadeejathsiraja",
        fossUnited: "https://fossunited.org/u/kadeejath_siraja_c_a",
      },
      {
        name: "Sreyas P",
        role: "Design Lead",
        class: "S3 CSE-B",
        regNo: "KSD24CS182",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SP",
        contact: "psreyas09@gmail.com",
        phone: "6282813639",
        linkedin: "https://www.linkedin.com/in/psreyas09",
        github: "http://github.com/psreyas09",
        fossUnited: "http://fossunited.org/u/sreyas_p",
      },
      {
        name: "Sidharth S",
        role: "Technical Lead",
        class: "S7 CSE-B",
        regNo: "KSD22CS116",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SS",
        contact: "sidharthsudhakaran16@gmail.com",
        phone: "9074652995",
        linkedin: "https://www.linkedin.com/in/sidharth-s-ab0904267/",
        github: "https://github.com/sidharths9105",
        fossUnited: "https://fossunited.org/u/sidharth_s",
      },
      {
        name: "Abhinav Krishna",
        role: "Finance Lead",
        class: "S7 CSE-B",
        regNo: "KSD22CS006",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AK",
        contact: "abhinavkrishna53809@gmail.com",
        phone: "9778362356",
        linkedin: "https://www.linkedin.com/in/abhinav-krishna-39b6a6346/",
        github: "https://github.com/Abhinavkrishna2005",
        fossUnited: "https://fossunited.org/u/abhinav_krishna",
      },
      {
        name: "Vaishakh O V",
        role: "Technical Co-Lead",
        class: "S7 CSE-B",
        regNo: "KSD22CS121",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=VOV",
        contact: "vaishakhov710@gmail.com",
        phone: "9544736726",
        linkedin: "https://www.linkedin.com/in/vaishakh-o-v-64314a343",
        github: "https://github.com/boredcosmicdeity",
        fossUnited: "https://fossunited.org/u/vaishakh_ov",
      },
      {
        name: "Muhammad B M",
        role: "Creative Lead",
        class: "S3 CSE-A",
        regNo: "KSD24CS117",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=MBM",
        contact: "muhemmadbinmahabob@gmail.com",
        phone: "8891394484",
        linkedin: "https://www.linkedin.com/in/muhemmad-bin-mahaboob-2a3a2b340",
        github: "https://github.com/muhdbm",
      },
      {
        name: "Sumayya Zakiya",
        role: "Media and Marketing Lead",
        class: "S3 CSE-C",
        regNo: "KSD24CS183",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=SZ",
        contact: "sumayyazakiya54@gmail.com",
        phone: "8921540856",
        linkedin: "https://www.linkedin.com/in/sumayya-zakiya-9265aa329",
      },
      {
        name: "Shamil Cherukattuparambil",
        role: "4th Year Ambassador",
        class: "S7 CSE-B",
        regNo: "KSD22CS113",
        image: "/img/team/2024/shamil.jpg",
        contact: "shamilshameer777@gmail.com",
        phone: "9074107075",
        linkedin: "https://www.linkedin.com/in/shamil-shameer-336747272",
        github: "https://github.com/shamilshameer",
        fossUnited: "https://fossunited.org/u/shamil_shameer",
      },
      {
        name: "Divyashree M T",
        role: "4th Year Ambassador",
        class: "S7 CSE-B",
        regNo: "KSD22CS055",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=DMT",
        contact: "divyashree.vts@gmail.com",
        phone: "9746241153",
        linkedin: "https://www.linkedin.com/in/divyashree-m-t",
        github: "https://github.com/DIVYASHREEMT",
        fossUnited: "https://fossunited.org/u/divyashree_m_t",
      },
      {
        name: "Archana Das A",
        role: "3rd Year Ambassador",
        class: "S5 CSE-A",
        regNo: "KSD23CS029",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=ADA",
        contact: "archanadas2102@gmail.com",
        phone: "9061076939",
        linkedin: "https://www.linkedin.com/in/archana-das-a-3a16b9278",
        github: "https://github.com/Archana9061",
        fossUnited: "https://fossunited.org/u/archana_das_a",
      },
      {
        name: "Neeraj Rajeev",
        role: "2nd Year Ambassador",
        class: "S3 CSE-B",
        regNo: "KSD24CS135",
        image: "/img/team/2025/neeraj.jpg",
        contact: "neerajrajeevofficial@gmail.com",
        phone: "9633449485",
        linkedin: "https://www.linkedin.com/in/idkneeraj",
        github: "https://github.com/idklevi",
        fossUnited: "https://fossunited.org/u/neerajrajeev",
      },
      {
        name: "Veda Sudheesan",
        role: "2nd Year Ambassador",
        class: "S3 CSE-A",
        regNo: "KSD24CS191",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=VS",
        contact: "Vedas0907@gmail.com",
        phone: "8590371974",
        linkedin: "https://www.linkedin.com/in/veda-sudheesan-14b073328",
        github: "https://github.com/veda0907",
        fossUnited: "https://fossunited.org/u/veda_sudheesan",
      },
      {
        name: "Nandana Ganesh",
        role: "Quality Lead",
        class: "S3 CSE-A",
        regNo: "KSD24CS129",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=NG",
        contact: "nandana14231@gmail.com",
        phone: "7994504214",
        linkedin: "https://www.linkedin.com/in/nandana-ganesh-b10a97327",
        github: "https://github.com/Nandana6238",
        fossUnited: "https://fossunited.org/u/nandana_ganesh",
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
      "We aim to build a thriving community of learners and innovators at our college by leveraging the MLSA program's resources, global network, and Microsoft's ecosystem. With continuous workshops, certifications, and mentorship, we are committed to inspiring students to learn, build, and lead in the world of technology.",
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
      "Webinars - Sessions such as 'Vibe Coder', highlighting the dangers of over-dependence on AI and the value of AI-assisted coding.",
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
        image: "/img/team/2025/nihal.jpg",
        contact: "mnaaksd2@gmail.com",
        linkedin: "https://www.linkedin.com/in/devnihal",
        github: "https://github.com/devnihal",
      },
      {
        name: "ABUBACKER AFNAN K",
        role: "Co-Lead",
        image: "/img/communities/coders/execom/afnan.jpg",
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
  galaxia: {
    name: "Galaxia LBSCEK",
    description: "Space technology and astronomy enthusiasts",
    icon: "🚀",
    longDescription:
      "Galaxia is the official space club of LBS College of Engineering, Kasaragod. The club is dedicated to cultivating an interest in space science, astronomy, and space technology among students. Through a broad spectrum of events and activities, Galaxia brings together enthusiasts, learners, and experts, building a vibrant campus community passionate about exploring the universe. Galaxia aims to foster innovation, curiosity, and scientific temper by connecting students with experts and real-world applications of space tech.",
    activities: [
      "Astro-Quiz Competitions: Engaging quizzes covering space facts, history of astronomy, and technological breakthroughs in space exploration.",
      "Digital Poster & Art Contests: Creative expression on cosmic themes with hands-on design workshops.",
      "Astrophotography Challenges: Opportunities for budding photographers to capture and showcase celestial events.",
      "Webinars & Guest Lectures: Sessions with scientists from organizations like ISRO and NASA, addressing topics ranging from space missions to satellite tech.",
      "Club Meetups: Regular discussions, idea-sharing, and planning for upcoming events in a collaborative environment.",
    ],
    achievements: [
      "Conducted successful webinars with Indian space experts.",
      "Organized multiple college-wide events with high engagement from students across various branches.",
      "Built an active social media presence to share astronomy and club updates.",
      "Fostered interdisciplinary collaboration, bringing together engineering students with diverse interests in science, technology, and design.",
      "LBS College of Engineering, Povval, Kasaragod has been recognized by ISRO for active participation in National Space Day 2025. This honor reflects the passion, teamwork, and dedication of our students and faculty in celebrating space and science. 🌍",
    ],
    execomTeam: [
      {
        name: "Kasim Afraz",
        role: "Lead",
        image: "/img/communities/galaxia/execom/afraz.jpg",
        contact: "galaxialbscek@gmail.com",
      },
      {
        name: "Veda sudheesan",
        role: "Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=VS",
        contact: "galaxialbscek@gmail.com",
      },
    ],
    socialMedia: {
      instagram: "Galaxia_lbscek",
      linkedin: "",
      website: "",
    },
    contact: {
      email: "galaxialbscek@gmail.com",
      facultyAdvisor: "",
      coordinators: "Kasim Afraz (Lead), Veda sudheesan (Co-Lead)",
    },
  },
  gdg: {
    name: "Google Developer Groups (GDG)",
    description: "Google Developer Groups community",
    icon: "🌐",
    longDescription:
      "GDG is a community of developers interested in Google's developer technology. Through meetups, workshops, and events, members learn about the latest Google technologies and connect with other developers.",
    activities: [
      "Google Technology Workshops",
      "Android Development Sessions",
      "Cloud Platform Training",
      "Developer Meetups",
    ],
    achievements: [
      "Organized successful DevFest events",
      "Active community of 100+ developers",
      "Partnerships with Google Developer Relations",
    ],
    contact: {
      email: "gdg@lbscek.ac.in",
      coordinator: "",
    },
  },
  /*
  edc: {
    name: "Entrepreneurship Development Club",
    description: "Entrepreneurship Development club",
    icon: "💼",
    longDescription:
      "The ED Club fosters entrepreneurial thinking and innovation among students, providing resources, mentorship, and opportunities to develop business ideas and startup ventures.",
    activities: [
      "Startup Pitch Competitions",
      "Business Plan Development Workshops",
      "Entrepreneurship Seminars",
      "Networking Events with Industry Leaders",
    ],
    achievements: [
      "Launched 10+ student startups",
      "Successful pitch competitions with industry judges",
      "Partnerships with local business incubators",
    ],
    contact: {
      email: "edclub@lbscek.ac.in",
      coordinator: "",
    },
  },*/
  yip: {
    name: "Young Innovators Programme (YIP)",
    description:
      "Empowering the next generation of innovators through mentorship, collaboration, and transformative experiences",
    icon: "✨",
    longDescription:
      "YIP, a key initiative of Kerala's K-DISC (Kerala Development and Innovation Strategic Council) empowers students to create real-world solutions that drive sustainable and equitable development.",
    mission:
      "To empower young minds with the skills, knowledge, and support needed to become innovative problem-solvers and change-makers in society.",
    activities: [
      "Innovation Challenges and Problem-Solving Workshops",
      "Mentorship Programs with Industry Experts",
      "Real-world Solution Development Projects",
      "Sustainable Development Initiatives",
      "Collaborative Innovation Sessions",
      "State and District Level Competitions",
    ],
    achievements: [
      "YIP 5.0: District Winner",
      "YIP 6.0: Best Institute in North Malabar",
      "YIP 6.0: State Level Winner - Israh & Sangeetha M.S. (₹50,000 cash prize) mentored by Dr. Sarith Divakar M. & Dr. Arathi T.",
      "YIP 6.0: 5 District Level Winners (₹25,000 cash prize)",
      "YIP 7.0: District Winner",
      "YIP 7.0: Ranked 5th among all KTU colleges in the state for idea submission",
      "YIP 7.0: 12 Preliminary Level Winners",
      "YIP 7.0: 5 District Level Winners",
    ],
    execomTeam: [
      {
        name: "Adhish R",
        role: "President",
        image: "/img/team/2024/adhish.jpg",
        contact: "ahdishr@lbscek.ac.in",
      },
      {
        name: "Anagha A",
        role: "Secretary",
        image: "/img/team/2024/anagha.jpg",
        contact: "anaghaa@lbscek.ac.in",
      },
    ],
    contact: {
      email: "yipclub@lbscek.ac.in",
      coordinator: "Dr Kannan M",
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
    execomTeam: [
      {
        name: "Sethulakshmi.k.v",
        role: "Lead",
        image: "/img/team/2025/sethulakshmi.jpg",
        contact: "wtmclublbs@gmail.com",
        linkedin: "https://www.linkedin.com/in/sethu-lakshmi-k-v-1808ab331",
      },
      {
        name: "Keerthana.m",
        role: "Co Lead",
        image: "/img/team/2025/keerthana.jpg",
        contact: "wtmclublbs@gmail.com",
        linkedin: "https://www.linkedin.com/in/keerthana-m-543929340",
        github: "https://github.com/Keerthanakuthirakode",
      },
    ],
    contact: {
      email: "wtmclublbs@gmail.com",
      coordinator: "Sajina.K",
    },
  },
  kba: {
    name: "Kerala Blockchain Academy (KBA) Chapter",
    description: "Kerala Blockchain Academy community",
    icon: "⛓️",
    longDescription:
      "KBA Chapter focuses on blockchain technology education, cryptocurrency understanding, and decentralized application development, preparing students for the future of distributed systems.",
    activities: [
      "Blockchain Technology Workshops",
      "Cryptocurrency Education Sessions",
      "Smart Contract Development",
      "DApp Building Competitions",
    ],
    achievements: [
      "Certified blockchain developers in campus",
      "Successful blockchain project implementations",
      "Partnerships with industry blockchain companies",
    ],
    contact: {
      email: "kba@lbscek.ac.in",
      coordinator: "Mohammed Naeem P",
    },
  },
  wow: {
    name: "Women of Wonders (WOW) Club",
    description: "Women of Wonders community",
    longDescription: `The Women of Wonder (WOW) Club is a student-led initiative that empowers women through creativity, leadership, and social impact. It provides an inclusive space where students can voice their ideas, showcase talents, and inspire positive change.`,
    icon: "💻",
    whyWeDoIt:
      "We believe women deserve equal opportunities to lead, innovate, and express themselves. Many students lack platforms to build confidence and showcase their skills. WOW Club works to overcome this by creating a community that fosters empowerment, courage, and collaboration.",
    vision:
      "To build a community of women leaders who inspire confidence, creativity, and social transformation.",
    mission:
      "Empower students through skill development and leadership programs, build a safe and inclusive culture on campus, and celebrate women achievers.",
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
        role: "Club Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AK",
        contact: "lbscekwowiedc@gmail.com",
        linkedin: "https://www.linkedin.com/in/arathi-kuruvadath-95066832a/",
        github: "https://github.com/arathikuruvadath",
      },
    ],
    contact: {
      email: "lbscekwowiedc@gmail.com",
      coordinator: "NAYANA MURALI",
    },
  },
  aws: {
    name: "AWS Cloud Club",
    description: "Amazon Web Services community",
    icon: "☁️",
    longDescription: `An AWS Cloud Club is a student-led community recognized by Amazon Web Services. It helps students learn cloud computing, build projects, and grow career skills with AWS. Each club is guided by a Faculty Advisor and a Campus Lead (student leader).`,
    globalPresence:
      "AWS Cloud Clubs exist in hundreds of colleges across the world. Students from AWS Clubs have gone on to work at Amazon, Microsoft, Google, and top MNCs.",
    purpose: [
      "To introduce cloud computing to students in a fun and practical way.",
      "To create student leaders who can organize events, workshops, and competitions.",
      "To prepare students with skills needed for internships and placements.",
    ],
    benefits: [
      "Access to AWS Educate (free credits worth $100–150/year).",
      "Free learning resources on cloud, AI, security, and DevOps.",
      "Opportunities to participate in global hackathons & competitions.",
      "Recognition from AWS → looks great on resume/LinkedIn.",
      "Chance to earn AWS goodies, badges, and certificates.",
    ],
    whyImportant: [
      "Cloud computing is one of the fastest-growing tech fields.",
      "Companies across industries (IT, banking, healthcare, e-commerce) are migrating to AWS.",
      "Being part of AWS Cloud Club gives students a career edge in interviews and placements.",
    ],
    activities: [
      "Cloud Computing Workshops and Hands-on Labs",
      "AWS Certification Training Sessions",
      "Cloud Architecture Design Competitions",
      "DevOps and Security Training Programs",
      "Industry Expert Guest Lectures",
      "Real-world Cloud Project Development",
    ],
    achievements: [
      "Student-led community recognized by Amazon Web Services",
      "Access to exclusive AWS resources and learning credits",
      "Direct pathway to cloud computing careers",
      "Global network of AWS student ambassadors",
    ],
    contact: {
      email: "awsclub.lbscek@gmail.com",
      facultyAdvisor: "",
      coordinator: "Thrisha K",
    },
  },
};

// Helper function to get community by ID
export const getCommunityById = (id) => {
  return communities.find((community) => community.id === id) || null;
};
