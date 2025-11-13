import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/TeacherDashboard/DashboardLayout';
import DashboardHome from '../components/TeacherDashboard/DashboardHome';
import ContentGenerator from '../pages/TeacherDashboard/ContentGenerator';
import MaterialBase from '../pages/TeacherDashboard/MaterialBase';
import KnowledgeBase from '../pages/TeacherDashboard/KnowledgeBase';
import VisualAidGenerator from '../pages/TeacherDashboard/VisualAidGenerator';
import LessonPlanner from '../pages/TeacherDashboard/LessonPlanner';
import GameGenerator from '../pages/TeacherDashboard/GameGenerator';
import { useAuth } from '../utils/auth';

export default function TeacherRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [institutionType, setInstitutionType] = useState<'school' | 'college'>('school');
  const { user, profile, loading, refresh, logout } = useAuth();

  const teacherName = useMemo(() => {
    const fromProfile = profile?.fullName || profile?.name || [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');
    const fromUser = user?.fullName || user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || (typeof user?.email === 'string' ? user.email.split('@')[0] : '');
    const fromStorage = (() => { try { const n = localStorage.getItem('teacherName'); return n || ''; } catch { return ''; } })();
    return (fromProfile || fromUser || fromStorage || 'Teacher').trim();
  }, [user, profile]);

  // derive current page from location
  const path = location.pathname.replace(/^\/teacher\/?/, '') || 'dashboard';

  useEffect(() => {
    // Load institution preference
    const savedInstitution = localStorage.getItem('teacherInstitutionType');
    if (savedInstitution === 'school' || savedInstitution === 'college') setInstitutionType(savedInstitution);
  }, []);

  useEffect(() => {
    // Try to refresh auth if we don't have a name yet
    if (!loading && !user) {
      refresh().catch(() => {});
    }
  }, [loading, user, refresh]);

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout currentPage={path as any} onLogout={logout} userName={teacherName} userEmail={(user as any)?.email || ''} profilePicture={(profile as any)?.avatarUrl || ''} />}>
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
