import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardHomeProps {
  teacherName: string;
  institutionType: 'school' | 'college';
  onChangeInstitution: (t: 'school' | 'college') => void;
}

export default function DashboardHome({ teacherName, institutionType, onChangeInstitution }: DashboardHomeProps) {
  const navigate = useNavigate();

  const tools = useMemo(() => [
    { id: 'content-generator', icon: '📝', title: 'Content Generator', description: 'Generate stories, poems and dialogues', forSchool: true, forCollege: false },
    { id: 'material-base', icon: '📸', title: 'Material Base', description: 'Transform textbook pages into worksheets', forSchool: true, forCollege: false },
    { id: 'knowledge-base', icon: '❓', title: 'Knowledge Base', description: 'AI explanations for student questions', forSchool: true, forCollege: true },
    { id: 'visual-aid', icon: '🎨', title: 'Visual Aid Generator', description: 'Create diagrams, charts, and visuals', forSchool: true, forCollege: true },
    { id: 'lesson-planner', icon: '📅', title: 'Lesson Planner', description: 'Generate structured weekly lesson plans', forSchool: true, forCollege: true },
    { id: 'game-generator', icon: '🎮', title: 'Game Generator', description: 'Create engaging educational games', forSchool: true, forCollege: false },
    { id: 'audio-assessment', icon: '🎤', title: 'Audio Reading Assessment', description: 'Evaluate student reading skills using speech-to-text', forSchool: true, forCollege: false },
  ], []);

  const filtered = tools.filter(t => institutionType === 'school' ? t.forSchool : t.forCollege);

  return (
    <div className="animate-fadeIn">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome, <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">{teacherName}</span></h1>
        <p className="text-gray-400 text-lg">Choose a tool to get started</p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex gap-2 bg-dark-tertiary rounded-lg p-1">
          <button onClick={() => onChangeInstitution('school')} className={`px-4 py-2 rounded-md text-sm font-semibold ${institutionType === 'school' ? 'bg-accent text-dark-primary' : 'text-gray-400 hover:text-white'}`}>School</button>
          <button onClick={() => onChangeInstitution('college')} className={`px-4 py-2 rounded-md text-sm font-semibold ${institutionType === 'college' ? 'bg-accent text-dark-primary' : 'text-gray-400 hover:text-white'}`}>College</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(tool => (
          <button key={tool.id} onClick={() => navigate(`/teacher/${tool.id}`)} className="bg-dark-secondary border border-gray-800 rounded-xl p-8 text-left hover:border-accent transition-all hover:scale-105 group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-light rounded-t-xl`}></div>
            <div className="text-5xl mb-4">{tool.icon}</div>
            <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
