interface HelpCenterProps {
  onNavigate?: (page: string) => void;
}

export default function HelpCenter({ onNavigate }: HelpCenterProps) {
  const categories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        'How to create an account',
        'Setting up your profile',
        'Navigating the dashboard',
        'First steps guide'
      ]
    },
    {
      title: 'For Students',
      icon: '📚',
      articles: [
        'Accessing learning materials',
        'Tracking your progress',
        'Taking assessments',
        'Getting AI recommendations'
      ]
    },
    {
      title: 'For Teachers',
      icon: '👨‍🏫',
      articles: [
        'Creating courses',
        'Managing students',
        'Grading and feedback',
        'Analytics and reports'
      ]
    },
    {
      title: 'Technical Support',
      icon: '🔧',
      articles: [
        'Troubleshooting login issues',
        'Browser compatibility',
        'Resetting your password',
        'Account recovery'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Help <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">Find answers and get support</p>

          <div className="max-w-2xl mx-auto">
            <input
              type="search"
              placeholder="Search for help..."
              className="w-full px-6 py-4 bg-dark-secondary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-dark-secondary border border-gray-800 rounded-lg p-8 hover:border-accent transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{category.icon}</span>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              <ul className="space-y-3">
                {category.articles.map((article, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <span className="text-accent">→</span>
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-dark-secondary border border-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-gray-400 mb-6">Our support team is here to assist you</p>
          <button
            onClick={() => onNavigate?.('contact')}
            className="px-8 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all"
            aria-label="Go to Contact Support page"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
