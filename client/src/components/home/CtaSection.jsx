import { motion } from 'framer-motion';
import { FaWhatsapp, FaLinkedin, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

const CtaSection = () => {
  return (
    <section className="py-24 bg-primary/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cta/5 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-dark">
            Ready to Begin Your Entrepreneurial Journey?
          </h2>
          <p className="text-lg text-text-light mb-8 mx-auto max-w-2xl">
            Join IEDC LBSCEK and be part of a growing community of innovators and entrepreneurs
            shaping the future. Connect with like-minded peers, gain access to resources,
            and transform your ideas into reality.
          </p>
          
          <motion.a 
            href="https://www.whatsapp.com/channel/0029VaAYL1D2f3EAIot5Yl2N"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-cta hover:bg-cta-hover text-white rounded-full font-medium mb-10 transition-all transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <FaWhatsapp className="mr-2 text-xl" />
            Join Our WhatsApp Channel
          </motion.a>
          
          <div className="pt-6 border-t border-primary-dark max-w-md mx-auto">
            <p className="text-text-light mb-4">Or connect with us on social media</p>
            
            <motion.div 
              className="flex justify-center space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                { icon: <FaTwitter />, url: "https://x.com/lbsiedc", name: "Twitter" },
                { icon: <FaLinkedin />, url: "https://www.linkedin.com/company/iedc-lbscek/", name: "LinkedIn" },
                { icon: <FaInstagram />, url: "https://www.instagram.com/lbsiedc/", name: "Instagram" },
                { icon: <FaFacebookF />, url: "https://www.facebook.com/iedclbs", name: "Facebook" }
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-accent hover:text-white text-accent transition-colors shadow-sm"
                  aria-label={social.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
