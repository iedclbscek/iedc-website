import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="py-20 bg-primary/10">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-text-dark"
        >
          Who We Are
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="/img/overview-image.jpg" 
              alt="IEDC Overview" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              style={{ height: "400px" }}
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-lg"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-accent">Our Mission</h3>
              <p className="text-text-light">
                To foster innovation and entrepreneurship by providing students with the resources,
                mentorship, and opportunities needed to transform their ideas into successful ventures.
                We aim to create an ecosystem that nurtures creativity and supports the development
                of innovative solutions to real-world problems.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-accent">Our Vision</h3>
              <p className="text-text-light">
                To be the leading innovation and entrepreneurship hub that empowers students to create
                sustainable solutions for global challenges while building successful businesses.
                We envision a future where every student has the opportunity to develop their
                entrepreneurial potential and contribute to society through innovation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
