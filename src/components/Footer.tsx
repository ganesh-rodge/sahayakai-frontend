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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-8 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Transforming education through intelligent, adaptive learning experiences.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button type="button" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">About</button></li>
              <li><button type="button" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Services</button></li>
              <li><button type="button" onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Resources</button></li>
              <li><button type="button" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Features</button></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button type="button" onClick={() => navigate('help')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Help Center</button></li>
              <li><button type="button" onClick={() => navigate('contact')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Contact</button></li>
              <li><button type="button" onClick={() => navigate('faq')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">FAQ</button></li>
              <li><button type="button" onClick={() => navigate('community')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Community</button></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button type="button" onClick={() => navigate('privacy')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Privacy</button></li>
              <li><button type="button" onClick={() => navigate('terms')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Terms</button></li>
              <li><button type="button" onClick={() => navigate('security')} className="hover:text-accent transition-colors bg-none border-none cursor-pointer">Security</button></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-bold mb-4">Social</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Instagram</a>
              </li>
              <li>
                <a href="https://www.telegram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Telegram</a>
              </li>
              <li>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Facebook</a>
              </li>
              <li>
                <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
              </li>
              <li>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2025 Sahayak-AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
