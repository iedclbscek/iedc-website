import { motion } from 'framer-motion';

const AboutSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark inline-block relative">
            Who We Are
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-accent rounded-full"></div>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative order-2 md:order-1"
          >
            <img 
              src="/img/IMG_3351.JPG" 
              alt="IEDC Overview" 
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
              style={{ height: "400px" }}
            />
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-lg z-[-1]"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-cta/20 rounded-full z-[-1]"></div>
          </motion.div>
          
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8 order-1 md:order-2"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Our Mission</h3>
              <p className="text-text-light">
                To foster innovation and entrepreneurship by providing students with the resources,
                mentorship, and opportunities needed to transform their ideas into successful ventures.
                We aim to create an ecosystem that nurtures creativity and supports the development
                of innovative solutions to real-world problems.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Our Vision</h3>
              <p className="text-text-light">
                To be the leading innovation and entrepreneurship hub that empowers students to create
                sustainable solutions for global challenges while building successful businesses.
                We envision a future where every student has the opportunity to develop their
                entrepreneurial potential and contribute to society through innovation.
              </p>
            </div>
            
            {/* Core values grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {["Innovation", "Collaboration", "Excellence", "Integrity", "Impact", "Growth"].map((value, index) => (
                <div key={value} className="bg-primary/20 rounded-lg py-3 px-4 text-center">
                  <p className="text-text-dark font-medium">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
