interface StudentDashboardProps {
  onBack: () => void;
}

export default function StudentDashboard({ onBack }: StudentDashboardProps) {
  const studentName = 'Alex Johnson';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="sticky top-0 z-50 bg-dark-secondary/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-2">
                <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-8 w-auto" />
                <span className="font-bold text-lg">Student Dashboard</span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-dark-primary font-bold">
              {studentName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-fadeIn">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {getGreeting()}, <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">{studentName}</span>
            </h1>
            <p className="text-gray-400 text-lg">Continue your learning journey</p>
          </div>

          <div className="bg-dark-secondary border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-3">Student Dashboard Coming Soon</h2>
            <p className="text-gray-400">We're building amazing features for your learning experience!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
