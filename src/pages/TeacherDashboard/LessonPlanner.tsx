import { useEffect, useState } from 'react';
import { postJSON } from '../../utils/api';
import { stripStars } from '../../utils/sanitize';

interface LessonPlannerProps {
  onBack: () => void;
  onSave?: (payload?: any) => void;
}

const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Art', 'Music', 'Physical Education'];
const DURATIONS = ['30 minutes', '45 minutes', '1 hour', '1.5 hours', '2 hours'];
const GRADE_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function LessonPlanner({ onBack, onSave }: LessonPlannerProps) {
  const [savedMsg, setSavedMsg] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [apiStatus, setApiStatus] = useState<number | null>(null);

  // Preload from 'Open' action
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherOpenWork');
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.toolId !== 'lesson-planner') return;
      const c = item.content;
      if (typeof c === 'string') {
        setGeneratedPlan(c);
      } else if (c && typeof c === 'object') {
        if (c.subject) setSubject(c.subject);
        if (c.topic) setTopic(c.topic);
        if (c.duration) setDuration(c.duration);
        if (c.gradeLevel) setGradeLevel(c.gradeLevel);
      }
    } catch {}
    finally {
      localStorage.removeItem('teacherOpenWork');
    }
  }, []);

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {};

    if (!subject) newErrors.subject = 'Please select a subject';
    if (!topic.trim()) newErrors.topic = 'Please enter a topic';
    if (!duration) newErrors.duration = 'Please select duration';
    if (!gradeLevel) newErrors.gradeLevel = 'Please select grade level';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);
    setErrors({});
    setApiError('');
    setApiStatus(null);

    try {
      const resp = await postJSON('/teacher/lesson/generate', {
        subject,
        topic,
        duration,
        gradeLevel,
      });
      const payload = (resp?.data && (resp.data.data || resp.data)) || resp;
      const text =
        payload?.generatedText ||
        payload?.planText ||
        payload?.lessonText ||
        payload?.content ||
        payload?.result ||
        payload?.text ||
        '';
      if (!text) {
        setApiError('No lesson content returned from server');
        setApiStatus((resp as any)?.status ?? null);
        setGeneratedPlan('');
        try { console.warn('Lesson generate: unexpected response shape', resp); } catch {}
      } else {
        setGeneratedPlan(stripStars(text));
      }
    } catch (e: any) {
      const msg = e?.message || 'Failed to generate lesson plan';
      setApiError(msg);
      setApiStatus(e?.status ?? null);
      setGeneratedPlan('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSubject('');
    setTopic('');
    setDuration('');
    setGradeLevel('');
    setGeneratedPlan('');
    setErrors({});
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2">
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold">Lesson Planner</h2>
          <p className="text-gray-400 mt-2">Generate comprehensive lesson plans instantly</p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && <div className="text-sm text-green-400">{savedMsg}</div>}
          <button
            onClick={async () => {
              const title = `${subject || 'Lesson'} - ${topic || ''}`.trim();
              const payloadLocal = generatedPlan
                ? { title, content: generatedPlan }
                : { title, content: { subject, topic, duration, gradeLevel } };

              try { onSave?.(payloadLocal); } catch {}

              try {
                await postJSON('/teacher/lesson/', {
                  subject,
                  topic,
                  duration,
                  gradeLevel,
                  planText: generatedPlan || '',
                });
                setSavedMsg('Saved');
              } catch (e: any) {
                const status = e?.status;
                const msg = e?.message || 'Failed to save to server';
                setSavedMsg(status === 401 ? 'Login required to save' : `Save failed: ${msg}`);
              } finally {
                setTimeout(() => setSavedMsg(''), 1800);
              }
            }}
            className="px-4 py-2 rounded-md bg-accent text-dark-primary font-semibold text-sm"
          >
            Save Work
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Lesson Details</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Subject *</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors">
                <option value="">Select subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Topic *</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Photosynthesis, Fractions, World War II" className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors" />
              {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Duration *</label>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map(d => (
                  <button key={d} type="button" onClick={() => setDuration(d)} className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${duration === d ? 'bg-accent text-dark-primary' : 'bg-dark-tertiary border border-gray-700 text-gray-400 hover:border-accent'}`}>
                    {d}
                  </button>
                ))}
              </div>
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Grade Level *</label>
              <div className="grid grid-cols-6 gap-2">
                {GRADE_LEVELS.map(g => (
                  <button key={g} type="button" onClick={() => setGradeLevel(g)} className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${gradeLevel === g ? 'bg-accent text-dark-primary' : 'bg-dark-tertiary border border-gray-700 text-gray-400 hover:border-accent'}`}>
                    {g}
                  </button>
                ))}
              </div>
              {errors.gradeLevel && <p className="text-red-500 text-xs mt-1">{errors.gradeLevel}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleGenerate} disabled={isGenerating} className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50">
                {isGenerating ? 'Generating Plan...' : 'Generate Lesson Plan'}
              </button>
              <button onClick={handleReset} className="px-6 py-3 border border-gray-700 text-gray-400 rounded-lg font-semibold hover:border-accent hover:text-white transition-all">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Generated Lesson Plan</h3>
            {generatedPlan && (
              <button className="text-sm text-accent hover:text-accent-light transition-colors">Download PDF</button>
            )}
          </div>

          {apiError && (
            <div className="mb-4 text-sm text-red-400">
              {apiStatus === 401 ? (
                <div>
                  <div className="mb-2">You are not logged in. Please sign in to generate lesson plans.</div>
                  <a href="/#login-teacher" className="text-accent hover:text-accent-light underline">Go to Teacher Login</a>
                </div>
              ) : (
                apiError
              )}
            </div>
          )}

          {!generatedPlan && !isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-400">Your lesson plan will appear here</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Creating your lesson plan...</p>
              </div>
            </div>
          )}

          {generatedPlan && (
            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6 max-h-[700px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">{generatedPlan}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
