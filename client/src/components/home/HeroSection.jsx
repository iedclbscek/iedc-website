import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  // State for animated words
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const animatedWords = ["Reality", "Success", "Impact", "Innovation", "Products"];

  // Change word every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 1) % animatedWords.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [animatedWords.length]);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-primary/10 to-accent/5 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-cta/5 rounded-full blur-3xl"></div>
        
        {/* Decorative shapes */}
        <motion.div 
          className="absolute top-32 right-20 w-24 h-24 bg-accent/10 rounded-lg"
          animate={{ 
            rotate: [0, 10, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-32 left-20 w-20 h-20 bg-cta/10 rounded-full"
          animate={{ 
            rotate: [0, -10, 0],
            x: [0, 15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        ></motion.div>
        
        {/* Decorative dots grid */}
        <div className="absolute inset-0 bg-[url('/img/dot-pattern.png')] bg-repeat opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-6 pt-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <motion.div 
              className="inline-block mb-6 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 px-6 py-3 text-accent text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              Innovation & Entrepreneurship Development Cell
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-text-dark relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Turn Ideas Into{" "}
              <div className="h-[70px] md:h-[80px] lg:h-[90px] overflow-hidden inline-block relative">
                <motion.div
                  key={currentWordIndex}
                  initial={{ y: 70 }}
                  animate={{ y: 0 }}
                  exit={{ y: -70 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  className="text-accent absolute"
                >
                  {animatedWords[currentWordIndex]}
                </motion.div>
              </div>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-text-light mb-8 max-w-lg mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              IEDC LBSCEK fosters the innovative and entrepreneurial spirit of students 
              through mentorship, resources, and opportunities to build the next generation of leaders.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/events" className="px-8 py-3.5 bg-gradient-to-r from-cta to-cta-hover text-white font-medium rounded-full hover:shadow-lg hover:shadow-cta/20 transition-all duration-300 transform hover:-translate-y-1">
                Explore Programs
              </Link>
              <motion.a 
                href="https://www.whatsapp.com/channel/0029VaAYL1D2f3EAIot5Yl2N" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-8 py-3.5 border-2 border-accent text-accent font-medium rounded-full hover:bg-accent hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Us
              </motion.a>
            </motion.div>
            
            {/* Stats indicators */}
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto md:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div className="text-center p-2" whileHover={{ y: -5 }}>
                <h3 className="text-2xl font-bold text-accent">500+</h3>
                <p className="text-sm text-text-light">Students</p>
              </motion.div>
              <motion.div className="text-center p-2" whileHover={{ y: -5 }}>
                <h3 className="text-2xl font-bold text-accent">50+</h3>
                <p className="text-sm text-text-light">Events</p>
              </motion.div>
              <motion.div className="text-center p-2" whileHover={{ y: -5 }}>
                <h3 className="text-2xl font-bold text-accent">20+</h3>
                <p className="text-sm text-text-light">Startups</p>
              </motion.div>
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
          
          {/* Right side with animated logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden md:flex items-center justify-center relative"
          >
            <motion.div 
              className="absolute w-full h-full max-w-md max-h-md rounded-full bg-gradient-to-r from-accent/10 to-cta/10 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl z-10"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                y: { 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 10, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 30px 60px rgba(0,0,0,0.1)"
              }}
            >
              <img 
                src="/img/logo/IEDCLBSLogoColor.webp"
                alt="IEDC LBSCEK Logo"
                className="max-w-xs"
              />
            </motion.div>
            
            {/* Floating elements */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-lg z-20"
              animate={{ rotate: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -top-10 -left-10 w-20 h-20 bg-cta/20 rounded-full z-20"
              animate={{ rotate: [0, -10, 0], x: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute top-1/2 -right-8 w-16 h-16 bg-primary-dark/20 rounded-lg z-20"
              animate={{ rotate: [0, 20, 0], y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
