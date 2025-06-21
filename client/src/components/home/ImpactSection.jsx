import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Counter animation component
const AnimatedCounter = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const endValue = parseInt(value);
      const duration = 2000; // ms
      const step = Math.max(1, Math.floor(endValue / (duration / 16))); // 60fps approx
      
      const timer = setInterval(() => {
        startValue += step;
        if (startValue > endValue) {
          setCount(endValue);
          clearInterval(timer);
        } else {
          setCount(startValue);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-5xl md:text-6xl font-bold text-accent mb-2">
          {count}{value.toString().includes('+') ? '+' : ''}
        </h3>
        <p className="text-text-light font-medium">{label}</p>
      </motion.div>
    </div>
  );
};

const ImpactSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark inline-block relative">
            Our Impact
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-accent rounded-full"></div>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <AnimatedCounter value="500+" label="Students Involved" />
          <AnimatedCounter value="50+" label="Successful Events" />
          <AnimatedCounter value="20+" label="Startups Incubated" />
          <AnimatedCounter value="10+" label="Years of Excellence" />
        </div>
        
        {/* Impact quote */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 mx-auto max-w-3xl text-center"
        >
          <blockquote className="text-xl italic text-text-light">
            "At IEDC LBSCEK, we don't just build startups, we build startup mindsets – empowering students to become future leaders, innovators and change-makers."
          </blockquote>
          <div className="mt-4 text-accent font-medium">- IEDC LBSCEK Team</div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;
