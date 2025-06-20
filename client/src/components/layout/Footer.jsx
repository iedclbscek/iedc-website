import { FaLinkedin, FaTwitter, FaFacebookF, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary/40 text-text-dark py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/img/logo/IEDCLBSLogoColor.webp" 
                alt="IEDC LBSCEK Logo" 
                className="h-12 w-auto"
              />
              <h3 className="text-xl font-bold">IEDC LBSCEK</h3>
            </div>
            
            <p className="mb-6 text-text-light max-w-md">
              Empowering students to innovate and create sustainable solutions through technology and entrepreneurship.
            </p>
            
            <div className="flex space-x-4 mb-6">
              <a href="https://x.com/lbsiedc" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-accent/10 text-accent transition-colors" aria-label="Twitter"  target='_blank'>
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/iedc-lbscek/" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-accent/10 text-accent transition-colors" aria-label="LinkedIn" target='_blank'>
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/lbsiedc/" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-accent/10 text-accent transition-colors" aria-label="Instagram" target='_blank'>
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/iedclbs" className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-accent/10 text-accent transition-colors" aria-label="Facebook" target='_blank'>
                <FaFacebookF className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-text-light hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-text-light hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/events" className="text-text-light hover:text-accent transition-colors">Events</Link></li>
              <li><Link to="/team" className="text-text-light hover:text-accent transition-colors">Team</Link></li>
              <li><Link to="/communities" className="text-text-light hover:text-accent transition-colors">Communities</Link></li>
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-text-light">
              <li className="flex items-center">
                <FaEnvelope className="text-accent mr-2" />
                <a href="mailto:iedc@lbscek.ac.in" className="hover:text-accent transition-colors">
                  iedc@lbscek.ac.in
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-accent mr-2" />
                <a href="tel:+1234567890" className="hover:text-accent transition-colors">
                  +91 (123) 456-7890
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-accent mt-1 mr-2" />
                <span>LBS College of Engineering, Kasaragod, Kerala</span>
              </li>
            </ul>
            
            {/* Login Button */}
            <Link 
              to="/login"
              className="flex items-center justify-center mt-6 px-4 py-2 bg-cta hover:bg-cta-hover text-white rounded transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Dashboard Login
            </Link>
          </div>
        </div>
        
        <div className="border-t border-primary-dark mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-text-light mb-4 md:mb-0">&copy; {currentYear} IEDC LBSCEK. All rights reserved.</p>
            
            <div className="flex items-center space-x-6">
              <img 
                src="/img/logo/logo_r.webp" 
                alt="LBS College of Engineering Logo" 
                className="h-10 w-auto"
              />
              <img 
                src="favicon.ico" 
                alt="IEDC LBS Logo" 
                className="h-10 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;