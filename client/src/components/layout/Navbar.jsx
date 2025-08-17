import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Communities', path: '/communities' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine background color based on scroll position
  const navbarBgClass = isScrolled 
    ? 'bg-white shadow-md' 
    : 'bg-background/80 backdrop-blur-sm';

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        navbarBgClass
      } ${isScrolled ? 'py-3' : 'py-5'}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 font-bold text-2xl text-text-dark"
          >
            <img 
              src="/favicon.ico" 
              alt="IEDC LBSCEK Logo" 
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="hidden sm:inline">IEDC LBSCEK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-medium transition-colors duration-200 text-text-light hover:text-accent"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth Link */}
            
              <Link
                to="/register"
                className="px-4 py-2 bg-accent text-white rounded-md font-medium transition-colors duration-200 hover:bg-accent-dark"
              >
                Join Us
              </Link>
            
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none text-text-dark"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg mt-2 py-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-4 py-2 text-text-dark hover:bg-primary/50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Auth Link */}
            <Link
                to="/register"
                className="block px-4 py-2 text-accent font-medium border-t border-gray-200 mt-2 pt-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Us
              </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
