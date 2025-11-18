import { motion } from 'framer-motion';
import { useState } from 'react';
import ExploreFeatureModal, { type ExploreFeatureData } from '../components/ExploreFeatureModal';

interface TeacherExploreProps {
  onBack: () => void;
  onGetStarted: () => void;
}

export default function TeacherExplore({ onBack: _onBack, onGetStarted }: TeacherExploreProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ExploreFeatureData | null>(null);

  const features = [
    {
      icon: '📝',
      title: 'Content Generator',
      description: 'Create localized stories and educational content powered by AI.',
      capabilities: [
        'Auto-generate worksheets and assignments',
        'Create quiz questions based on topics',
        'Generate practice problems with solutions',
        'Customize difficulty levels'
      ],
      stats: { created: '0', unit: 'created' }
    },
    {
      icon: '📸',
      title: 'Material Differentiator',
      description: 'Transform textbook pages into multi-level worksheets.',
      capabilities: [
        'Scan and digitize textbook content',
        'Generate multiple difficulty levels',
        'Create differentiated worksheets',
        'Export in various formats'
      ],
      stats: { created: '12', unit: 'worksheets' }
    },
    {
      icon: '❓',
      title: 'Knowledge Base',
      description: 'Get instant explanations for student questions.',
      capabilities: [
        'Instant answers to student questions',
        'Multiple explanation approaches',
        'Visual aids and examples',
        'Context-aware responses'
      ],
      stats: { created: '48', unit: 'questions answered' }
    },
    {
      icon: '🎨',
      title: 'Visual Aid Generator',
      description: 'Create blackboard-ready drawings and charts.',
      capabilities: [
        'Create diagrams and flowcharts',
        'Generate mathematical graphs',
        'Design concept maps',
        'Export for presentations'
      ],
      stats: { created: '15', unit: 'diagrams' }
    },
    {
      icon: '📅',
      title: 'Lesson Planner',
      description: 'Generate structured weekly lesson plans.',
      capabilities: [
        'Auto-generate lesson structures',
        'Align with curriculum standards',
        'Track learning objectives',
        'Schedule activities and assessments'
      ],
      stats: { created: '0', unit: 'planned' }
    },
    {
      icon: '🎮',
      title: 'Game Generator',
      description: 'Create engaging educational games.',
      capabilities: [
        'Build quiz-based games',
        'Create interactive challenges',
        'Customize game mechanics',
        'Track student engagement'
      ],
      stats: { created: '6', unit: 'games' }
    },
    // Audio Reading Assessment removed
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track class and individual student performance.',
      capabilities: [
        'Real-time performance metrics',
        'Identify struggling students',
        'Track engagement levels',
        'Generate progress reports'
      ],
      stats: { created: 'Live', unit: 'data' }
    }
  ];


  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#0c0f12] to-[#09090f]">
      {/* subtle radial glow background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[1100px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.25),transparent_60%)]" />
      

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Explore <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Teacher Tools</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Discover powerful AI-driven tools designed to save time, enhance teaching effectiveness, and track student progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.button
              key={feature.title}
              onClick={() => {
                setSelected({
                  icon: feature.icon,
                  title: feature.title,
                  description: feature.description,
                  items: feature.capabilities,
                  ctaLabel: 'Get Started',
                  onCta: onGetStarted,
                });
                setModalOpen(true);
              }}
              className="text-left group relative overflow-hidden rounded-2xl p-6 flex flex-col h-full
                         bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.015)_100%)]
                         border border-white/5 ring-1 ring-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                         transition-all duration-300 will-change-transform hover:-translate-y-1.5
                         hover:shadow-[0_20px_60px_rgba(0,212,170,0.18)] hover:ring-accent/40"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* hover glow */}
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(1200px_200px_at_100%_0%,rgba(0,212,170,0.15),transparent)]" />

              <header className="relative">
                <div className="mx-auto mb-5 h-16 w-16 grid place-items-center rounded-2xl
                                bg-accent/12 text-accent text-3xl
                                ring-1 ring-accent/30 shadow-[0_0_22px_rgba(0,212,170,0.22)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-white text-center mb-2">{feature.title}</h3>
                <p className="text-gray-400/90 text-sm leading-relaxed text-center">{feature.description}</p>
              </header>

            </motion.button>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join over 2,000 educators who are saving hours every week with AI-powered teaching tools.
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

        <div className="grid md:grid-cols-4 gap-6">
          <div className="rounded-xl p-6 text-center border border-white/5 ring-1 ring-white/5 bg-white/5/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-accent mb-1">10+ hrs</div>
            <div className="text-gray-400 text-sm">Saved per week</div>
          </div>
          <div className="rounded-xl p-6 text-center border border-white/5 ring-1 ring-white/5 bg-white/5/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-accent mb-1">2K+</div>
            <div className="text-gray-400 text-sm">Active Teachers</div>
          </div>
          <div className="rounded-xl p-6 text-center border border-white/5 ring-1 ring-white/5 bg-white/5/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-accent mb-1">4.8/5</div>
            <div className="text-gray-400 text-sm">Teacher Rating</div>
          </div>
          <div className="rounded-xl p-6 text-center border border-white/5 ring-1 ring-white/5 bg-white/5/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-accent mb-1">95%</div>
            <div className="text-gray-400 text-sm">Would Recommend</div>
          </div>
        </div>
      </div>
      <ExploreFeatureModal open={modalOpen} onClose={() => setModalOpen(false)} feature={selected} />
      {/* Demo modal replaced by structured feature modal */}
    </div>
  );
}
