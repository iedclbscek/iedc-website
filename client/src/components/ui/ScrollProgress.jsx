import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down a bit
      setIsVisible(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Vertical progress bar */}
      <motion.div
        className="fixed left-0 top-0 bottom-0 w-1 bg-primary z-50"
        style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
      />
      
      {/* Progress percentage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center z-50"
      >
        <motion.div className="text-text-dark text-sm font-medium">
          {Math.round(scrollYProgress.get() * 100)}%
        </motion.div>
      </motion.div>
    </>
  );
};

export default ScrollProgress;
