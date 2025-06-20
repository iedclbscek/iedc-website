import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Team = () => {
  return (
    <section className="py-20 bg-primary/10" id="team">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-6">Our Team</h2>
          <p className="text-lg text-text-light mb-8">
            Meet the passionate individuals driving innovation and entrepreneurship at IEDC LBSCEK.
            Our team consists of dedicated faculty coordinators and student leaders working together
            to create a vibrant startup ecosystem.
          </p>
          <Link 
            to="/team" 
            className="inline-flex items-center justify-center px-8 py-3 bg-cta text-white font-semibold rounded-lg hover:bg-cta-hover transition-colors shadow-sm"
          >
            Meet Our Team
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;