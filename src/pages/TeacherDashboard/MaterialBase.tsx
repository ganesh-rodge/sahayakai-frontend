import { useEffect, useState } from 'react';
import { postForm, postJSON } from '../../utils/api';
import { stripStars } from '../../utils/sanitize';

interface MaterialBaseProps {
  onBack: () => void;
  onSave?: (payload?: any) => void;
}

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function MaterialBase({ onBack, onSave }: MaterialBaseProps) {
  const [savedMsg, setSavedMsg] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState('English');
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'idle' | 'generating' | 'saving' | 'done'>('idle');
  const [uploadedRemoteUrl, setUploadedRemoteUrl] = useState<string | null>(null);

  // Preload from 'Open' action
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherOpenWork');
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.toolId !== 'material-base') return;
      const c = item.content;
      if (typeof c === 'string') {
        setGeneratedWorksheet(c);
      } else if (c && typeof c === 'object') {
        if (c.gradeLevel) setGradeLevel(c.gradeLevel);
      }
    } catch {}
    finally {
      localStorage.removeItem('teacherOpenWork');
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        setErrors({});
      } else {
        setErrors({ file: 'Please upload an image file' });
      }
    }
  };

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {};

    if (!uploadedFile) newErrors.file = 'Please upload a textbook page or screenshot';
    if (!gradeLevel) newErrors.gradeLevel = 'Please select grade level';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    setApiStatus('generating');
    setErrors({});

    try {
      const form = new FormData();
      form.append('language', language.toLowerCase());
      // API expects 'grade' based on attachment; use selected grade level
      form.append('grade', gradeLevel);
      form.append('photo', uploadedFile as File);

      const data: any = await postForm('/teacher/material/generate', form);
      const payload = data?.data || data;
      const text = payload?.generatedText || payload?.text || '';
      const imageUrl = payload?.originalImageUrl || payload?.imageUrl || payload?.photoUrl || null;
      if (imageUrl) setUploadedRemoteUrl(imageUrl);
      if (!text) throw new Error('No generated text returned');
      setGeneratedWorksheet(stripStars(text));
    } catch (e: any) {
      if (e?.status === 401) {
        setApiError('Unauthorized. Please log in to generate.');
      } else {
        setApiError(e?.message || 'Failed to generate worksheet');
      }
    } finally {
      setIsGenerating(false);
      setApiStatus('idle');
    }
  };

  const handleReset = () => {
    setGradeLevel('');
    setUploadedFile(null);
    setPreviewUrl('');
    setGeneratedWorksheet('');
    setErrors({});
    setUploadedRemoteUrl(null);
    setApiError(null);
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
          <h2 className="text-3xl font-bold">Material Base</h2>
          <p className="text-gray-400 mt-2">Transform textbook pages into interactive worksheets</p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && <div className="text-sm text-green-400">{savedMsg}</div>}
          <button
            onClick={async () => {
              try {
                setApiStatus('saving');
                setApiError(null);
                await postJSON('/teacher/material/', {
                  gradeLevel: gradeLevel || null,
                  originalImageUrl: uploadedRemoteUrl,
                  generatedText: generatedWorksheet,
                  language,
                });
                setSavedMsg('Saved');
                setTimeout(() => setSavedMsg(''), 1800);
                // Also forward to optional onSave for local fallback or navigation
                const payload = generatedWorksheet
                  ? { title: `Worksheet - Grade ${gradeLevel || 'N/A'}`, content: generatedWorksheet, toolId: 'material-base' }
                  : { title: `Worksheet - Grade ${gradeLevel || 'N/A'}`, content: { gradeLevel }, toolId: 'material-base' };
                onSave?.(payload);
              } catch (e: any) {
                if (e?.status === 401) {
                  setApiError('Unauthorized. Please log in to save.');
                } else {
                  setApiError(e?.message || 'Failed to save');
                }
              } finally {
                setApiStatus('idle');
              }
            }}
            disabled={apiStatus === 'saving'}
            className="px-4 py-2 rounded-md bg-accent text-dark-primary font-semibold text-sm disabled:opacity-60"
          >
            {apiStatus === 'saving' ? 'Saving...' : 'Save Work'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Upload & Configure</h3>

          {apiError && (
            <div className="mb-4 text-sm text-red-400">{apiError} {apiError.includes('Unauthorized') && (
              <a href="/login-teacher" className="underline ml-1">Login</a>
            )}</div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Upload Textbook Page / Screenshot *</label>

              {!previewUrl ? (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-accent transition-all cursor-pointer bg-dark-tertiary">
                    <div className="text-5xl mb-4">📸</div>
                    <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Uploaded textbook page"
                    className="w-full rounded-lg border border-gray-700"
                  />
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
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
              <label className="block text-sm font-semibold mb-3">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-dark-tertiary border border-gray-700 rounded-lg p-3 text-gray-200"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
              </select>
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-accent mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-300">
                    For best results, upload clear images with good lighting. The AI will analyze the content and create appropriate worksheets.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating Worksheet...' : 'Generate Worksheet'}
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
            <h3 className="text-xl font-bold">Generated Worksheet</h3>
            {generatedWorksheet && (
              <div className="flex gap-2">
                <button className="text-sm text-accent hover:text-accent-light transition-colors">
                  Download PDF
                </button>
                <button className="text-sm text-accent hover:text-accent-light transition-colors">
                  Print
                </button>
              </div>
            )}
          </div>

          {!generatedWorksheet && !isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="text-6xl mb-4">📄</div>
                <p className="text-gray-400">Your generated worksheet will appear here</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Analyzing content and generating worksheet...</p>
              </div>
            </div>
          )}

          {generatedWorksheet && (
            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6 max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                {generatedWorksheet}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
