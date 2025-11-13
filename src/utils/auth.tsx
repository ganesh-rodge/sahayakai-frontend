import React, { createContext, useContext, useEffect, useState } from 'react';

type User = any;

interface AuthContextValue {
  user: User | null;
  profile: any | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const { getJSON } = await import('../utils/api');
      const me = await getJSON('/user/me');
      const meUser = me?.data?.user || me?.user || null;
      const meProfile = me?.data?.profile || null;
      setUser(meUser);
      setProfile(meProfile);
      try { if (meUser) localStorage.setItem('currentUser', JSON.stringify(meUser)); } catch {}
      try { if (meProfile) localStorage.setItem('currentProfile', JSON.stringify(meProfile)); } catch {}
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    try {
      const raw = localStorage.getItem('currentProfile');
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
    
  }, []);

  const logout = () => {
    // clear cookies and storage
    try { document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; } catch {}
    try { document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; } catch {}
    try { localStorage.removeItem('currentUser'); localStorage.removeItem('currentProfile'); } catch {}
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
