import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import LessonsPage from './LessonsPage';
import RoadmapPage from './RoadmapPage';
import ProfilePage from './ProfilePage';

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

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'lessons' | 'roadmap' | 'profile'>('dashboard');
  const [userData, setUserData] = useState({
    userName: 'hello1',
    userEmail: 'hello1@gmail.com',
    learningGoal: 'I want to become a Software Developer',
    profilePicture: '',
  });

  // Mock data - Replace with actual data from your backend
  const weeksData: Week[] = [
    {
      weekNumber: 1,
      title: 'Week 1: Java Fundamentals and Web Development Introduction',
      lessonsCompleted: 1,
      totalLessons: 5,
      progress: 20,
      lessons: [
        {
          id: 'w1l1',
          title: 'Java Refresher',
          description: 'Review Java syntax, data types, operators, control flow, and object-oriented programming principles (classes, objects, inheritance, polymorphism, encapsulation).',
          duration: '5 hours',
          completed: true,
        },
        {
          id: 'w1l2',
          title: 'Introduction to Web Development',
          description: 'Understand the client-server architecture, HTTP protocol, and the role of HTML, CSS, and JavaScript in web development.',
          duration: '3 hours',
          completed: false,
        },
        {
          id: 'w1l3',
          title: 'HTML Fundamentals',
          description: 'Learn HTML tags, attributes, structure, and semantic HTML. Build simple static web pages.',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w1l4',
          title: 'CSS Fundamentals',
          description: 'Learn CSS selectors, properties, and values. Style HTML elements and create basic layouts.',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w1l5',
          title: 'Collections and Data Structures',
          description: 'Understand and implement various Java collections like ArrayList, LinkedList, HashMap, HashSet. Learn about data structure concepts like stacks, queues, and trees.',
          duration: '4 hours',
          completed: false,
        },
      ],
    },
    {
      weekNumber: 2,
      title: 'Week 2: Building Interactive Web Pages with JavaScript',
      lessonsCompleted: 0,
      totalLessons: 4,
      progress: 0,
      lessons: [
        {
          id: 'w2l1',
          title: 'JavaScript Fundamentals',
          description: 'Learn JavaScript syntax, variables, data types, operators, control flow, and functions.',
          duration: '5 hours',
          completed: false,
        },
        {
          id: 'w2l2',
          title: 'DOM Manipulation',
          description: 'Understand the Document Object Model (DOM) and learn how to manipulate HTML elements using JavaScript.',
          duration: '5 hours',
          completed: false,
        },
        {
          id: 'w2l3',
          title: 'Event Handling',
          description: 'Learn how to handle user events (e.g., clicks, mouseovers, form submissions) using JavaScript.',
          duration: '5 hours',
          completed: false,
        },
        {
          id: 'w2l4',
          title: 'Asynchronous JavaScript and AJAX',
          description: 'Understand asynchronous programming in JavaScript and learn how to make AJAX requests to fetch data from a server.',
          duration: '5 hours',
          completed: false,
        },
      ],
    },
    {
      weekNumber: 3,
      title: 'Week 3: Introduction to Java Servlets',
      lessonsCompleted: 0,
      totalLessons: 5,
      progress: 0,
      lessons: [
        {
          id: 'w3l1',
          title: 'Introduction to Java Servlets',
          description: 'Understand the concept of Java Servlets, their role in handling HTTP requests, and the Servlet lifecycle.',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w3l2',
          title: 'Servlet Request and Response',
          description: 'Learn how to handle HTTP requests and generate HTTP responses using Java Servlets.',
          duration: '5 hours',
          completed: false,
        },
        {
          id: 'w3l3',
          title: 'Session Management',
          description: 'Understand session management techniques in web applications using cookies and sessions.',
          duration: '4 hours',
          completed: false,
        },
        {
          id: 'w3l4',
          title: 'Servlet Filters',
          description: 'Learn about servlet filters and how to use them for tasks like authentication and logging.',
          duration: '3 hours',
          completed: false,
        },
        {
          id: 'w3l5',
          title: 'Building a Simple Web Application',
          description: 'Build a simple web application using servlets to handle user requests and responses.',
          duration: '6 hours',
          completed: false,
        },
      ],
    },
  ];

  const totalLessons = weeksData.reduce((total, week) => total + week.totalLessons, 0);
  const lessonsCompleted = weeksData.reduce((total, week) => total + week.lessonsCompleted, 0);

  const handleStartLesson = (lessonId: string) => {
    console.log('Starting lesson:', lessonId);
    // Implement lesson start logic
  };

  const handleSaveProfile = (data: { userName: string; userEmail: string; learningGoal: string; profilePicture?: string }) => {
    setUserData({
      ...data,
      profilePicture: data.profilePicture || '',
    });
    console.log('Profile saved:', data);
    // Implement save to backend
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardHome
            userName={userData.userName}
            learningGoal={userData.learningGoal}
            totalLessons={totalLessons}
            lessonsCompleted={lessonsCompleted}
            hoursStudied={11}
            testAccuracy={70}
            currentWeek={1}
            weekData={weeksData[0]}
            onStartLesson={handleStartLesson}
          />
        );
      case 'lessons':
        return <LessonsPage weeks={weeksData} onStartLesson={handleStartLesson} />;
      case 'roadmap':
        return (
          <RoadmapPage
            learningGoal={userData.learningGoal}
            weeks={weeksData}
            onStartLesson={handleStartLesson}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            userName={userData.userName}
            userEmail={userData.userEmail}
            learningGoal={userData.learningGoal}
            profilePicture={userData.profilePicture}
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
      onPageChange={setCurrentPage}
      onLogout={onLogout}
      userName={userData.userName}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
