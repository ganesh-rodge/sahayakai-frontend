import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoClick?: () => void;
}

export default function Navbar({ onLoginClick, onSignupClick, onLogoClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'services', 'resources', 'features'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-dark-primary/90 backdrop-blur-xl border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={onLogoClick}
          >
            <img
              src="/Sahayak%20AI%20logo.png"
              alt="Sahayak AI"
              className="h-9 w-auto"
            />
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className={`relative text-gray-400 hover:text-accent transition-colors ${
                activeSection === 'about' ? 'text-accent' : ''
              }`}
            >
              About
              {activeSection === 'about' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent animate-fadeIn"></span>
              )}
            </button>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className={`relative text-gray-400 hover:text-accent transition-colors ${
                activeSection === 'services' ? 'text-accent' : ''
              }`}
            >
              Services
              {activeSection === 'services' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent animate-fadeIn"></span>
              )}
            </button>
            <button
              onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}
              className={`relative text-gray-400 hover:text-accent transition-colors ${
                activeSection === 'resources' ? 'text-accent' : ''
              }`}
            >
              Resources
              {activeSection === 'resources' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent animate-fadeIn"></span>
              )}
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className={`relative text-gray-400 hover:text-accent transition-colors ${
                activeSection === 'features' ? 'text-accent' : ''
              }`}
            >
              Features
              {activeSection === 'features' && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent animate-fadeIn"></span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <motion.button
              onClick={onLoginClick}
              className="px-5 py-2 border border-gray-700 rounded-lg"
              whileHover={{ backgroundColor: "#13131a", borderColor: "#00d4aa" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={onSignupClick}
              className="px-5 py-2 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 212, 170, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Sign Up
            </motion.button>
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-dark-secondary border-b border-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-4">
                <button onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left text-gray-400 hover:text-accent transition-colors py-2">About</button>
                <button onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left text-gray-400 hover:text-accent transition-colors py-2">Services</button>
                <button onClick={() => { document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left text-gray-400 hover:text-accent transition-colors py-2">Resources</button>
                <button onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="block w-full text-left text-gray-400 hover:text-accent transition-colors py-2">Features</button>

                <div className="pt-4 space-y-3 border-t border-gray-800">
                  <button
                    onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                    className="w-full px-5 py-2 border border-gray-700 rounded-lg hover:bg-gray-900 transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { onSignupClick(); setIsMenuOpen(false); }}
                    className="w-full px-5 py-2 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
