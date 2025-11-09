import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Resources from './components/Resources';
import Features from './components/Features';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import LoginTeacherPage from './pages/LoginTeacherPage';
import LoginStudentPage from './pages/LoginStudentPage';
import SignupPage from './components/SignupPage';
import StudentExplore from './pages/StudentExplore';
import TeacherExplore from './pages/TeacherExplore';
import HelpCenter from './pages/support/HelpCenter';
import Contact from './pages/support/Contact';
import FAQ from './pages/support/FAQ';
import Community from './pages/support/Community';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Security from './pages/legal/Security';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

type PageType = 'home' | 'login' | 'login-teacher' | 'login-student' | 'signup' | 'student-explore' | 'teacher-explore' | 'help' | 'contact' | 'faq' | 'community' | 'privacy' | 'terms' | 'security' | 'teacher-dashboard' | 'student-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage('home');
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    window.history.pushState(null, '', window.location.href);
  };

  if (currentPage === 'login') {
    return <LoginPage onBack={() => navigateToPage('home')} onSignup={() => navigateToPage('signup')} onChooseRole={(role) => navigateToPage(role === 'teacher' ? 'login-teacher' : 'login-student')} />;
  }

  if (currentPage === 'login-teacher') {
    return <LoginTeacherPage onBack={() => navigateToPage('login')} onLogin={() => navigateToPage('home')} />;
  }

  if (currentPage === 'login-student') {
    return <LoginStudentPage onBack={() => navigateToPage('login')} onLogin={() => navigateToPage('home')} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onBack={() => navigateToPage('home')} onLogin={() => navigateToPage('login')} />;
  }

  if (currentPage === 'student-explore') {
    return <StudentExplore onBack={() => navigateToPage('home')} onGetStarted={() => navigateToPage('signup')} />;
  }

  if (currentPage === 'teacher-explore') {
    return <TeacherExplore onBack={() => navigateToPage('home')} onGetStarted={() => navigateToPage('signup')} />;
  }

  if (currentPage === 'help') {
    return (
      <div className="bg-dark-primary">
        <Navbar onLoginClick={() => navigateToPage('login')} onSignupClick={() => navigateToPage('signup')} onLogoClick={() => navigateToPage('home')} />
        <HelpCenter />
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
    return <TeacherDashboard onBack={() => navigateToPage('home')} />;
  }

  if (currentPage === 'student-dashboard') {
    return <StudentDashboard onBack={() => navigateToPage('home')} />;
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
      <Resources />
      <Features />
      <Footer onNavigate={(page) => navigateToPage(page as PageType)} />
    </div>
  );
}

export default App;
