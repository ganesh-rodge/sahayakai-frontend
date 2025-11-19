import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { postJSON } from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';
// Supabase-based email reset is no longer used in the OTP flow.
// Keeping import commented for potential future integration.
// import supabase from '../utils/supabaseClient';

interface Props {
  role: 'student' | 'teacher';
  onBack: () => void;
  onSubmitEmail?: (email: string, role: 'student' | 'teacher') => Promise<void> | void;
}

export default function ForgotPasswordPage({ role: _role, onBack: _onBack }: Props) {
  const [step, setStep] = useState<'email' | 'verify' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // server-backed OTP; no local generation
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    try {
      setLoading(true);
      // Call backend to send OTP (dev server logs OTP to console)
      await postJSON('/auth/send-otp', { email });
      setInfo('If an account exists, an OTP has been sent. Check server logs for dev OTP.');
      setStep('verify');
      setOtpDigits(Array(6).fill(''));
      // Focus first OTP box on next paint
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (err: any) {
      setError(err?.message || 'Could not request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP sent to your email.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    try {
      setLoading(true);
      // Ask backend to verify OTP and reset password
      await postJSON('/auth/reset-with-otp', { email, otp, newPassword: password });
      setInfo('Password reset successfully. You can now sign in.');
      setStep('done');
    } catch (err: any) {
      setError(err?.message || 'Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Keep `otp` string in sync with digit boxes
  useEffect(() => {
    const code = otpDigits.join('');
    setOtp(code);
  }, [otpDigits]);

  const handleOtpDigitChange = (index: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
    if (v && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        // clear current
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index - 1] = '';
          return next;
        });
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData('text') || '';
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length) {
      e.preventDefault();
      setOtpDigits(() => {
        const next = Array(6).fill('');
        for (let i = 0; i < 6; i++) next[i] = digits[i] ?? '';
        return next;
      });
      const lastIndex = Math.min(digits.length, 6) - 1;
      if (lastIndex >= 0) otpRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-dark-primary flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      

      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <motion.div
          className="max-w-md w-full bg-dark-secondary p-8 rounded-lg border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
          {step === 'email' && (
            <>
              <p className="text-gray-400 mb-6">Enter your registered email to receive an OTP.</p>
              <form className="space-y-5" onSubmit={handleSendOtp} noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-dark-input text-white placeholder-gray-400 focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                {info && <p className="text-sm text-green-400">{info}</p>}
                <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent-light text-dark-primary font-semibold disabled:opacity-60">
                  {loading ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </form>
            </>
          )}

          {step === 'verify' && (
            <>
              <p className="text-gray-400 mb-6">Enter the OTP sent to <span className="text-white font-medium">{email}</span> and set a new password.</p>
              <form className="space-y-5" onSubmit={handleResetWithOtp} noValidate>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">OTP</label>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSendOtp}
                      className="text-xs text-accent hover:text-accent-light disabled:opacity-60"
                      title="Resend OTP"
                    >
                      Resend OTP
                    </button>
                  </div>
                  <div
                    className="grid grid-cols-6 gap-2 sm:gap-3"
                    onPaste={handleOtpPaste}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={otpDigits[i]}
                        onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-full h-10 sm:h-12 text-center text-lg rounded-md bg-dark-input text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder=""
                        maxLength={1}
                        required
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-dark-input text-white placeholder-gray-400 focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm new password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-dark-input text-white placeholder-gray-400 focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      title={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                {info && <p className="text-sm text-green-400">{info}</p>}
                <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent-light text-dark-primary font-semibold disabled:opacity-60">
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300">
                Password updated successfully for <span className="font-semibold">{email}</span>.
              </div>
              <button onClick={_onBack} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent-light text-dark-primary font-semibold">Return to Login</button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
