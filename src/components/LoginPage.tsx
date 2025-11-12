import { motion } from 'framer-motion';

interface LoginPageProps {
  onBack: () => void;
  onSignupTeacher?: () => void;
  onSignupStudent?: () => void;
  onChooseRole?: (role: 'teacher' | 'student') => void;
}

export default function LoginPage({ onBack: _onBack, onSignupTeacher, onSignupStudent, onChooseRole }: LoginPageProps) {
  return (
    <motion.div
      className="min-h-screen bg-dark-primary flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button intentionally removed from the login role selection screen */}

      <div className="flex-1 grid md:grid-cols-2 gap-0">
        <div className="bg-dark-secondary flex items-center justify-center p-8 md:p-12 border-r border-gray-800">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-8">
              <div className="h-[38px] mb-6">
                <span className="inline-block px-4 py-2 bg-accent text-dark-primary text-xs font-bold rounded-full uppercase tracking-wide">
                  For Teachers
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white italic">
                For <span className="italic">Teachers</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Thousands of educators track student progress and teach effectively with our comprehensive tools.
              </p>
            </div>

            <div className="mb-8">
              <button
                onClick={() => onChooseRole?.('teacher')}
                className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                Teacher Login
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-1">Don't have an account?</p>
              <button onClick={() => onSignupTeacher?.()} className="text-accent hover:text-accent-light transition-colors font-bold text-lg">
                Sign up.
              </button>
            </div>
          </motion.div>
        </div>

        <div className="bg-dark-tertiary flex items-center justify-center p-8 md:p-12">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-8">
              <div className="h-[38px] mb-6"></div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white italic">
                For <span className="italic">Students</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Join over 26 million students, practice coding skills, prepare for interviews, and get hired.
              </p>
            </div>

            <div className="mb-8">
              <button
                onClick={() => onChooseRole?.('student')}
                className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-accent/30 transition-all"
              >
                Student Login
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-1">Don't have an account?</p>
              <button onClick={() => onSignupStudent?.()} className="text-accent hover:text-accent-light transition-colors font-bold text-lg">
                Sign up.
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
