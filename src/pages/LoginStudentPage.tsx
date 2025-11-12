import { motion } from 'framer-motion';
import StudentLogin from '../components/StudentLogin';

interface Props {
  onBack: () => void;
  onLogin?: (username: string, password: string) => void | Promise<void>;
  onSignup?: () => void;
  loading?: boolean;
  error?: string | null;
  onForgot?: () => void;
}

export default function LoginStudentPage({ onBack, onLogin, onSignup, loading, error, onForgot }: Props) {
  return (
    <motion.div
      className="min-h-screen bg-dark-primary flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors z-50 hover:scale-110 font-medium"
      >
        ← Back
      </button>

      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <motion.div
          className="max-w-md w-full bg-dark-tertiary p-8 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Student Login</h2>
            <p className="text-gray-400 mb-6">Sign in with your username to access student tools.</p>
            
            <StudentLogin
              onSubmit={(username, password) => onLogin?.(username, password)}
              loading={loading}
              serverError={error}
              onForgot={() => {
                onForgot?.();
              }}
            />

            <div className="mt-6 text-center text-sm text-gray-400">
              New user?{' '}
              <button onClick={onSignup} className="text-accent hover:text-accent-light font-semibold">
                Create your student account
              </button>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
