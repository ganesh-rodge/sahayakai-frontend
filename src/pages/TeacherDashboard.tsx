import { useEffect, useState } from 'react';
import { useAuth } from '../utils/auth';
import ContentGenerator from './TeacherDashboard/ContentGenerator';
import MaterialBase from './TeacherDashboard/MaterialBase';
import KnowledgeBase from './TeacherDashboard/KnowledgeBase';
import VisualAidGenerator from './TeacherDashboard/VisualAidGenerator';
import LessonPlanner from './TeacherDashboard/LessonPlanner';
import GameGenerator from './TeacherDashboard/GameGenerator';
import SavedWorkList, { type SavedItem } from './TeacherDashboard/SavedWork.tsx';

import Profile from './TeacherDashboard/Profile';

export default function TeacherDashboard() {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState<'welcome' | 'content-generator' | 'material-base' | 'knowledge-base' | 'visual-aid' | 'lesson-planner' | 'game-generator' | 'saved-work' | 'profile'>('welcome');
  const [institutionType] = useState<'school' | 'college'>('school');

  const getStoredName = () => {
    try {
      const raw = localStorage.getItem('teacherProfile');
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.name) return String(p.name);
      }
    } catch {}
    return 'Dr. Smith';
  };
  const [teacherName, setTeacherName] = useState<string>(getStoredName());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const tools = [
    {
      id: 'content-generator',
      icon: '📝',
      title: 'Content Generator',
      description: 'Generate stories, poems, and dialogues for your students',
      color: 'from-blue-500 to-cyan-500',
      forSchool: true,
      forCollege: false
    },
    {
      id: 'material-base',
      icon: '📸',
      title: 'Material Base',
      description: 'Transform textbook pages into worksheets',
      color: 'from-purple-500 to-pink-500',
      forSchool: true,
      forCollege: false
    },
    {
      id: 'knowledge-base',
      icon: '❓',
      title: 'Knowledge Base',
      description: 'Get instant AI explanations for student questions',
      color: 'from-green-500 to-emerald-500',
      forSchool: true,
      forCollege: true
    },
    {
      id: 'visual-aid',
      icon: '🎨',
      title: 'Visual Aid Generator',
      description: 'Create diagrams, charts, and educational visuals',
      color: 'from-orange-500 to-red-500',
      forSchool: true,
      forCollege: true
    },
    {
      id: 'lesson-planner',
      icon: '📅',
      title: 'Lesson Planner',
      description: 'Generate structured weekly lesson plans',
      color: 'from-teal-500 to-cyan-500',
      forSchool: true,
      forCollege: true
    },
    {
      id: 'game-generator',
      icon: '🎮',
      title: 'Game Generator',
      description: 'Create engaging educational games',
      color: 'from-pink-500 to-rose-500',
      forSchool: true,
      forCollege: false
    },
    // Audio Assessment removed
  ];

  const filteredTools = tools.filter(tool =>
    institutionType === 'school' ? tool.forSchool : tool.forCollege
  );

  const saveWorkToStorage = (entry: { toolId: string; title: string; content?: string | any; savedAt?: string }) => {
    try {
      const raw = localStorage.getItem('teacherSavedWorks');
      const arr = raw ? JSON.parse(raw) : [];
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        toolId: entry.toolId,
        title: entry.title || 'Untitled',
        content: entry.content || null,
        savedAt: entry.savedAt || new Date().toISOString()
      };
      arr.unshift(item);
      localStorage.setItem('teacherSavedWorks', JSON.stringify(arr));
      // navigate to saved work list after saving
      setActiveView('saved-work');
    } catch (err) {
      console.error('Failed saving work', err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="sticky top-0 z-50 bg-dark-secondary/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => (window.location.href = '/')}
                className="flex items-center gap-2"
                title="Back to Home"
              >
                <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-8 w-auto" />
              </button>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setActiveView('saved-work')}
                className="px-3 py-2 rounded-md bg-dark-tertiary text-sm text-gray-300 hover:bg-dark-tertiary/80 transition-colors"
                title="Open Saved Work"
              >
                💾 Saved Work
              </button>

              <button
                onClick={() => setActiveView('profile')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-dark-primary font-bold hover:brightness-110"
                title="Profile"
              >
                {teacherName.charAt(0)}
              </button>

              <button
                onClick={() => { try { logout(); } finally { window.location.href = '/'; } }}
                className="px-3 py-2 rounded-md bg-red-500/20 text-sm text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                title="Logout"
              >
                Logout
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label="Open menu"
                className="p-2 rounded-md bg-dark-tertiary text-gray-200 border border-gray-700"
              >
                {/* hamburger icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M3.75 6.75A.75.75 0 014.5 6h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm.75 4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z" clipRule="evenodd" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-4 top-16 w-64 bg-dark-secondary border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                    <div className="font-semibold">Menu</div>
                    <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                  </div>
                  <div className="p-3 space-y-3">
                    <button
                      onClick={() => { setActiveView('saved-work'); setIsMenuOpen(false); }}
                      className="w-full px-3 py-2 rounded-md bg-dark-tertiary text-sm text-gray-200 hover:bg-dark-tertiary/80 transition-colors flex items-center gap-2"
                    >
                      <span>💾</span> <span>Saved Work</span>
                    </button>

                    <button
                      onClick={() => { setActiveView('profile'); setIsMenuOpen(false); }}
                      className="w-full px-3 py-2 rounded-md bg-gradient-to-br from-accent to-accent-light text-sm text-dark-primary font-semibold"
                    >
                      Profile ({teacherName})
                    </button>

                    <button
                      onClick={() => { setIsMenuOpen(false); try { logout(); } finally { window.location.href = '/'; } }}
                      className="w-full px-3 py-2 rounded-md text-sm bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'welcome' && (
          <div className="animate-fadeIn">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {getGreeting()}, <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">{teacherName}</span>
              </h1>
              <p className="text-gray-400 text-lg">Ready to create amazing learning materials today?</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveView(tool.id as any)}
                  className="bg-dark-secondary border border-gray-800 rounded-xl p-8 text-left hover:border-accent transition-all hover:scale-105 group"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tool.color} rounded-t-xl`}></div>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{tool.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeView === 'content-generator' && (
          <ContentGenerator onBack={() => setActiveView('welcome')} onSave={(payload?: any) => saveWorkToStorage({ toolId: 'content-generator', title: payload?.title || 'Content', content: payload?.content || payload })} />
        )}

        {activeView === 'material-base' && (
          <MaterialBase onBack={() => setActiveView('welcome')} onSave={(payload?: any) => saveWorkToStorage({ toolId: 'material-base', title: payload?.title || 'Worksheet', content: payload?.content || payload })} />
        )}

        {activeView === 'knowledge-base' && (
          <KnowledgeBase onBack={() => setActiveView('welcome')} onSave={(payload?: any) => saveWorkToStorage({ toolId: 'knowledge-base', title: payload?.title || 'Answer', content: payload?.content || payload })} />
        )}

        {activeView === 'visual-aid' && (
          <VisualAidGenerator onBack={() => setActiveView('welcome')} onSave={(payload?: any) => saveWorkToStorage({ toolId: 'visual-aid', title: payload?.title || 'Visual Aid', content: payload?.content || payload })} />
        )}

        {activeView === 'lesson-planner' && (
          <LessonPlanner onBack={() => setActiveView('welcome')} onSave={(payload?: any) => saveWorkToStorage({ toolId: 'lesson-planner', title: payload?.title || 'Lesson Plan', content: payload?.content || payload })} />
        )}

        {activeView === 'game-generator' && (
          <GameGenerator onBack={() => setActiveView('welcome')} onSave={(payload?: any) => saveWorkToStorage({ toolId: 'game-generator', title: payload?.title || 'Game', content: payload?.content || payload })} />
        )}

        {/** Audio Assessment removed */}

        {activeView === 'saved-work' && (
          // lazy import-like render of saved work list component
          <div className="animate-fadeIn">
            {/* We'll render saved work list component file */}
            {/* Keep inline simple viewer so we don't add routing yet */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Saved Work</h2>
              <p className="text-gray-400 mt-2">Your saved teaching artifacts</p>
            </div>

            <SavedWorkList onOpen={(item: SavedItem) => {
              if (item.toolId === 'audio-assessment') {
                alert('Audio Assessment tool has been removed. You can still view and copy your saved report here.');
                return;
              }
              // Stash selected work so the tool can preload it, then navigate to the tool
              try {
                localStorage.setItem('teacherOpenWork', JSON.stringify(item));
              } catch {}
              setActiveView(item.toolId as any);
            }} />
          </div>
        )}

        {activeView === 'profile' && (
          <Profile
            onBack={() => setActiveView('welcome')}
            onSaved={() => setTeacherName(getStoredName())}
          />
        )}
      </div>
    </div>
  );
}
