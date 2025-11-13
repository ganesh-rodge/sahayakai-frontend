import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import LessonsPage from './LessonsPage';
import RoadmapPage from './RoadmapPage';
import ProfilePage from './ProfilePage';
import OnboardingFlow from './OnboardingFlow';

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

interface StudentDashboardProps {
  onLogout: () => void;
}

// Helper function to generate roadmap based on onboarding data
const generateRoadmap = (learningGoal: string, experience: string[], timeCommitment: string): Week[] => {
  // Base roadmap structure - can be customized based on inputs
  const hasNoExperience = experience.includes('None');
  const weeksCount = timeCommitment === '20+' ? 8 : timeCommitment === '10-20' ? 12 : 16;
  
  // Customize roadmap title based on learning goal
  const goalKeywords = learningGoal.toLowerCase();
  const isWebDev = goalKeywords.includes('web') || goalKeywords.includes('frontend') || goalKeywords.includes('full stack');
  const isMobile = goalKeywords.includes('mobile') || goalKeywords.includes('android') || goalKeywords.includes('ios');
  const isDataScience = goalKeywords.includes('data') || goalKeywords.includes('ml') || goalKeywords.includes('ai');
  
  // Sample roadmap generation (customized based on learningGoal and experience)
  const roadmap: Week[] = [
    {
      weekNumber: 1,
      title: hasNoExperience 
        ? 'Week 1: Programming Fundamentals' 
        : isWebDev 
          ? 'Week 1: Web Development Essentials'
          : isMobile
            ? 'Week 1: Mobile Development Basics'
            : isDataScience
              ? 'Week 1: Data Science Foundations'
              : 'Week 1: Advanced Programming Concepts',
      lessonsCompleted: 0,
      totalLessons: 5,
      progress: 0,
      lessons: [
        {
          id: 'w1l1',
          title: hasNoExperience ? 'Introduction to Programming' : 'Advanced Data Structures',
          description: hasNoExperience 
            ? 'Learn the basics of programming, variables, and data types'
            : 'Deep dive into trees, graphs, and advanced algorithms',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w1l2',
          title: hasNoExperience ? 'Variables and Data Types' : 'Design Patterns',
          description: hasNoExperience 
            ? 'Understanding how to store and manipulate data'
            : 'Learn common software design patterns',
          duration: '3 hours',
          completed: false,
        },
        {
          id: 'w1l3',
          title: 'Control Flow',
          description: 'Master if statements, loops, and conditional logic',
          duration: '3 hours',
          completed: false,
        },
        {
          id: 'w1l4',
          title: 'Functions and Methods',
          description: 'Learn to write reusable code with functions',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w1l5',
          title: 'Practice Project',
          description: 'Build your first small project',
          duration: '6 hours',
          completed: false,
        },
      ],
    },
    {
      weekNumber: 2,
      title: 'Week 2: Object-Oriented Programming',
      lessonsCompleted: 0,
      totalLessons: 5,
      progress: 0,
      lessons: [
        {
          id: 'w2l1',
          title: 'Classes and Objects',
          description: 'Introduction to object-oriented programming concepts',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w2l2',
          title: 'Inheritance and Polymorphism',
          description: 'Learn about code reusability and flexibility',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w2l3',
          title: 'Encapsulation',
          description: 'Understanding data hiding and access modifiers',
          duration: '3 hours',
          completed: false,
        },
        {
          id: 'w2l4',
          title: 'Abstraction',
          description: 'Learn to work with abstract classes and interfaces',
          duration: '3 hours',
          completed: false,
        },
        {
          id: 'w2l5',
          title: 'OOP Project',
          description: 'Build a project using OOP principles',
          duration: '6 hours',
          completed: false,
        },
      ],
    },
    {
      weekNumber: 3,
      title: 'Week 3: Web Development Basics',
      lessonsCompleted: 0,
      totalLessons: 4,
      progress: 0,
      lessons: [
        {
          id: 'w3l1',
          title: 'HTML Fundamentals',
          description: 'Learn the structure of web pages',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w3l2',
          title: 'CSS Styling',
          description: 'Make your web pages beautiful',
          duration: '5 hours',
          completed: false,
        },
        {
          id: 'w3l3',
          title: 'JavaScript Basics',
          description: 'Add interactivity to web pages',
          duration: '5 hours',
          completed: false,
        },
        {
          id: 'w3l4',
          title: 'Build Your First Website',
          description: 'Create a complete responsive website',
          duration: '6 hours',
          completed: false,
        },
      ],
    },
  ];

  return roadmap.slice(0, Math.min(weeksCount, 12)); // Limit to reasonable number
};

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'lessons' | 'roadmap' | 'profile'>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const [userData, setUserData] = useState({
    userName: 'Student',
    userEmail: '',
    learningGoal: '',
    profilePicture: 'https://avatar.iran.liara.run/public/boy',
    weeksNeeded: 0,
  });

  const [weeksData, setWeeksData] = useState<Week[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRoadmap = localStorage.getItem('studentRoadmap');
    const savedUser = localStorage.getItem('studentUser');
    
    if (savedRoadmap) {
      setWeeksData(JSON.parse(savedRoadmap));
    }
    
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (weeksData.length > 0) {
      localStorage.setItem('studentRoadmap', JSON.stringify(weeksData));
    }
  }, [weeksData]);

  useEffect(() => {
    if (userData.learningGoal) {
      localStorage.setItem('studentUser', JSON.stringify(userData));
    }
  }, [userData]);

  const hasRoadmap = weeksData.length > 0;

  const handleOnboardingComplete = (data: { 
    field?: string;
    learningGoal: string; 
    experience: string[]; 
    timeCommitment: string;
    skillLevel: string;
    preferredTopics: string[];
    weeksNeeded?: number;
  }) => {
    // Generate roadmap based on onboarding data
    const newRoadmap = generateRoadmap(data.learningGoal, data.experience, data.timeCommitment);
    setWeeksData(newRoadmap);
    
    // Update user data
    setUserData(prev => ({
      ...prev,
      learningGoal: data.learningGoal,
      weeksNeeded: data.weeksNeeded || prev['weeksNeeded'] || 0,
    }));
    
    setShowOnboarding(false);
  };

  const handleCreateRoadmap = () => {
    setShowOnboarding(true);
  };

  const handleDeleteRoadmap = () => {
    if (window.confirm('Are you sure you want to delete your roadmap? This action cannot be undone.')) {
      setWeeksData([]);
      localStorage.removeItem('studentRoadmap');
      setUserData(prev => ({ ...prev, learningGoal: '' }));
    }
  };

  const handleStartLesson = (lessonId: string) => {
    setWeeksData(prevWeeks =>
      prevWeeks.map(week => ({
        ...week,
        lessons: week.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            const newCompleted = !lesson.completed;
            return { ...lesson, completed: newCompleted };
          }
          return lesson;
        }),
        lessonsCompleted: week.lessons.filter(l => 
          l.id === lessonId ? !l.completed : l.completed
        ).length,
        progress: Math.round(
          (week.lessons.filter(l => 
            l.id === lessonId ? !l.completed : l.completed
          ).length / week.totalLessons) * 100
        ),
      }))
    );
  };

  const handleSaveProfile = (data: {
    userName: string;
    userEmail: string;
    learningGoal: string;
    profilePicture?: string;
  }) => {
    setUserData(prev => ({
      ...data,
      profilePicture: data.profilePicture || 'https://avatar.iran.liara.run/public/boy',
      weeksNeeded: (prev as any).weeksNeeded || 0,
    }));
  };

  // Calculate stats
  const totalLessons = weeksData.reduce((sum, week) => sum + week.totalLessons, 0);
  const lessonsCompleted = weeksData.reduce((sum, week) => sum + week.lessonsCompleted, 0);
  const overallProgress = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
  
  // Calculate study time (estimate: completed lessons * average duration)
  const studyTimeHours = lessonsCompleted * 4; // Assuming 4 hours average per lesson
  
  // Current week is the first week with incomplete lessons, or last week if all complete
  const currentWeekNumber = weeksData.find(week => week.progress < 100)?.weekNumber || weeksData.length;

  // Show onboarding if requested
  if (showOnboarding) {
    return <OnboardingFlow 
      onComplete={handleOnboardingComplete} 
      onBack={() => setShowOnboarding(false)}
    />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardHome
            userName={userData.userName}
            learningGoal={userData.learningGoal}
            totalWeeks={weeksData.length}
            totalLessons={totalLessons}
            lessonsCompleted={lessonsCompleted}
            overallProgress={overallProgress}
            studyTimeHours={studyTimeHours}
            testAccuracy={85}
            currentWeekNumber={currentWeekNumber}
            weekData={weeksData.find(w => w.weekNumber === currentWeekNumber)}
            onStartLesson={handleStartLesson}
            hasRoadmap={hasRoadmap}
            onCreateRoadmap={handleCreateRoadmap}
          />
        );
      case 'lessons':
        return (
          <LessonsPage
            weeks={weeksData}
            onStartLesson={handleStartLesson}
            hasRoadmap={hasRoadmap}
            onCreateRoadmap={handleCreateRoadmap}
          />
        );
      case 'roadmap':
        return (
          <RoadmapPage
            learningGoal={userData.learningGoal}
            weeks={weeksData}
            onStartLesson={handleStartLesson}
            onCreateRoadmap={handleCreateRoadmap}
            onDeleteRoadmap={handleDeleteRoadmap}
            hasRoadmap={hasRoadmap}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            userName={userData.userName}
            userEmail={userData.userEmail}
            learningGoal={userData.learningGoal}
            profilePicture={userData.profilePicture}
            totalWeeks={weeksData.length}
            totalLessons={totalLessons}
            lessonsCompleted={lessonsCompleted}
            studyTimeHours={studyTimeHours}
            onSaveProfile={handleSaveProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      userName={userData.userName}
      userEmail={userData.userEmail}
      profilePicture={userData.profilePicture}
      onLogout={onLogout}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
