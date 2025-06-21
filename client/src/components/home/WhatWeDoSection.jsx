import { motion } from 'framer-motion';

const WhatWeDoSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const activities = [
    {
      title: "Innovation & Ideation",
      description: "We provide a platform for students to generate and refine innovative ideas through brainstorming sessions, design thinking workshops, and hackathons.",
      icon: "💡"
    },
    {
      title: "Skill Development",
      description: "We offer workshops, training sessions, and mentorship programs that help students develop technical, business, and soft skills essential for entrepreneurship.",
      icon: "🚀"
    },
    {
      title: "Incubation Support",
      description: "We guide promising startups through the early stages with access to resources, mentorship, and funding opportunities to help transform ideas into viable businesses.",
      icon: "🌱"
    },
    {
      title: "Industry Connections",
      description: "We facilitate networking with industry experts, successful entrepreneurs, and potential investors to help students build valuable professional connections.",
      icon: "🔗"
    }
  ];

  return (
    <section id="what-we-do" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark inline-block relative">
            What We Do
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-text-light mt-8 max-w-3xl mx-auto">
            At IEDC LBSCEK, we focus on fostering an entrepreneurial mindset and equipping 
            students with the tools they need to innovate and create impactful ventures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary/5 p-8 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{activity.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-accent">{activity.title}</h3>
              <p className="text-text-light">{activity.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Feature image */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 max-w-4xl mx-auto relative"
        >
          <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
            <img 
              src="/img/IMG_3351.JPG" 
              alt="IEDC Activities" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-lg z-[-1]"></div>
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-cta/20 rounded-full z-[-1]"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
