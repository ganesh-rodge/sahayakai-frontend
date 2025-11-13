import React, { useState } from 'react';

interface Props {
  onSubmit?: (username: string, password: string) => void;
  loading?: boolean;
  serverError?: string | null;
  onForgot?: () => void;
}

export default function StudentLogin({ onSubmit, loading, serverError, onForgot }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username) return setError('Please enter your username.');
    if (!password) return setError('Please enter your password.');
    // Log submitted identifier (dev only)
    // eslint-disable-next-line no-console
    console.log('[auth] StudentLogin submit', { identifier: username });
    onSubmit?.(username, password);
  };

  return (
    <form className="space-y-5 mb-8" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-dark-input text-white placeholder-gray-400 focus:outline-none"
          placeholder="yourusername"
          required
        />
      </div>

      <div className="flex justify-end -mt-2">
        <button type="button" onClick={onForgot} className="text-xs text-accent hover:text-accent-light">
          Forgot password?
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-dark-input text-white placeholder-gray-400 focus:outline-none"
          placeholder="********"
          required
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
        {serverError && <p className="text-sm text-red-400">{serverError}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-60"
      >
        {loading ? 'Logging in...' : 'Student Login'}
      </button>
    </form>
  );
}
