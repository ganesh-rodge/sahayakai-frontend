import React, { useEffect, useState } from 'react';
import { postJSON } from '../../utils/api';

interface ContentGeneratorProps {
  onBack: () => void;
  onSave?: (payload?: any) => void;
}

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese',
  'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian', 'Bengali', 'Tamil',
  'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'
];

const CONTENT_TYPES = [
  { id: 'story', label: 'Story', icon: '📖' },
  { id: 'poem', label: 'Poem', icon: '✍️' },
  { id: 'dialogue', label: 'Dialogue (Drama)', icon: '🎭' }
];

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function ContentGenerator({ onBack, onSave }: ContentGeneratorProps) {
  const [savedMsg, setSavedMsg] = useState('');
  const [language, setLanguage] = useState('');
  const [contentType, setContentType] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  // Preload from 'Open' action
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherOpenWork');
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.toolId !== 'content-generator') return;
      const c = item.content;
      if (typeof c === 'string') {
        setGeneratedContent(c);
      } else if (c && typeof c === 'object') {
        if (c.language) setLanguage(c.language);
        if (c.contentType) setContentType(c.contentType);
        if (c.gradeLevel) setGradeLevel(c.gradeLevel);
        if (c.topic) setTopic(c.topic);
      }
    } catch {}
    finally {
      // Clear the handoff so it doesn't reapply
      localStorage.removeItem('teacherOpenWork');
    }
  }, []);

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {};

    if (!language) newErrors.language = 'Please select a language';
    if (!contentType) newErrors.contentType = 'Please select content type';
    if (!gradeLevel) newErrors.gradeLevel = 'Please select grade level';
    if (!topic.trim()) newErrors.topic = 'Please enter a topic';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);
    setErrors({});
    setApiError('');

    try {
      const resp = await postJSON('/teacher/content/generate', {
        language,
        contentType,
        gradeLevel,
        topic,
      });

      const text = resp?.data?.generatedText || '';
      setGeneratedContent(text);
    } catch (e: any) {
      const msg = e?.message || 'Failed to generate content';
      setApiError(msg);
      setGeneratedContent('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setLanguage('');
    setContentType('');
    setGradeLevel('');
    setTopic('');
    setGeneratedContent('');
    setErrors({});
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold">Content Generator</h2>
          <p className="text-gray-400 mt-2">Create engaging educational content for your students</p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && <div className="text-sm text-green-400">{savedMsg}</div>}
          <button
            onClick={() => {
              const payload = generatedContent ? { title: `${contentType || 'Content'} - ${topic || ''}`, content: generatedContent } : { title: `${contentType || 'Content'} - ${topic || ''}`, content: { language, contentType, gradeLevel, topic } };
              onSave?.(payload);
              setSavedMsg('Saved');
              setTimeout(() => setSavedMsg(''), 1800);
            }}
            className="px-4 py-2 rounded-md bg-accent text-dark-primary font-semibold text-sm"
          >
            Save Work
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Content Settings</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Language *</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              >
                <option value="">Select language</option>
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Content Type *</label>
              <div className="grid grid-cols-3 gap-3">
                {CONTENT_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setContentType(type.id)}
                    className={`p-4 border-2 rounded-lg transition-all text-center ${
                      contentType === type.id
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-semibold">{type.label}</div>
                  </button>
                ))}
              </div>
              {errors.contentType && <p className="text-red-500 text-xs mt-1">{errors.contentType}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Grade Level *</label>
              <div className="grid grid-cols-5 gap-2">
                {GRADES.map(grade => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setGradeLevel(grade)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      gradeLevel === grade
                        ? 'bg-accent text-dark-primary'
                        : 'bg-dark-tertiary border border-gray-700 text-gray-400 hover:border-accent'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {errors.gradeLevel && <p className="text-red-500 text-xs mt-1">{errors.gradeLevel}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Topic / Subject *</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g., The importance of friendship, Solar System, Environmental conservation"
                rows={4}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors resize-none"
              />
              {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-700 text-gray-400 rounded-lg font-semibold hover:border-accent hover:text-white transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Generated Content</h3>
            {generatedContent && (
              <button
                onClick={() => navigator.clipboard.writeText(generatedContent)}
                className="text-sm text-accent hover:text-accent-light transition-colors"
              >
                Copy
              </button>
            )}
          </div>

          {apiError && (
            <div className="mb-4 text-sm text-red-400">
              {apiError}
            </div>
          )}

          {!generatedContent && !isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400">Your generated content will appear here</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Generating your content...</p>
              </div>
            </div>
          )}

          {generatedContent && (
            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6 max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                {generatedContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
