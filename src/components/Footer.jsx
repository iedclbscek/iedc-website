import { FaLinkedin, FaInstagram, FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">IEDC LBSCEK</h3>
            <p className="text-gray-400 text-sm md:text-base">
              Empowering students to innovate and create sustainable solutions through technology and entrepreneurship.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start text-gray-400">
                <FaEnvelope className="mr-2 flex-shrink-0" />
                <a href="mailto:iedc@lbscek.ac.in" className="hover:text-white transition-colors text-sm md:text-base">
                  iedc@lbscek.ac.in
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start text-gray-400">
                <FaWhatsapp className="mr-2 flex-shrink-0" />
                <a href="https://whatsapp.com/channel/0029VaAYL1D2f3EAIot5Yl2N" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm md:text-base">
                  Join our WhatsApp Channel
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start text-gray-400">
                <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                <span className="text-sm md:text-base">LBS College of Engineering, Kasaragod, Kerala</span>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="https://www.linkedin.com/company/iedc-lbscek/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="https://instagram.com/iedc_lbscek" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-center text-gray-400 text-sm md:text-base">
            &copy; {new Date().getFullYear()} IEDC LBSCEK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;