import { motion } from 'framer-motion';
import About from '../components/About';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section for About Page */}
      <section className="bg-accent/90 text-white pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[url('/background-grid.svg')] bg-center opacity-10"></div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center relative z-10"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                About IEDC LBSCEK
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Innovation and Entrepreneurship Development Cell at LBS College of Engineering, Kasaragod
              </p>
              <div className="mt-8 flex justify-center">
                <div className="h-1 w-20 bg-white/50 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Main About Component */}
      <About />
      
      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-text-dark"
          >
            Our Core Values
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "We foster a culture of innovation by encouraging creative thinking and problem-solving skills among students."
              },
              {
                title: "Collaboration",
                description: "We believe in the power of teamwork and bringing diverse perspectives together to create impactful solutions."
              },
              {
                title: "Excellence",
                description: "We strive for excellence in everything we do, setting high standards for our initiatives and projects."
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-primary/30 p-8 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold mb-3 text-accent">{value.title}</h3>
                <p className="text-text-light">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Leadership Preview */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-dark">Our Leadership</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Meet the team that drives innovation and entrepreneurship at LBSCEK
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link to="/team" className="inline-flex items-center px-6 py-3 bg-cta text-white rounded-lg hover:bg-cta-hover transition-colors">
                Meet Our Full Team
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
