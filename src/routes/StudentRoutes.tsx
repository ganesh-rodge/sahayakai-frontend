import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/StudentDashboard/DashboardLayout';
import DashboardHome from '../components/StudentDashboard/DashboardHome';
import LessonsPage from '../components/StudentDashboard/LessonsPage';
import RoadmapPage from '../components/StudentDashboard/RoadmapPage';
import ProfilePage from '../components/StudentDashboard/ProfilePage';
import OnboardingFlow from '../components/StudentDashboard/OnboardingFlow';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

interface Week {
  weekNumber: number;
  title: string;
  lessonsCompleted: number;
  totalLessons: number;
  progress: number;
  lessons: Lesson[];
}

export default function StudentRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showOnboarding, setShowOnboarding] = useState(false);

  const [userData, setUserData] = useState({
    userName: 'Student',
    userEmail: '',
    learningGoal: '',
    profilePicture: 'https://avatar.iran.liara.run/public/boy',
  });

  const [weeksData, setWeeksData] = useState<Week[]>([]);

  useEffect(() => {
    const savedRoadmap = localStorage.getItem('studentRoadmap');
    const savedUser = localStorage.getItem('studentUser');
    if (savedRoadmap) setWeeksData(JSON.parse(savedRoadmap));
    if (savedUser) setUserData(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (weeksData.length > 0) localStorage.setItem('studentRoadmap', JSON.stringify(weeksData));
  }, [weeksData]);

  useEffect(() => {
    if (userData.learningGoal) localStorage.setItem('studentUser', JSON.stringify(userData));
  }, [userData]);

  // Helper: create lessons for a week topic
  const createLessonsForWeek = (
    topic: string,
    level: 'beginner' | 'intermediate' | 'advanced',
    pace: 'low' | 'medium' | 'high'
  ): Lesson[] => {
    const baseHours = pace === 'high' ? 6 : pace === 'medium' ? 4 : 3;
    const dur = (h: number) => `${h} hours`;
    const lessons: Lesson[] = [
      { id: 'intro', title: `${topic}: Overview`, description: `Core ideas and why ${topic} matters`, duration: dur(Math.max(2, baseHours - 1)), completed: false },
      { id: 'concepts', title: `${topic}: Key Concepts`, description: `Fundamentals and terminology`, duration: dur(baseHours), completed: false },
      { id: 'hands-on', title: `${topic}: Hands-on`, description: `Guided coding/practice for ${topic}`, duration: dur(baseHours + 1), completed: false },
      { id: 'project', title: `${topic}: Mini Project`, description: `Small build applying ${topic}`, duration: dur(baseHours + (level === 'beginner' ? 1 : 2)), completed: false },
      { id: 'assessment', title: `${topic}: Quiz/Assessment`, description: `Check understanding of ${topic}`, duration: dur(2), completed: false },
      { id: 'review', title: `${topic}: Review & Notes`, description: `Summarize learnings and plan next week`, duration: dur(1), completed: false },
    ];
    // Beginners get one extra guided reading instead of assessment sometimes
    if (level === 'beginner') {
      lessons.splice(1, 0, { id: 'reading', title: `${topic}: Guided Reading`, description: `Curated articles/videos`, duration: dur(2), completed: false });
    }
    // ensure unique IDs per topic later
    return lessons;
  };

  // Build a weekly topic syllabus from goal and preferences
  const buildSyllabus = (
    learningGoal: string,
    preferredTopics: string[],
    experience: string[]
  ): string[] => {
    const g = learningGoal.toLowerCase();
    const none = experience.includes('None');
    let core: string[] = [];
    if (g.includes('web') || g.includes('frontend')) {
      core = [
        none ? 'Programming Fundamentals' : 'HTML & CSS Refresh',
        'Responsive Layouts & Flex/Grid',
        'JavaScript Basics',
        'Modern JS (ES6+)',
        'TypeScript Basics',
        'React Fundamentals',
        'React State & Effects',
        'Routing & Architecture',
        'API Integration',
        'Styling Systems (Tailwind)',
        'Project: Mini App',
        'Testing & Deployment',
      ];
    } else if (g.includes('data') || g.includes('ml') || g.includes('ai')) {
      core = [
        none ? 'Python Basics' : 'Python Refresh',
        'NumPy & Data Wrangling',
        'Pandas for Analysis',
        'Data Visualization',
        'Statistics Essentials',
        'ML Fundamentals',
        'Model Training & Eval',
        'Feature Engineering',
        'Supervised Learning',
        'Unsupervised Learning',
        'Project: End-to-End',
        'MLOps & Deployment',
      ];
    } else {
      core = [
        none ? 'Programming Fundamentals' : 'Language Basics',
        'Problem Solving',
        'Data Structures I',
        'Data Structures II',
        'Algorithms Basics',
        'Version Control & Git',
        'APIs & Networking',
        'Project: CLI/App',
        'Testing Basics',
        'Debugging & Tooling',
        'Project Polish',
        'Review & Next Steps',
      ];
    }

    // Place preferred topics earlier if provided
    const prioritized = [
      ...preferredTopics.filter((t) => core.some(c => c.toLowerCase().includes(t.toLowerCase()))),
      ...core.filter((c) => !preferredTopics.some(t => c.toLowerCase().includes(t.toLowerCase()))),
    ];
    // Deduplicate while preserving order
    return Array.from(new Set(prioritized));
  };

  const generateRoadmap = (params: {
    learningGoal: string;
    experience: string[];
    timeCommitment: string; // '<10' | '10-20' | '20+'
    skillLevel: string; // 'Beginner' | 'Intermediate' | 'Advanced'
    preferredTopics: string[];
  }): Week[] => {
    const { learningGoal, experience, timeCommitment, skillLevel, preferredTopics } = params;
    const level = skillLevel.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
    const pace: 'low' | 'medium' | 'high' = timeCommitment === '20+' ? 'high' : timeCommitment === '10-20' ? 'medium' : 'low';
    const weeksCount = timeCommitment === '20+' ? 8 : timeCommitment === '10-20' ? 12 : 16;

    const syllabus = buildSyllabus(learningGoal, preferredTopics, experience).slice(0, 16);
    const totalWeeks = Math.min(weeksCount, syllabus.length);

    const weeks: Week[] = Array.from({ length: totalWeeks }).map((_, i) => {
      const topic = syllabus[i];
      const baseLessons = createLessonsForWeek(topic, level, pace).map((lsn, idx) => ({
        ...lsn,
        id: `w${i + 1}l${idx + 1}`,
      }));
      const totalLessons = Math.min(level === 'beginner' ? 6 : 5, baseLessons.length);
      const lessons = baseLessons.slice(0, totalLessons);
      return {
        weekNumber: i + 1,
        title: `Week ${i + 1}: ${topic}`,
        lessonsCompleted: 0,
        totalLessons,
        progress: 0,
        lessons,
      };
    });

    return weeks;
  };

  const handleOnboardingComplete = (data: { learningGoal: string; experience: string[]; timeCommitment: string; skillLevel: string; preferredTopics: string[] }) => {
    const newRoadmap = generateRoadmap({
      learningGoal: data.learningGoal,
      experience: data.experience,
      timeCommitment: data.timeCommitment,
      skillLevel: data.skillLevel,
      preferredTopics: data.preferredTopics,
    });
    setWeeksData(newRoadmap);
    setUserData(prev => ({ ...prev, learningGoal: data.learningGoal }));
    setShowOnboarding(false);
    navigate('/student/roadmap');
  };

  const handleCreateRoadmap = () => setShowOnboarding(true);

  const handleDeleteRoadmap = () => {
    if (window.confirm('Are you sure you want to delete your roadmap?')) {
      setWeeksData([]);
      localStorage.removeItem('studentRoadmap');
      setUserData(prev => ({ ...prev, learningGoal: '' }));
    }
  };

  const handleStartLesson = (lessonId: string) => {
    setWeeksData(prevWeeks => prevWeeks.map(week => {
      const newLessons = week.lessons.map(lesson => lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson);
      const lessonsCompleted = newLessons.filter(l => l.completed).length;
      const progress = week.totalLessons > 0 ? Math.round((lessonsCompleted / week.totalLessons) * 100) : 0;
      return { ...week, lessons: newLessons, lessonsCompleted, progress };
    }));
  };

  const handleSaveProfile = (data: { userName: string; userEmail: string; learningGoal: string; profilePicture?: string }) => {
    setUserData({ ...data, profilePicture: data.profilePicture || userData.profilePicture });
  };

  // derive current page from location
  const path = location.pathname.replace(/^\/student\/?/, '') || 'dashboard';

  if (showOnboarding) return <OnboardingFlow onComplete={handleOnboardingComplete} onBack={() => setShowOnboarding(false)} />;

  return (
    <Routes>
      <Route path="/" element={
        <DashboardLayout
          currentPage={path as any}
          onLogout={() => navigate('/')}
          userName={userData.userName}
          userEmail={userData.userEmail}
          profilePicture={userData.profilePicture}
        />
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={(
          <DashboardHome
            userName={userData.userName}
            learningGoal={userData.learningGoal}
            totalWeeks={weeksData.length}
            totalLessons={weeksData.reduce((s,w) => s + w.totalLessons, 0)}
            lessonsCompleted={weeksData.reduce((s,w) => s + w.lessonsCompleted, 0)}
            overallProgress={0}
            studyTimeHours={0}
            testAccuracy={85}
            currentWeekNumber={weeksData[0]?.weekNumber || 0}
            weekData={weeksData[0]}
            onStartLesson={handleStartLesson}
            hasRoadmap={weeksData.length > 0}
            onCreateRoadmap={handleCreateRoadmap}
          />
        )} />
        <Route path="lessons" element={<LessonsPage weeks={weeksData} onStartLesson={handleStartLesson} hasRoadmap={weeksData.length>0} onCreateRoadmap={handleCreateRoadmap} />} />
        <Route path="roadmap" element={<RoadmapPage learningGoal={userData.learningGoal} weeks={weeksData} onStartLesson={handleStartLesson} onCreateRoadmap={handleCreateRoadmap} onDeleteRoadmap={handleDeleteRoadmap} hasRoadmap={weeksData.length>0} />} />
        <Route path="profile" element={<ProfilePage userName={userData.userName} userEmail={userData.userEmail} learningGoal={userData.learningGoal} profilePicture={userData.profilePicture} totalWeeks={weeksData.length} totalLessons={weeksData.reduce((s,w)=>s+w.totalLessons,0)} lessonsCompleted={weeksData.reduce((s,w)=>s+w.lessonsCompleted,0)} studyTimeHours={0} onSaveProfile={handleSaveProfile} />} />

        {/* Optional routes */}
        <Route path="settings" element={<div className="p-6 text-white">Settings coming soon</div>} />
        <Route path="notifications" element={<div className="p-6 text-white">Notifications coming soon</div>} />
        <Route path="help" element={<div className="p-6 text-white">Help & Support</div>} />
      </Route>
    </Routes>
  );
}
