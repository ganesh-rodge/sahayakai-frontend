import { useState } from 'react';
import type { TeacherPage1Data } from '../TeacherSignup';

interface Page1Props {
  onBack: () => void;
  onLogin: () => void;
  onNext: (data: TeacherPage1Data) => void;
}

export default function TeacherSignupPage1({ onBack, onLogin, onNext }: Page1Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pwd: string): boolean => {
    const hasCapital = /[A-Z]/.test(pwd);
    const hasSmall = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const hasMinLength = pwd.length >= 8;

    return hasCapital && hasSmall && hasNumber && hasSpecial && hasMinLength;
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  };

  const handleVerifyEmail = async () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowVerification(true);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore only)';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (!showVerification) {
      newErrors.verification = 'Please verify your email first';
    } else if (!verificationCode) {
      newErrors.verification = 'Please enter the verification code';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({ username, email, password });
  };

  const getPasswordStrength = () => {
    if (!password) return { text: '', color: '', width: '0%' };

    let strength = 0;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    if (password.length >= 8) strength++;

    if (strength < 3) return { text: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength < 5) return { text: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { text: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fadeIn">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors hover:scale-110"
      >
        ← Back
      </button>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 justify-center mb-4">
            <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Teacher Account</h1>
          <p className="text-gray-400">Step 1 of 4: Account Information</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-accent text-dark-primary flex items-center justify-center font-bold text-sm">1</div>
            <div className="w-12 h-1 bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-sm">2</div>
            <div className="w-12 h-1 bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
            <div className="w-12 h-1 bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-sm">4</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-dark-secondary p-8 rounded-lg border border-gray-800">
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Create a username"
              className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors min-w-0"
                disabled={showVerification}
              />
              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={showVerification || isLoading}
                className="px-6 py-3 bg-accent/20 text-accent border border-accent rounded-lg font-semibold hover:bg-accent hover:text-dark-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
              >
                {isLoading ? 'Sending...' : showVerification ? 'Verified' : 'Verify'}
              </button>
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {showVerification && (
            <div className="animate-fadeInUp">
              <label className="block text-sm font-semibold mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              <p className="text-sm text-gray-400 mt-1">Check your email for the verification code</p>
              {errors.verification && <p className="text-red-500 text-sm mt-1">{errors.verification}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
            />
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Password strength:</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.color.replace('bg-', 'text-')
                  }`}>{passwordStrength.text}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Must contain: uppercase, lowercase, number, special character (min 8 characters)
            </p>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all mt-6"
          >
            Continue to Personal Details
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <button onClick={onLogin} className="text-accent hover:text-accent-light transition-colors font-semibold">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
