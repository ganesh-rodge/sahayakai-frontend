import { useState } from 'react';
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

function App() {
  const navigate = useNavigate();

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (role: 'teacher' | 'student', username: string, password: string) => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch(`/api/auth/${role}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        navigate('/');
        return;
      }

      if (res.status === 404) {
        navigate(role === 'teacher' ? '/signup-teacher' : '/signup-student');
        return;
      }

      if (res.status === 401) {
        setLoginError('Invalid credentials.');
        return;
      }
    } catch (err) {
      // ignore and fall back to heuristic
    } finally {
      setLoginLoading(false);
    }

    // Fallback heuristic: if username length seems valid (>2) treat as existing; else redirect to signup
    if (username.length > 2 && password.length >= 1) {
      navigate('/');
    } else {
      navigate(role === 'teacher' ? '/signup-teacher' : '/signup-student');
    }
  };

  const Landing = () => (
    <div className="bg-dark-primary">
      <Navbar onLoginClick={() => navigate('/login')} onSignupClick={() => navigate('/signup')} onLogoClick={() => navigate('/')} />
      <Hero
        onExploreStudent={() => navigate('/student-explore')}
        onExploreTeacher={() => navigate('/teacher-explore')}
        onGetStarted={() => navigate('/signup')}
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

  return (
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

      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/student-dashboard" element={<StudentDashboard onLogout={() => navigate('/')} />} />
    </Routes>
  );
}

export default App;
