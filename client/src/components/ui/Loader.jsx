import { useEffect, useState } from 'react';

const Loader = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const text = "IEDC LBSCEK";
  
  useEffect(() => {
    // Animate the text typing effect
    if (textIndex < text.length) {
      const timer = setTimeout(() => {
        setTextIndex(textIndex + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Complete loading after text is fully displayed and a slight delay
      const timer = setTimeout(() => {
        setLoading(false);
        setTimeout(() => onComplete(), 600); // Allow fade-out animation to play
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [textIndex, onComplete]);
  
  return (
    <div
      className={`fixed inset-0 bg-accent/90 flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        !loading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        {/* Animated circular loader */}
        <div className="w-24 h-24 border-t-4 border-b-4 border-white rounded-full animate-spin mb-8"></div>
        
        {/* IEDC logo/text with typewriter effect */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-wider overflow-hidden">
            {text.substring(0, textIndex)}
            <span className="animate-pulse inline-block ml-1 -mb-1 w-2 h-8 bg-white"></span>
          </h1>
          <p className="text-white/80 mt-6 opacity-0 animate-fade-in" style={{ animationDelay: '1500ms' }}>
            Innovation & Entrepreneurship Development Cell
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
