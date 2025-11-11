import { useState } from 'react';
import { motion } from 'framer-motion';
import StudentSignup from './StudentSignup';
import TeacherSignup from './TeacherSignup';

interface SignupPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export default function SignupPage({ onBack, onLogin }: SignupPageProps) {
  const [view, setView] = useState<'selection' | 'student' | 'teacher'>('selection');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  if (view === 'student') {
    return <StudentSignup onBack={() => setView('selection')} onLogin={onLogin} />;
  }

  if (view === 'teacher') {
    return <TeacherSignup onBack={() => setView('selection')} onLogin={onLogin} />;
  }

  return (
    <motion.div
      className="min-h-screen bg-dark-primary flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors z-50 hover:scale-110"
        aria-label="Go back"
      >
        ← Back
      </button>

      <motion.div
        className="max-w-6xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-12 px-4">
          <div className="flex items-center gap-2 justify-center mb-4">
            <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-12 w-auto" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">How do you want to use Sahayak-AI?</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Choose the role that best fits you — we'll tailor the onboarding and feature set. You can always switch later.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {/* Teacher Card */}
          <motion.section
            role="button"
            tabIndex={0}
            aria-pressed={selectedRole === 'teacher'}
            onClick={() => { setSelectedRole('teacher'); setView('teacher'); }}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedRole('teacher'); setView('teacher'); } }}
            className={`${selectedRole === 'teacher' ? 'ring-2 ring-accent/40' : ''} p-8 rounded-2xl bg-gradient-to-b from-dark-secondary/60 to-dark-secondary border-2 border-gray-800 hover:border-accent/50 shadow-lg cursor-pointer group relative overflow-hidden`}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 240 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">🎓</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">I'm here to teach and guide</h3>
                <p className="text-gray-400 mt-2">Create interactive courses, assign work, and track student progress with intelligent analytics.</p>

                <ul className="mt-4 grid gap-2">
                  <li className="text-sm text-gray-300">• Curriculum builder with AI suggestions</li>
                  <li className="text-sm text-gray-300">• Class & student analytics dashboard</li>
                  <li className="text-sm text-gray-300">• Integrations for gradebooks & LMS</li>
                </ul>

                <div className="mt-6 flex items-center gap-2 text-accent font-semibold">
                  <span>Continue as Teacher</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Student Card */}
          <motion.section
            role="button"
            tabIndex={0}
            aria-pressed={selectedRole === 'student'}
            onClick={() => { setSelectedRole('student'); setView('student'); }}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedRole('student'); setView('student'); } }}
            className={`${selectedRole === 'student' ? 'ring-2 ring-accent/40' : ''} p-8 rounded-2xl bg-gradient-to-b from-dark-tertiary/60 to-dark-tertiary border-2 border-gray-800 hover:border-accent/50 shadow-lg cursor-pointer group relative overflow-hidden`}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 240 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">📖</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">I'm here to learn and grow</h3>
                <p className="text-gray-400 mt-2">Access personalized learning paths, practice exercises, and get feedback to accelerate your learning.</p>

                <ul className="mt-4 grid gap-2">
                  <li className="text-sm text-gray-300">• Personalized study plans</li>
                  <li className="text-sm text-gray-300">• Hands-on practice and quizzes</li>
                  <li className="text-sm text-gray-300">• Track progress and achievements</li>
                </ul>

                <div className="mt-6 flex items-center gap-2 text-accent font-semibold">
                  <span>Continue as Student</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">Already have an account? <button onClick={onLogin} className="text-accent hover:text-accent-light transition-colors font-semibold">Login here</button></p>
        </div>
      </motion.div>
    </motion.div>
  );
}
