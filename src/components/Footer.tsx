import logo from '../assets/logo.svg';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const navigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };
  return (
    <footer className="bg-dark-secondary border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Sahayak AI" className="h-6 w-6" />
              <span className="font-bold">Sahayak<span className="text-accent">AI</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transforming education through intelligent, adaptive learning experiences.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#about" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">Services</a></li>
              <li><a href="#resources" className="hover:text-accent transition-colors">Resources</a></li>
              <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => navigate('help')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Help Center</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Contact</button></li>
              <li><button onClick={() => navigate('faq')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">FAQ</button></li>
              <li><button onClick={() => navigate('community')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Community</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => navigate('privacy')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Privacy</button></li>
              <li><button onClick={() => navigate('terms')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Terms</button></li>
              <li><button onClick={() => navigate('security')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Security</button></li>
              <li><button onClick={() => navigate('teacher-dashboard')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Teacher Dashboard</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Sahayak-AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
