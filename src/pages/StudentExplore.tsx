import { motion } from 'framer-motion';
import { useState } from 'react';

interface StudentExploreProps {
  onBack: () => void;
  onGetStarted: () => void;
}

export default function StudentExplore({ onBack, onGetStarted }: StudentExploreProps) {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

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
    <div className="min-h-screen bg-dark-primary">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors z-50 hover:scale-110"
      >
        ← Back
      </button>

      <div className="max-w-7xl mx-auto px-6 py-20">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-dark-secondary border border-gray-800 rounded-xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, borderColor: "#00d4aa" }}
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`}></div>

              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>

              {activeFeature === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-700"
                >
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-accent mt-1">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <button
                onClick={() => setActiveFeature(activeFeature === index ? null : index)}
                className="mt-4 text-accent text-sm font-semibold hover:text-accent-light transition-colors"
              >
                {activeFeature === index ? 'Show less' : 'Learn more'} →
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-accent/10 to-accent-light/10 border border-accent/30 rounded-xl p-8 md:p-12 text-center"
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
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-bold text-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 212, 170, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
            <motion.button
              onClick={onBack}
              className="px-8 py-4 border-2 border-accent text-accent rounded-lg font-bold text-lg"
              whileHover={{ scale: 1.05, backgroundColor: "#00d4aa", color: "#0a0a0f" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">50K+</div>
            <div className="text-gray-400">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">95%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent mb-2">4.9/5</div>
            <div className="text-gray-400">Student Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
