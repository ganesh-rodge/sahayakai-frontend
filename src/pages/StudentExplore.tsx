import { motion } from 'framer-motion';

interface StudentExploreProps {
  onBack: () => void;
  onGetStarted: () => void;
}

export default function StudentExplore({ onBack, onGetStarted }: StudentExploreProps) {

  const features = [
    {
      icon: '🗺️',
      title: 'Personalized Roadmap',
      description: 'Get a custom learning path tailored to your goals, current level, and learning pace.',
      details: [
        'AI-generated study plans based on your strengths and weaknesses',
        'Adaptive difficulty that evolves with your progress',
        'Clear milestones and achievement tracking',
        'Recommended topics and resources'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with comprehensive analytics and insights.',
      details: [
        'Real-time performance metrics and statistics',
        'Visual progress charts and graphs',
        'Streak tracking and consistency monitoring',
        'Skill mastery indicators'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🎯',
      title: 'Smart Assessments',
      description: 'Take adaptive quizzes that adjust to your skill level in real-time.',
      details: [
        'Questions that adapt based on your answers',
        'Instant feedback with detailed explanations',
        'Performance analysis and improvement tips',
        'Practice tests and mock exams'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🤖',
      title: 'AI Tutor',
      description: '24/7 intelligent assistant to help you understand concepts and solve problems.',
      details: [
        'Step-by-step problem solving guidance',
        'Concept explanations in multiple ways',
        'Doubt clearing in real-time',
        'Practice problem generation'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '📚',
      title: 'Study Resources',
      description: 'Access curated learning materials, notes, and video tutorials.',
      details: [
        'Comprehensive study notes and summaries',
        'Video lessons and interactive content',
        'Practice exercises and worksheets',
        'Reference materials and guides'
      ],
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: '🏆',
      title: 'Achievements & Rewards',
      description: 'Earn badges, unlock achievements, and compete on leaderboards.',
      details: [
        'Gamified learning experience',
        'Unlock badges for milestones',
        'Compete with peers on leaderboards',
        'Track your ranking and improvements'
      ],
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0c0f12] to-[#09090f]">
      {/* subtle radial glow background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[1100px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.25),transparent_60%)]" />
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors z-50 hover:scale-110"
      >
        ← Back
      </button>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Explore <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Student Features</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Discover how Sahayak-AI empowers students with personalized learning experiences, smart tools, and real-time guidance.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl p-6 flex flex-col h-full
                         bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.015)_100%)]
                         border border-white/5 ring-1 ring-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                         transition-all duration-300 will-change-transform hover:-translate-y-1.5
                         hover:shadow-[0_20px_60px_rgba(0,212,170,0.18)] hover:ring-accent/40"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* hover glow */}
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(1200px_200px_at_100%_0%,rgba(0,212,170,0.15),transparent)]" />

              <div className="mx-auto mb-5 h-16 w-16 grid place-items-center rounded-2xl
                              bg-accent/12 text-accent text-3xl
                              ring-1 ring-accent/30 shadow-[0_0_22px_rgba(0,212,170,0.22)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-white text-center mb-2">{feature.title}</h3>
              <p className="text-gray-400/90 text-sm leading-relaxed text-center">{feature.description}</p>
              <div className="mt-auto pt-4 border-t border-gray-700">
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-accent mt-1">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="relative overflow-hidden rounded-2xl p-10 md:p-14 text-center mb-20
                     bg-[linear-gradient(180deg,rgba(0,212,170,0.12)_0%,rgba(0,212,170,0.05)_100%)]
                     border border-accent/30 ring-1 ring-accent/20
                     shadow-[0_12px_50px_rgba(0,212,170,0.15)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already transforming their education with AI-powered personalized learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-lg font-bold text-lg text-dark-primary
                         bg-gradient-to-r from-accent to-accent-light shadow-[0_10px_30px_rgba(0,212,170,0.25)]"
              whileHover={{ scale: 1.05, boxShadow: "0 18px 40px rgba(0, 212, 170, 0.45)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button
              onClick={onBack}
              className="px-8 py-4 rounded-lg font-bold text-lg border-2 border-accent text-accent bg-transparent"
              whileHover={{ scale: 1.05, backgroundColor: "#00d4aa", color: "#0a0a0f" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-xl p-6 text-center border border-white/5 ring-1 ring-white/5 bg-white/5/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="text-2xl font-semibold text-gray-300 mb-1">Active Students</div>
            <div className="text-4xl font-bold text-accent">50K+</div>
          </div>
          <div className="rounded-xl p-6 text-center border border-white/5 ring-1 ring-white/5 bg-white/5/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="text-2xl font-semibold text-gray-300 mb-1">Success Rate</div>
            <div className="text-4xl font-bold text-accent">95%</div>
          </div>
          <div className="rounded-xl p-6 text-center border border-white/5 ring-1 ring-white/5 bg-white/5/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="text-2xl font-semibold text-gray-300 mb-1">Student Rating</div>
            <div className="text-4xl font-bold text-accent">4.9/5</div>
          </div>
        </div>
      </div>
    </div>
  );
}
