import { useEffect, useState } from 'react';
import { postJSON } from '../../utils/api';
import { stripStars } from '../../utils/sanitize';

interface VisualAidGeneratorProps {
  onBack: () => void;
  onSave?: (payload?: any) => void;
}

const VISUAL_AID_TYPES = [
  { id: 'diagram', label: 'Diagram', icon: '📊', description: 'Flowcharts, process diagrams, concept maps' },
  { id: 'chart', label: 'Chart', icon: '📈', description: 'Bar charts, pie charts, line graphs' },
  { id: 'map', label: 'Map', icon: '🗺️', description: 'Mind maps, geographical maps, concept maps' },
  { id: 'timeline', label: 'Timeline', icon: '📅', description: 'Historical timelines, process timelines' }
];

export default function VisualAidGenerator({ onBack, onSave }: VisualAidGeneratorProps) {
  const [savedMsg, setSavedMsg] = useState('');
  const [visualType, setVisualType] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [apiStatus, setApiStatus] = useState<number | null>(null);

  // Preload from 'Open' action
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherOpenWork');
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.toolId !== 'visual-aid') return;
      const c = item.content;
      if (typeof c === 'string') {
        setGeneratedVisual(c);
      } else if (c && typeof c === 'object') {
        if (c.visualType) setVisualType(c.visualType);
        if (c.description) setDescription(c.description);
      }
    } catch {}
    finally {
      localStorage.removeItem('teacherOpenWork');
    }
  }, []);

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {};

    if (!visualType) newErrors.visualType = 'Please select a visual aid type';
    if (!description.trim()) newErrors.description = 'Please provide a description';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);
    setErrors({});
    setApiError('');
    setApiStatus(null);

    try {
      const resp = await postJSON('/teacher/visual/generate', {
        visualType,
        description,
        language: language.toLowerCase(),
      });
      const payload = (resp?.data && (resp.data.data || resp.data)) || resp;
      const text =
        payload?.generatedText ||
        payload?.stepsText ||
        payload?.visualText ||
        payload?.content ||
        payload?.visual ||
        payload?.result ||
        payload?.text ||
        '';
      if (!text) {
        setApiError('No visual content returned from server');
        setApiStatus((resp as any)?.status ?? null);
        setGeneratedVisual('');
        try { console.warn('Visual generate: unexpected response shape', resp); } catch {}
      } else {
        setGeneratedVisual(stripStars(text));
      }
    } catch (e: any) {
      const msg = e?.message || 'Failed to generate visual aid';
      setApiError(msg);
      setApiStatus(e?.status ?? null);
      setGeneratedVisual('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setVisualType('');
    setDescription('');
    setGeneratedVisual('');
    setErrors({});
  };

  const handleDownload = () => {
    const blob = new Blob([generatedVisual], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visual-aid-${visualType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <h2 className="text-3xl font-bold">Visual Aid Generator</h2>
          <p className="text-gray-400 mt-2">Create educational diagrams and visual aids for teaching</p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && <div className="text-sm text-green-400">{savedMsg}</div>}
          <button
            onClick={async () => {
              const title = `${visualType || 'Visual Aid'}`.trim();
              const payloadLocal = generatedVisual
                ? { title, content: generatedVisual }
                : { title, content: { visualType, description } };

              // Maintain existing local callback
              try { onSave?.(payloadLocal); } catch {}

              // Persist to backend Visual endpoint
              try {
                await postJSON('/teacher/visual/', {
                  visualType,
                  description,
                  stepsText: generatedVisual || '',
                  language,
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
          <h3 className="text-xl font-bold mb-6">Visual Aid Settings</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Type of Visual Aid</label>
              <div className="grid grid-cols-2 gap-3">
                {VISUAL_AID_TYPES.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setVisualType(type.id)}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${
                      visualType === type.id
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-sm font-bold mb-1">{type.label}</div>
                    <div className="text-xs text-gray-400">{type.description}</div>
                  </button>
                ))}
              </div>
              {errors.visualType && <p className="text-red-500 text-xs mt-1">{errors.visualType}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to visualize (e.g., 'Water cycle process', 'Comparison of government types', 'Timeline of Industrial Revolution')"
                rows={6}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-accent mb-1">Pro Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Be specific about what you want to show</li>
                    <li>• Include key terms or concepts to display</li>
                    <li>• Mention the number of items if relevant</li>
                    <li>• Specify relationships or connections</li>
                    <li>• Consider your classroom display size</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating Visual Aid...' : 'Generate Visual Aid'}
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
            <h3 className="text-xl font-bold">Generated Visual Aid</h3>
            {generatedVisual && (
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1"
                >
                  <span>💾</span> Download
                </button>
                <button className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1">
                  <span>🖨️</span> Print
                </button>
              </div>
            )}
          </div>

          {apiError && (
            <div className="mb-4 text-sm text-red-400">
              {apiStatus === 401 ? (
                <div>
                  <div className="mb-2">You are not logged in. Please sign in to generate visuals.</div>
                  <a href="/#login-teacher" className="text-accent hover:text-accent-light underline">Go to Teacher Login</a>
                </div>
              ) : (
                apiError
              )}
            </div>
          )}

          {!generatedVisual && !isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="text-6xl mb-4">🎨</div>
                <h4 className="text-xl font-bold mb-2">Create Visual Learning Aids</h4>
                <p className="text-gray-400">Choose a type and describe what you need</p>
                <p className="text-sm text-gray-500 mt-2">Perfect for blackboards and presentations</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Creating your visual aid...</p>
                <p className="text-sm text-gray-500 mt-2">Designing the perfect layout</p>
              </div>
            </div>
          )}

          {generatedVisual && (
            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6 max-h-[700px] overflow-y-auto">
              <pre className="whitespace-pre font-mono text-xs text-gray-300 leading-tight">
                {generatedVisual}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
