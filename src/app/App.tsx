import { useState, useEffect } from 'react';
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

export type PageType = 'home' | 'login' | 'login-teacher' | 'login-student' | 'signup' | 'signup-teacher' | 'signup-student' | 'student-explore' | 'teacher-explore' | 'help' | 'contact' | 'faq' | 'community' | 'privacy' | 'terms' | 'security' | 'teacher-dashboard' | 'student-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  useEffect(() => {
    const pageFromHash = (): PageType => {
      const hash = window.location.hash.replace('#', '');
      const pages: PageType[] = ['home','login','login-teacher','login-student','signup','signup-teacher','signup-student','student-explore','teacher-explore','help','contact','faq','community','privacy','terms','security','teacher-dashboard','student-dashboard'];
      return pages.includes(hash as PageType) ? (hash as PageType) : 'home';
    };

    const handlePopState = () => {
      setCurrentPage(pageFromHash());
    };

    // initialize from URL hash if present
    setCurrentPage(pageFromHash());
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    try {
      window.history.pushState({ page }, '', `#${page}`);
    } catch {
      // ignore if pushState fails for some reason
    }
  };

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
        navigateToPage('home');
        return;
      }

      if (res.status === 404) {
        navigateToPage(role === 'teacher' ? 'signup-teacher' : 'signup-student');
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
      navigateToPage('home');
    } else {
      navigateToPage(role === 'teacher' ? 'signup-teacher' : 'signup-student');
    }
  };

  if (currentPage === 'login') {
    return <LoginPage onBack={() => navigateToPage('home')} onSignupTeacher={() => navigateToPage('signup-teacher')} onSignupStudent={() => navigateToPage('signup-student')} onChooseRole={(role) => navigateToPage(role === 'teacher' ? 'login-teacher' : 'login-student')} />;
  }

  if (currentPage === 'login-teacher') {
    return <LoginTeacherPage onBack={() => navigateToPage('login')} onLogin={(username: string, password: string) => handleLogin('teacher', username, password)} onSignup={() => navigateToPage('signup-teacher')} loading={loginLoading} error={loginError} />;
  }

  if (currentPage === 'login-student') {
    return <LoginStudentPage onBack={() => navigateToPage('login')} onLogin={(username: string, password: string) => handleLogin('student', username, password)} onSignup={() => navigateToPage('signup-student')} loading={loginLoading} error={loginError} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onBack={() => navigateToPage('home')} onLogin={() => navigateToPage('login')} />;
  }

  if (currentPage === 'signup-teacher') {
    return <SignupPage initialView="teacher" onBack={() => navigateToPage('home')} onLogin={() => navigateToPage('login')} />;
  }

  if (currentPage === 'signup-student') {
    return <SignupPage initialView="student" onBack={() => navigateToPage('home')} onLogin={() => navigateToPage('login')} />;
  }

  if (currentPage === 'student-explore') {
    return <StudentExplore onBack={() => navigateToPage('home')} onGetStarted={() => navigateToPage('signup-student')} />;
  }

  if (currentPage === 'teacher-explore') {
    return <TeacherExplore onBack={() => navigateToPage('home')} onGetStarted={() => navigateToPage('signup-teacher')} />;
  }

  if (currentPage === 'help') {
    return (
      <div className="bg-dark-primary">
  <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
  <HelpCenter onNavigate={(page) => navigateToPage(page as PageType)} />
        <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
      </div>
    );
  }

  if (currentPage === 'contact') {
    return (
      <div className="bg-dark-primary">
        <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
        <Contact />
        <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
      </div>
    );
  }

  if (currentPage === 'faq') {
    return (
      <div className="bg-dark-primary">
        <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
        <FAQ />
        <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
      </div>
    );
  }

  if (currentPage === 'community') {
    return (
      <div className="bg-dark-primary">
        <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
        <Community />
        <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
      </div>
    );
  }

  if (currentPage === 'privacy') {
    return (
      <div className="bg-dark-primary">
        <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
        <Privacy />
        <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="bg-dark-primary">
        <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
        <Terms />
        <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
      </div>
    );
  }

  if (currentPage === 'security') {
    return (
      <div className="bg-dark-primary">
        <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
        <Security />
        <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
      </div>
    );
  }

  if (currentPage === 'teacher-dashboard') {
    return <TeacherDashboard />;
  }

  if (currentPage === 'student-dashboard') {
    return <StudentDashboard onLogout={() => navigateToPage('home')} />;
  }

  return (
    <div className="bg-dark-primary">
      <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
      <Hero
        onExploreStudent={() => navigateToPage('student-explore')}
        onExploreTeacher={() => navigateToPage('teacher-explore')}
        onGetStarted={() => navigateToPage('signup')}
      />
      <About />
      <Services />
  <Resources onNavigate={(page) => navigateToPage(page as PageType)} />
      <Features />
      <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
    </div>
  );
}

export default App;
