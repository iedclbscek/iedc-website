import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { communities } from '../data/communitiesData';

const CommunitiesPage = () => {
  return (
    <div className="min-h-screen bg-primary/5">
      {/* Hero section */}
      <section className="bg-accent/10 pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-accent hover:text-accent-dark mb-8 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">Nexus</h1>
            <div className="w-20 h-1 bg-accent mb-6 mx-auto"></div>
            <p className="text-lg text-text-light leading-relaxed max-w-3xl mx-auto">
              Join our diverse range of technology and innovation communities.
              Each community offers unique opportunities to learn, grow, and contribute
              to exciting projects and initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Communities grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {communities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link to={community.path} className="block h-full">
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 h-full flex flex-col">
                    <div className="text-4xl mb-4">{community.icon}</div>
                    <h3 className="text-xl font-bold text-text-dark mb-2">{community.name}</h3>
                    <p className="text-text-light flex-grow">{community.description}</p>
                    <div className="mt-4 text-accent text-sm font-medium">Learn more →</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunitiesPage;
