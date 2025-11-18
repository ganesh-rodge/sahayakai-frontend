import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { postJSON, getJSON } from '../utils/api';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/StudentDashboard/DashboardLayout';
import DashboardHome from '../components/StudentDashboard/DashboardHome';
import LessonsPage from '../components/StudentDashboard/LessonsPage';
import RoadmapPage from '../components/StudentDashboard/RoadmapPage';
import ProfilePage from '../components/StudentDashboard/ProfilePage';
import OnboardingFlow from '../components/StudentDashboard/OnboardingFlow';
import { useAuth } from '../utils/auth';

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
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const [userData, setUserData] = useState({
    userName: 'Student',
    userEmail: '',
    learningGoal: '',
    profilePicture: 'https://avatar.iran.liara.run/public/boy',
    weeksNeeded: 0,
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

  // Note: legacy local roadmap generators removed (now using server-generated roadmap)

  const handleOnboardingComplete = async (data: { learningGoal: string; experience: string[]; timeCommitment: string; skillLevel: string; preferredTopics: string[]; weeksNeeded?: number }) => {
    console.log('Onboarding flow - incoming data:', data);
    // Prepare payload as required by backend
    const payload = {
      field: (data as any).field || data.learningGoal || 'General',
      goal: data.learningGoal,
      knownLanguages: Array.isArray(data.experience) ? data.experience.join(',') : String(data.experience || ''),
      skillLevel: data.skillLevel,
      interestAreas: Array.isArray(data.preferredTopics) ? data.preferredTopics.join(',') : String(data.preferredTopics || ''),
      timeCommitment: String(data.timeCommitment || ''),
      weekCommitment: String(typeof data.weeksNeeded !== 'undefined' ? data.weeksNeeded : '')
    };

    console.log('Onboarding payload to send:', payload);

    try {
      // Save onboarding to backend
      const saved = await postJSON('/onboarding/', payload);
      console.log('Saved onboarding response:', saved);

      // optional: get onboarding (not strictly needed because server reads it), but keep for validation
      let onboardingResp = null;
      try {
        onboardingResp = await getJSON('/onboarding/me');
        console.log('Fetched onboarding/me:', onboardingResp);
      } catch (e) {
        // ignore - proceed to generate roadmap
        console.warn('Could not fetch onboarding/me (continuing):', e);
      }

      // Request roadmap generation (server will read onboarding from DB)
      console.log('Requesting roadmap generation from server...');
      setIsGeneratingRoadmap(true);
      const gen = await postJSON('/roadmap/generate', {});
      console.log('Roadmap generation raw response:', gen);

      // Expected response: { data: { roadmap: { totalWeeks, weeks: [...] } } }
      const roadmap = gen?.data?.roadmap || gen?.roadmap || null;
      console.log('Normalized roadmap object found:', roadmap);
      if (!roadmap) {
        toast.error('Roadmap generation returned empty result');
        return;
      }

      // Map server roadmap into local weeksData shape expected by UI
      const mappedWeeks: any[] = (roadmap.weeks || []).map((w: any) => {
        const chapters = Array.isArray(w.chapters) ? w.chapters : (w.chapters || []);
        const lessons: Lesson[] = (chapters || []).map((c: any, idx: number): Lesson => ({
          id: `w${w.weekNumber}l${idx + 1}`,
          title: c.title || String(c || ''),
          description: c.description || '',
          duration: c.estimatedMinutes ? `${Math.round((c.estimatedMinutes || 0) / 60)} hrs` : '',
          completed: !!c.isDone
        }));
        const lessonsCompleted = lessons.filter((l: Lesson) => l.completed).length;
        const totalLessons = lessons.length;
        const progress = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
        return {
          weekNumber: Number(w.weekNumber || w.week || (w.weekNumber)),
          title: w.title || `Week ${w.weekNumber}`,
          lessons: lessons,
          lessonsCompleted,
          totalLessons,
          progress,
        };
      });

      console.log('Mapped weeks (frontend format):', mappedWeeks);

      setWeeksData(mappedWeeks);
      try { if (mappedWeeks.length > 0) localStorage.setItem('studentRoadmap', JSON.stringify(mappedWeeks)); } catch {}

      // update userData with learningGoal and weeksNeeded
      setUserData(prev => ({ ...prev, learningGoal: data.learningGoal, weeksNeeded: data.weeksNeeded || 0 }));
      setShowOnboarding(false);
      navigate('/student/roadmap');
    } catch (err: any) {
      console.error('Error in onboarding => generate flow:', err);
      const msg = String(err?.message || err || 'Failed to save onboarding or generate roadmap');
      toast.error(msg);
    } finally {
      setIsGeneratingRoadmap(false);
    }
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

  const handleSaveProfile = (data: { userName: string; userEmail: string; profilePicture?: string }) => {
    // Preserve weeksNeeded while updating user meta
    setUserData(prev => ({
      ...prev,
      userName: data.userName,
      userEmail: data.userEmail,
      profilePicture: data.profilePicture || prev.profilePicture,
    }));
  };

  // Wrapper that maps auth `user` + `profile` into the existing ProfilePage props
  function ProfileWithAuth({
    onSaveProfile,
  }: {
    weeksData: Week[];
    onSaveProfile: (data: { userName: string; userEmail: string; profilePicture?: string }) => void;
  }) {
    const auth = useAuth();

    // Try to refresh me if we don't have user yet
    useEffect(() => {
      if (!auth.user && !auth.loading) {
        auth.refresh().catch(() => {});
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const meUser = auth.user || null;
    const meProfile = auth.profile || null;

    const userName = meProfile?.firstName || meUser?.username || meUser?.email || 'Student';
    const userEmail = meUser?.email || meProfile?.email || '';
    const role = meUser?.role || meProfile?.role || '';
    const qualification = meProfile?.qualification || meProfile?.highestQualification || '';
    const profilePicture = meProfile?.livePhoto || meProfile?.photo || userData.profilePicture || 'https://avatar.iran.liara.run/public/boy';

    // const totalWeeks = weeksData.length;
    // const totalLessons = weeksData.reduce((s, w) => s + w.totalLessons, 0);
    // const lessonsCompleted = weeksData.reduce((s, w) => s + w.lessonsCompleted, 0);
    // const studyTimeHours = 0;

    const handleSave = (data: { userName: string; userEmail: string; profilePicture?: string }) => {
      // update local state for immediate feedback
      onSaveProfile(data);
      // (Optional) persist to backend later
    };

    return (
      <ProfilePage
        userName={userName}
        userEmail={userEmail}
        role={role}
        qualification={qualification}
        profilePicture={profilePicture}
        onSaveProfile={handleSave}
      />
    );
  }

  // derive current page from location
  const path = location.pathname.replace(/^\/student\/?/, '') || 'dashboard';

  const content = showOnboarding ? (
    <OnboardingFlow onComplete={handleOnboardingComplete} onBack={() => setShowOnboarding(false)} />
  ) : (
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
        <Route path="profile" element={<ProfileWithAuth weeksData={weeksData} onSaveProfile={handleSaveProfile} />} />

        {/* Optional routes */}
        <Route path="settings" element={<div className="p-6 text-white">Settings coming soon</div>} />
        <Route path="notifications" element={<div className="p-6 text-white">Notifications coming soon</div>} />
        <Route path="help" element={<div className="p-6 text-white">Help & Support</div>} />
      </Route>
    </Routes>
  );

  return (
    <>
      {isGeneratingRoadmap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="rounded-xl border border-accent/30 bg-dark-secondary/95 p-6 w-[90%] max-w-sm text-center shadow-xl">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-1">Generating your roadmap…</h3>
            <p className="text-sm text-gray-400">This can take 10–20 seconds. Please wait.</p>
          </div>
        </div>
      )}
      {content}
    </>
  );
}
