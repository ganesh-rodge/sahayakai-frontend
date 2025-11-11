import { motion } from 'framer-motion';
import TeacherLogin from '../components/TeacherLogin';

interface Props {
  onBack: () => void;
  onLogin?: (username: string, password: string) => void | Promise<void>;
  onSignup?: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function LoginTeacherPage({ onBack, onLogin, onSignup, loading, error }: Props) {
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
          className="max-w-md w-full bg-dark-secondary p-8 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Teacher Login</h2>
          <p className="text-gray-400 mb-6">Sign in with your username to access teacher tools.</p>

          <TeacherLogin onSubmit={(username, password) => onLogin?.(username, password)} loading={loading} serverError={error} />

          <div className="mt-6 text-center text-sm text-gray-400">
            New user?{' '}
            <button onClick={onSignup} className="text-accent hover:text-accent-light font-semibold">
              Create your teacher account
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
