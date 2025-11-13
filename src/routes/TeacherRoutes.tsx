import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/TeacherDashboard/DashboardLayout';
import DashboardHome from '../components/TeacherDashboard/DashboardHome';
import ContentGenerator from '../pages/TeacherDashboard/ContentGenerator';
import MaterialBase from '../pages/TeacherDashboard/MaterialBase';
import KnowledgeBase from '../pages/TeacherDashboard/KnowledgeBase';
import VisualAidGenerator from '../pages/TeacherDashboard/VisualAidGenerator';
import LessonPlanner from '../pages/TeacherDashboard/LessonPlanner';
import GameGenerator from '../pages/TeacherDashboard/GameGenerator';

export default function TeacherRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [institutionType, setInstitutionType] = useState<'school' | 'college'>('school');
  const [teacherName, setTeacherName] = useState('Teacher');

  // derive current page from location
  const path = location.pathname.replace(/^\/teacher\/?/, '') || 'dashboard';

  useEffect(() => {
    // placeholder: could load teacher profile from localStorage or API
    const savedName = localStorage.getItem('teacherName');
    const savedInstitution = localStorage.getItem('teacherInstitutionType');
    if (savedName) setTeacherName(savedName);
    if (savedInstitution === 'school' || savedInstitution === 'college') setInstitutionType(savedInstitution);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout currentPage={path as any} onLogout={() => navigate('/')} userName={teacherName} userEmail={''} profilePicture={''} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<DashboardHome teacherName={teacherName} institutionType={institutionType} onChangeInstitution={(t: 'school' | 'college') => setInstitutionType(t)} />} />
        <Route path="content-generator" element={<ContentGenerator onBack={() => navigate('/teacher/dashboard')} />} />
        <Route path="material-base" element={<MaterialBase onBack={() => navigate('/teacher/dashboard')} />} />
        <Route path="knowledge-base" element={<KnowledgeBase onBack={() => navigate('/teacher/dashboard')} />} />
        <Route path="visual-aid" element={<VisualAidGenerator onBack={() => navigate('/teacher/dashboard')} />} />
        <Route path="lesson-planner" element={<LessonPlanner onBack={() => navigate('/teacher/dashboard')} />} />
        <Route path="game-generator" element={<GameGenerator onBack={() => navigate('/teacher/dashboard')} />} />
  {/** Audio Assessment removed */}

        {/* optional teacher routes */}
        <Route path="settings" element={<div className="p-6 text-white">Settings coming soon</div>} />
      </Route>
    </Routes>
  );
}
