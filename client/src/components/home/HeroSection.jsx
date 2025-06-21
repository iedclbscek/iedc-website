import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-primary/5 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-cta/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 pt-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1] 
            }}
            className="text-center md:text-left"
          >
            <motion.div 
              className="inline-block mb-6 rounded-full bg-accent/10 px-4 py-2 text-accent text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Innovation & Entrepreneurship Development Cell
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-text-dark"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Turn Ideas <span className="text-accent">Into</span><br />
              Reality
            </motion.h1>
            
            <motion.p 
              className="text-lg text-text-light mb-8 max-w-lg mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              IEDC LBSCEK fosters the innovative and entrepreneurial spirit of students through mentorship, resources, and opportunities to build the next generation of leaders.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/events" className="px-8 py-3.5 bg-cta text-white font-medium rounded-full hover:bg-cta-hover transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Programs
              </Link>
              <a href="https://www.whatsapp.com/channel/0029VaAYL1D2f3EAIot5Yl2N" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-8 py-3.5 border-2 border-accent text-accent font-medium rounded-full hover:bg-accent hover:text-white transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
                Join Us
              </a>
            </motion.div>
            
            {/* Scroll indicator */}
            <motion.div 
              className="hidden md:flex flex-col items-center absolute bottom-10 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <span className="text-text-light text-sm mb-2">Scroll</span>
              <motion.div 
                className="w-1 h-8 bg-text-light/30 rounded-full overflow-hidden"
                animate={{ 
                  backgroundColor: ["rgba(110, 110, 110, 0.3)", "rgba(255, 107, 107, 0.3)"],
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <motion.div 
                  className="w-full bg-accent h-1/2 rounded-full"
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right side with IEDC logo and animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden md:block relative"
          >
            <motion.div 
              className="relative z-10"
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}
            >
              <img 
                src="/img/logo/IEDCLBSLogoColor.webp"
                alt="IEDC LBSCEK Logo"
                className="max-w-xs lg:max-w-sm mx-auto"
              />
            </motion.div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-lg"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-cta/20 rounded-full"></div>
            <motion.div
              className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
