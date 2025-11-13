import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Resources from '../components/Resources';
import Features from '../components/Features';
import Footer from '../components/Footer';
import LoginPage from '../components/LoginPage';
import LoginTeacherPage from '../pages/LoginTeacherPage';
import LoginStudentPage from '../pages/LoginStudentPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import SignupPage from '../components/SignupPage';
import StudentExplore from '../pages/StudentExplore';
import TeacherExplore from '../pages/TeacherExplore';
import HelpCenter from '../pages/support/HelpCenter';
import Contact from '../pages/support/Contact';
import FAQ from '../pages/support/FAQ';
import Community from '../pages/support/Community';
import Privacy from '../pages/legal/Privacy';
import Terms from '../pages/legal/Terms';
import Security from '../pages/legal/Security';
import TeacherDashboard from '../pages/TeacherDashboard';
import StudentDashboard from '../components/StudentDashboard';
import { AuthProvider } from '../utils/auth';
import ErrorBoundary from '../components/ErrorBoundary';

function App() {
  const navigate = useNavigate();

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (role: 'teacher' | 'student', identifier: string, password: string) => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      // Call configured API base -> /user/login
      const { postJSON } = await import('../utils/api');
      const payload = { identifier, password };
      // Log what we're sending (dev-only) — do not include role in payload
      // eslint-disable-next-line no-console
      console.log('[auth] Sending login request to /user/login', { payload });
      const data = await postJSON('/user/login', payload);
      // eslint-disable-next-line no-console
      console.log('[auth] Login response:', data);

      // Backend sets HttpOnly cookies for access/refresh tokens; do not set cookies manually here.
      // We still keep any tokens returned in the response body in case we want to use them client-side later.
      // Access/refresh tokens are set as HttpOnly cookies by backend; values in body are optional

      // Optionally store profile info (from login response)
      const user = data?.data?.user || data?.user;
      if (user) {
        try { localStorage.setItem(`${role}Profile`, JSON.stringify(user)); } catch {}
      }

      // Fetch /user/me to verify role and get full profile
      try {
        const { getJSON } = await import('../utils/api');
        const me = await getJSON('/user/me');
        // Log full /user/me response after login
        // eslint-disable-next-line no-console
        console.log('[auth] /user/me response:', me);
        const meUser = me?.data?.user || me?.user;
        const meProfile = me?.data?.profile;

        // store profile if available
        if (meUser) {
          try { localStorage.setItem('currentUser', JSON.stringify(meUser)); } catch {}
        }
        if (meProfile) {
          try { localStorage.setItem('currentProfile', JSON.stringify(meProfile)); } catch {}
        }

        // Role enforcement: if attempting teacher login, ensure backend user role is teacher
        if (role === 'teacher') {
          if (meUser?.role === 'teacher') {
            navigate('/teacher-dashboard');
            return;
          }
          // show toast error and do not navigate
          toast.error('No teacher is registered with this email/username');
          return;
        }

        // For student role, allow student dashboard
        if (role === 'student') {
          if (meUser?.role === 'student') {
            navigate('/student-dashboard');
            return;
          }
          // If role mismatch, show error
          toast.error('No student is registered with this email/username');
          return;
        }
      } catch (errMe: any) {
        // If fetching /user/me fails, fall back to dashboard navigation
        navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
        return;
      }
    } catch (err: any) {
      const msg = String(err?.message || err || 'Login failed');
      // Server may return 401 or other messages; show as error
      setLoginError(msg.includes('401') ? 'Invalid credentials.' : msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const Landing = () => (
    <div className="bg-dark-primary">
      <Navbar onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/signup')} onLogoClick={() => navigate('/')} />
      <Hero
        onExploreStudent={() => navigate('/student-explore')}
        onExploreTeacher={() => navigate('/teacher-explore')}
        onGetStarted={() => navigate('/signup')}
        onExplore={() => {
          const el = document.getElementById('resources');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />
      <About />
      <Services />
  <Resources onNavigate={(page) => navigate(`/${page}`)} />
      <Features />
      <Footer onNavigate={(page) => navigate(`/${page}`)} />
    </div>
  );

  const WithShell = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-dark-primary">
      <Navbar onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/signup')} onLogoClick={() => navigate('/')} />
      {children}
      <Footer onNavigate={(page) => navigate(`/${page}`)} />
    </div>
  );

  // Note: RequireAuth temporarily removed while debugging; dashboards rendered openly below.

  return (
    <AuthProvider>
      <ToastContainer />
      <ErrorBoundary>
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage onBack={() => navigate('/')} onSignupTeacher={() => navigate('/signup-teacher')} onSignupStudent={() => navigate('/signup-student')} onChooseRole={(role) => navigate(role === 'teacher' ? '/login/teacher' : '/login/student')} />} />
      <Route path="/login/teacher" element={<LoginTeacherPage onBack={() => navigate('/login')} onLogin={(username: string, password: string) => handleLogin('teacher', username, password)} onSignup={() => navigate('/signup-teacher')} loading={loginLoading} error={loginError} onForgot={() => navigate('/forgot/teacher')} />} />
      <Route path="/login/student" element={<LoginStudentPage onBack={() => navigate('/login')} onLogin={(username: string, password: string) => handleLogin('student', username, password)} onSignup={() => navigate('/signup-student')} loading={loginLoading} error={loginError} onForgot={() => navigate('/forgot/student')} />} />

      <Route path="/forgot/teacher" element={<ForgotPasswordPage role="teacher" onBack={() => navigate('/login/teacher')} />} />
      <Route path="/forgot/student" element={<ForgotPasswordPage role="student" onBack={() => navigate('/login/student')} />} />

      <Route path="/signup" element={<SignupPage onBack={() => navigate('/')} onLogin={() => navigate('/login')} />} />
      <Route path="/signup-teacher" element={<SignupPage initialView="teacher" onBack={() => navigate('/')} onLogin={() => navigate('/login')} />} />
      <Route path="/signup-student" element={<SignupPage initialView="student" onBack={() => navigate('/')} onLogin={() => navigate('/login')} />} />

      <Route path="/student-explore" element={<StudentExplore onBack={() => navigate('/')} onGetStarted={() => navigate('/signup-student')} />} />
      <Route path="/teacher-explore" element={<TeacherExplore onBack={() => navigate('/')} onGetStarted={() => navigate('/signup-teacher')} />} />

      <Route path="/help" element={<WithShell><HelpCenter onNavigate={(page) => navigate(`/${page}`)} /></WithShell>} />
      <Route path="/contact" element={<WithShell><Contact /></WithShell>} />
      <Route path="/faq" element={<WithShell><FAQ /></WithShell>} />
      <Route path="/community" element={<WithShell><Community /></WithShell>} />
      <Route path="/privacy" element={<WithShell><Privacy /></WithShell>} />
      <Route path="/terms" element={<WithShell><Terms /></WithShell>} />
      <Route path="/security" element={<WithShell><Security /></WithShell>} />

      {/* Temporarily render dashboards without RequireAuth to debug blank screen */}
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard onLogout={() => navigate('/')} />} />
      </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
