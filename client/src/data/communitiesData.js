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
    id: "foss",
    name: "FOSS Club",
    description: "Free/Libre and Open Source Software community",
    icon: "🐧",
    path: "/nexus/foss",
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
    execomTeam: [
      {
        name: "Monika Devi",
        role: "Lead",
        contact: "monikadevilbsksd@gmail.com",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855129/monika_th6hzg.jpg",
        linkedin:
          "https://www.linkedin.com/in/monika-devi-a049b433a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
      {
        name: "Meenu P P",
        role: "Co-Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855129/meenu_wpgrgs.jpg",
      },
      {
        name: "Srinivas",
        role: "Tech and Operation Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855126/srinivas_v6slcz.jpg",
        linkedin: "https://www.linkedin.com/in/srinivasammangod/",
        github: "https://github.com/SRINIVASRAOAMMANGOD",
      },
      {
        name: "Akshaya VP",
        role: "Content Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855127/akshaya_q5efno.jpg",
        linkedin: "https://www.linkedin.com/in/akshaya-vp-9199b6291",
      },
      {
        name: "Adithya Dev P",
        role: "Media Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855128/aditiyadev_jgczlw.jpg",
        linkedin: "https://www.linkedin.com/in/adithya-dev-613799301",
        github: "https://github.com/adithyadev-2005",
      },
      {
        name: "Ridha Fathima",
        role: "Posters",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=RF",
      },
    ],
    contact: {
      email: "lbscekmulearn@gmail.com",
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838895/sarith_dp8raf.jpg",
        contact: "sarith@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/sreeraj-r",
        github: "https://github.com/sarithdivakar",
      },
      {
        name: "Oneela Gopi",
        role: "Campus Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838884/oneela_lgxend.jpg",
        contact: "oneelagopi03@gmail.com",
        linkedin: "https://www.linkedin.com/in/oneelagopi",
        github: "https://github.com/Ch3rrycosmos",
      },
      {
        name: "Ajmal P K",
        role: "Learning Coordinator",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757841117/ajmal_goumcs.jpg",
        contact: "ajmalwlwl@gmail.com",
        linkedin: "https://www.linkedin.com/in/ajmalllw/",
        github: "https://github.com/gleeaa",
      },
      {
        name: "Joel Joseph",
        role: "Outreach Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757858721/joel_siylks.jpg",
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
      {
        name: "Anupama S",
        role: "First Year Learning Coordinator",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757858724/anupama_yxmit1.jpg",
        contact: "anupamabhaktha@gmail.com",
        linkedin: "https://www.linkedin.com/in/anupama-s-75b78b382",
        github: "https://github.com/anupamaa-verse",
      },
    ],
    contact: {
      email: "oneelagopi03@gmail.com",
      coordinator: "Oneela Gopi",
    },
  },
  cyber: {
    name: "Cyber Community LBSCEK",
    description: "Cybersecurity and digital safety community",
    icon: "🔒",
    longDescription:
      "Cyber Community at LBSCEK is a student-led learning and research group focused on practical cybersecurity, ethical hacking, and responsible use of technology. We bring together curious students from all departments to learn, build, and defend — not for show, but to gain real skills that matter in industry and research. Our activities range from hands-on workshops and expert talks to project-based learning, community awareness drives and competitions. We believe in learning-by-doing and in building a sustainable, student-run ecosystem where knowledge is shared, skills are practiced, and leadership is grown.",
    vision:
      "To make LBSCEK a hub for practical cybersecurity learning — where students become confident, ethical practitioners able to design, defend and secure real systems.",
    mission:
      "Teach industry-relevant cybersecurity skills through hands-on training and mentorship. Build ethically-minded students who understand legal, technical and social aspects of security. Create projects and demonstrations that solve real problems and prepare students for careers in security. Raise campus-wide awareness about safe online behaviour and digital hygiene.",
    activities: [
      "Expert-led hands-on workshops (web, network, ML security)",
      "Student-led webinars and study sessions (weekly)",
      "Project-based programs (Hack.Ai, CyberSprint, team projects)",
      "Capture The Flag (CTF) practice & competitions",
      "Awareness drives and interactive stalls (Phishing, OSINT, Password-checkers)",
      "Mentorship for bug bounty, internships and project showcases",
      "Short daily bites of learning — 1-Minute Cyber series (daily micro-lessons)",
    ],
    pastHighlights: [
      "Ethical Hacking & Bug Bounty Workshop — Practical sessions on responsible vulnerability discovery and reporting",
      "Cyber Stall (Techfest) — Interactive awareness activities: Phishing Awareness, OSINT challenge, Social-Engineering demo",
      "Hack The Weeks (Webinar Series) — Multi-week webinar series covering web app security, cryptography, forensics, OSINT",
      "1-Minute Cyber — 100-day microlearning campaign: daily one-minute tips, myths, and mini-challenges",
      "Hack.Ai — A month-long, project-based learning program combining cybersecurity and AI",
    ],
    whoShouldJoin: [
      "Beginners who want a solid, hands-on introduction to cybersecurity",
      "Developers who want to learn secure coding practices",
      "Students building final-year projects who want real security input",
      "Anyone curious about ethical hacking, incident response, OSINT, or ML in security",
    ],
    teachingApproach: [
      "Foundations first — short courses to get everyone to a common baseline",
      "Hands-on labs — guided, sandboxed practical sessions (safe environments only)",
      "Project work — teams design, build, and defend a working prototype",
      "Peer learning — student-led sessions reinforce learning and build leadership",
      "Mentorship & review — industry experts provide feedback and grading for projects",
    ],
    ethicalCommitment:
      "All our activities follow legal and ethical rules. We do not promote or teach illegal hacking. Every practical exercise is run in controlled environments (local VMs, intentionally vulnerable labs, CTF-style challenges) or on platforms/targets where permission is granted. Members must follow the club code of conduct and comply with college policies.",
    execomTeam: [
      {
        name: "Dr. Anver SR",
        role: "Faculty Enabler",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AS",
      },
      {
        name: "Abin NR",
        role: "Campus Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AN",
        github: "https://github.com/example",
        linkedin: "https://linkedin.com/in/example",
      },
      {
        name: "Mariyam",
        role: "Campus Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=M",
        linkedin: "https://www.linkedin.com/in/mariyam-a-86a083320",
      },
      {
        name: "Fathima Aleesha Sherule",
        role: "Technical Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=FA",
        github: "https://github.com/aleesha2812",
        linkedin: "http://linkedin.com/in/fathimaaleeshasherule",
      },
      {
        name: "Jasil",
        role: "Technical Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=J",
      },
      {
        name: "Shamil",
        role: "Technical Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=S",
      },
      {
        name: "Anusree",
        role: "Creative Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=A",
      },
      {
        name: "Fathima Rasha",
        role: "Creative Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=FR",
        github: "https://github.com/Rashapaath",
        linkedin: "https://www.linkedin.com/in/fathima-rasha-2a35b5319",
      },
      {
        name: "Roshan",
        role: "Creative Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=R",
      },
      {
        name: "Zayan",
        role: "Design Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=Z",
      },
      {
        name: "Tamanna",
        role: "Design Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=T",
      },
      {
        name: "Binil P",
        role: "Social Media Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=BP",
        linkedin: "https://www.linkedin.com/in/binil-p/",
      },
      {
        name: "Rohith T",
        role: "Social Media Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=RT",
      },
      {
        name: "Aadhithyan KM",
        role: "Finance Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=AK",
        linkedin: "https://www.linkedin.com/in/aadhithyan-km-86613a345",
      },
      {
        name: "Muhammed Minhaj VS",
        role: "Finance Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=MM",
      },
    ],
    socialMedia: {
      whatsappCommunity: "https://chat.whatsapp.com/F5sRopBfJBqLVTKvd0EFQn",
      whatsappChannel: "https://whatsapp.com/channel/0029Vb9j6Z87IUYTULlbHM2w",
      instagram: "https://www.instagram.com/cyber_community.lbscek/",
      github: "https://github.com/Cyber-club-lbscek",
      linkedin: "https://www.linkedin.com/in/cyber-lbs-750485356/",
      website: "https://cyber.iedclbscek.in",
    },
    contact: {
      email: "cyber.club.lbscek@gmail.com",
      coordinator: "Abin NR",
      facultyAdvisor: "Dr. Anver SR",
    },
  },
  foss: {
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838727/alvira_fvh5om.jpg",
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757853772/siraja_f5v3ge.jpg",
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838893/shamil_raywnj.jpg",
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838733/neeraj_pew7bm.jpg",
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
    execomTeam: [
      {
        name: "THANSEEHA NASRIN P M",
        role: "Campus Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838722/thanseeha_xbplpe.jpg",
        github: "https://github.com/Thanseeha-nasrin",
        linkedin: "https://linkedin.com/in/thanseeha-na",
      },
      {
        name: "S AKHIL",
        role: "Campus Co-Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838734/akhil_e6dbws.jpg",
        github: "https://github.com/Akhil-Sanal",
        linkedin: "https://www.linkedin.com/in/s-akhil-92ba83337",
      },
      {
        name: "SHADIL ABUBACKER M V",
        role: "Technical Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757856324/shadil_lpbzfb.jpg",
        github: "https://github.com/shadil-abubacker",
        linkedin:
          "https://www.linkedin.com/in/shadil-abubacker-m-v-68860b349?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      },
      {
        name: "JESTIN JAYAS",
        role: "Technical Co-Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855877/jestin_icxtj1.jpg",
        github: "https://github.com/jestinsource",
        linkedin: "https://www.linkedin.com/in/jestin-jayas-a3ab86331/",
      },
      {
        name: "DEEPAK MOHAN",
        role: "Creative Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855880/Deepak_mktfng.jpg",
        github: "https://github.com/DeepakMoHank",
        linkedin: "https://www.linkedin.com/in/deepakmohankk",
      },
      {
        name: "MINHA M",
        role: "Creative Co Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757856005/Minha_q8wf1c.jpg",
        github: "https://github.com/minha8891/github-session",
        linkedin: "https://www.linkedin.com/in/minha-m-457874280",
      },
      {
        name: "FATHIMATH FAHEEMA",
        role: "Community Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855884/faheema_nyobmw.jpg",
        github: "https://github.com/fyymaah",
        linkedin: "https://www.linkedin.com/in/fathimath-faheema-9370712b8",
      },
      {
        name: "ANUGRAHA MURALIDHARAN",
        role: "Community Co-Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855879/Anugraha_d3xdm4.jpg",
        github: "https://github.com/anugrahamurali",
        linkedin: "https://www.linkedin.com/in/anugraha-murali-147590328",
      },
      {
        name: "FATHIMATH SHIRIN SANA C A",
        role: "Media Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855877/Shirin_sana_wxnjhw.jpg",
        github: "https://github.com/fathimath-Shirin-sana-c-a",
        linkedin:
          "https://www.linkedin.com/in/fathimath-shirin-sana-c-a-481a48348",
      },
      {
        name: "M A KADEEJA TAMANNA",
        role: "Media Co-Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757855880/tamanna_mm3skq.jpg",
        github: "https://github.com/tamanna-nizar",
        linkedin: "https://www.linkedin.com/in/m-a-kadeeja-tamanna-444347329",
      },
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838724/nihal_j55ugs.jpg",
        contact: "mnaaksd2@gmail.com",
        linkedin: "https://www.linkedin.com/in/devnihal",
        github: "https://github.com/devnihal",
      },
      {
        name: "Abubacker Afnan K",
        role: "Co-Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757840788/afnan_ckmsr6.jpg",
        contact: "abubackerafnan1211@gmail.com",
        linkedin: "https://www.linkedin.com/in/abubacker-afnan-k-475b12263",
        github: "https://github.com/Afudude",
      },
    ],
    contact: {
      email: "coders.lbscek@gmail.com",
      coordinator: "Mohammed Nihal A A",
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757840917/afraz_bmglkw.jpg",
      },
      {
        name: "Veda sudheesan",
        role: "Co-Lead",
        image: "https://api.dicebear.com/6.x/initials/svg?seed=VS",
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
      coordinator: "Kasim Afraz",
    },
  },
  gdg: {
    name: "GDG on Campus LBSCEK",
    description: "Google Developer Groups community",
    icon: "🌐",
    longDescription:
      "GDG (Google Developer Groups) on Campus LBSCEK is a newly established student community at LBS College of Engineering, Kasaragod. The club is designed to bring together developers, designers, and tech enthusiasts who are eager to learn, build, and innovate with Google technologies. The community provides a platform to explore cutting-edge fields like web and mobile development, AI/ML, cloud computing, and design thinking. By creating opportunities for peer learning, workshops, and collaborations, GDG on Campus aims to nurture a strong tech culture on campus. Our goal is to inspire curiosity, foster innovation, and help students grow into future-ready developers and leaders.",
    vision:
      "To inspire curiosity, foster innovation, and help students grow into future-ready developers and leaders through Google technologies.",
    whyJoin: [
      "Learn the latest technologies directly from Google resources",
      "Gain hands-on experience through events and projects",
      "Build a network of peers, alumni, and industry experts",
      "Be part of a global developer community recognized worldwide",
    ],
    activities: [
      "Hands-on Workshops: Introductory sessions on Android, Web, Flutter, AI/ML, and Google Cloud",
      "Hackathons & Coding Challenges: Competitions to spark innovation and teamwork",
      "Tech Talks & Expert Sessions: Learn directly from industry professionals and Google Developer Experts (GDEs)",
      "Community Building Meetups: A space for students to connect, collaborate, and exchange ideas",
      "Project Showcases: Opportunities to build real-world projects and share them with peers",
    ],
    execomTeam: [
      {
        name: "Dr. Sarith Divakar M",
        role: "Faculty Advisor",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838895/sarith_dp8raf.jpg",
        contact: "sarith@lbscek.ac.in",
        linkedin: "https://linkedin.com/in/sreeraj-r",
        github: "https://github.com/sarithdivakar",
      },
      {
        name: "Neeraj Rajeev",
        role: "Organizer",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838733/neeraj_pew7bm.jpg",
      },
    ],
    socialMedia: {
      instagram: "https://www.instagram.com/gdgclbscek",
      linkedin: "https://www.linkedin.com/company/gdgc-lbscek/",
      website: "",
    },
    contact: {
      email: "gdglbscek@gmail.com",
      coordinator: "Neeraj Rajeev",
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838882/adhish_fm7wfj.jpg",
        contact: "ahdishr@lbscek.ac.in",
      },
      {
        name: "Anagha A",
        role: "Secretary",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838884/anagha_foryw3.jpg",
        contact: "anaghaa@lbscek.ac.in",
      },
    ],
    contact: {
      email: "yipclub@lbscek.ac.in",
      coordinator: "Dr Kannan M",
    },
    galleryImages: [
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854247/8_vjlfjc.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854246/6_iypfcu.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854246/7_wpxbhe.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854249/9_fn4vxm.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854245/2_afdxuk.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854246/5_vntzy6.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854245/3_twhbm6.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757854245/1_diomsk.jpg",
    ],
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
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838721/sethulakshmi_q1ffjj.jpg",
        contact: "wtmclublbs@gmail.com",
        linkedin: "https://www.linkedin.com/in/sethu-lakshmi-k-v-1808ab331",
      },
      {
        name: "Keerthana.m",
        role: "Co Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838723/keerthana_bnfkg3.jpg",
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
    name: "KBA LBSCEK",
    description: "Kerala Blockchain Academy Chapter",
    icon: "⛓️",
    longDescription:
      "KBA LBSCEK is the official Kerala Blockchain Academy Chapter of LBS College of Engineering, Kasaragod. The chapter is committed to promoting awareness, learning, and innovation in blockchain technology among students. Through workshops, talks, and hands-on projects, KBA LBSCEK provides a platform for learners, developers, and innovators to explore the potential of blockchain in real-world applications. KBA LBSCEK strives to nurture technical expertise, entrepreneurial thinking, and a spirit of innovation by bridging students with industry leaders and cutting-edge advancements in decentralized technologies.",
    activities: [
      "Blockchain Technology Workshops",
      "Industry Expert Talks",
      "Hands-on Blockchain Projects",
      "Real-world Application Development",
      "Smart Contract Development",
      "DApp Building Competitions",
    ],
    mission:
      "To promote awareness, learning, and innovation in blockchain technology among students while nurturing technical expertise and entrepreneurial thinking.",
    execomTeam: [
      {
        name: "Naeem Muhammed NP",
        role: "Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838729/naeem_dm1ksk.jpg",
        contact: "naeemmuhammed4321@gmail.com",
      },
    ],
    contact: {
      email: "naeemmuhammed4321@gmail.com",
      coordinator: "Naeem Muhammed NP",
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
        name: "Arathi K",
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
    galleryImages: [
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757857183/1_xlbhjw.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757857183/2_rz1zek.jpg",
      "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757857271/3_nyes8p.jpg",
    ],
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
    execomTeam: [
      {
        name: "Thrisha K",
        role: "Club Lead",
        image:
          "https://res.cloudinary.com/dd3bry4rs/image/upload/v1757838892/thrisha_pcis2d.jpg",
        linkedin: "https://www.linkedin.com/in/thrisha-k-596514331/",
      },
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
