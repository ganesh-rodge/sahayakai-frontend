import { useState } from 'react';
import ContentGenerator from './TeacherDashboard/ContentGenerator';
import MaterialBase from './TeacherDashboard/MaterialBase';
import KnowledgeBase from './TeacherDashboard/KnowledgeBase';
import VisualAidGenerator from './TeacherDashboard/VisualAidGenerator';
import LessonPlanner from './TeacherDashboard/LessonPlanner';
import GameGenerator from './TeacherDashboard/GameGenerator';
import AudioAssessment from './TeacherDashboard/AudioAssessment';

export default function TeacherDashboard() {
  const [activeView, setActiveView] = useState<'welcome' | 'content-generator' | 'material-base' | 'knowledge-base' | 'visual-aid' | 'lesson-planner' | 'game-generator' | 'audio-assessment'>('welcome');
  const [institutionType, setInstitutionType] = useState<'school' | 'college'>('school');

  const teacherName = 'Dr. Smith';

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
    {
      id: 'audio-assessment',
      icon: '🎤',
      title: 'Audio Reading Assessment',
      description: 'Evaluate student reading skills using speech-to-text',
      color: 'from-indigo-500 to-purple-500',
      forSchool: true,
      forCollege: false
    }
  ];

  const filteredTools = tools.filter(tool =>
    institutionType === 'school' ? tool.forSchool : tool.forCollege
  );

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="sticky top-0 z-50 bg-dark-secondary/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => (window.location.href = '/')}
                className="flex items-center gap-2"
                title="Back to Home"
              >
                <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-8 w-auto" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2 bg-dark-tertiary rounded-lg p-1">
                <button
                  onClick={() => setInstitutionType('school')}
                  className={`px-4 py-2 rounded-md transition-all text-sm font-semibold ${
                    institutionType === 'school'
                      ? 'bg-accent text-dark-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  School
                </button>
                <button
                  onClick={() => setInstitutionType('college')}
                  className={`px-4 py-2 rounded-md transition-all text-sm font-semibold ${
                    institutionType === 'college'
                      ? 'bg-accent text-dark-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  College
                </button>
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-dark-primary font-bold">
                {teacherName.charAt(0)}
              </div>
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
          <ContentGenerator onBack={() => setActiveView('welcome')} />
        )}

        {activeView === 'material-base' && (
          <MaterialBase onBack={() => setActiveView('welcome')} />
        )}

        {activeView === 'knowledge-base' && (
          <KnowledgeBase onBack={() => setActiveView('welcome')} />
        )}

        {activeView === 'visual-aid' && (
          <VisualAidGenerator onBack={() => setActiveView('welcome')} />
        )}

        {activeView === 'lesson-planner' && (
          <LessonPlanner onBack={() => setActiveView('welcome')} />
        )}

        {activeView === 'game-generator' && (
          <GameGenerator onBack={() => setActiveView('welcome')} />
        )}

        {activeView === 'audio-assessment' && (
          <AudioAssessment onBack={() => setActiveView('welcome')} />
        )}
      </div>
    </div>
  );
}
