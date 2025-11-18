import { useEffect, useState } from 'react';
import { postJSON } from '../../utils/api';
import { stripStars } from '../../utils/sanitize';

interface GameGeneratorProps {
  onBack: () => void;
  onSave?: (payload?: any) => void;
}

const GAME_TYPES = [
  { id: 'quiz', label: 'Quiz Game', icon: '❓', description: 'Multiple choice questions' },
  { id: 'word-match', label: 'Word Match', icon: '🔤', description: 'Match words to definitions' },
  { id: 'crossword', label: 'Crossword', icon: '📝', description: 'Interactive crossword puzzle' },
  { id: 'memory', label: 'Memory Game', icon: '🧠', description: 'Match pairs of cards' }
];

const GRADE_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function GameGenerator({ onBack: _onBack, onSave }: GameGeneratorProps) {
  const [savedMsg, setSavedMsg] = useState('');
  const [gameType, setGameType] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [topicTheme, setTopicTheme] = useState('');
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [apiStatus, setApiStatus] = useState<number | null>(null);

  // Preload from 'Open' action
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherOpenWork');
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.toolId !== 'game-generator') return;
      const c = item.content;
      if (typeof c === 'string') {
        setGeneratedGame(c);
      } else if (c && typeof c === 'object') {
        if (c.gameType) setGameType(c.gameType);
        if (c.gradeLevel) setGradeLevel(c.gradeLevel);
        if (c.topicTheme) setTopicTheme(c.topicTheme);
      }
    } catch {}
    finally {
      localStorage.removeItem('teacherOpenWork');
    }
  }, []);

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {};

    if (!gameType) newErrors.gameType = 'Please select a game type';
    if (!gradeLevel) newErrors.gradeLevel = 'Please select grade level';
    if (!topicTheme.trim()) newErrors.topicTheme = 'Please enter a topic or theme';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);
    setErrors({});
    setApiError('');
    setApiStatus(null);

    try {
      const toDisplayText = (v: any): string => {
        if (v == null) return '';
        if (typeof v === 'string') return v;
        if (Array.isArray(v)) return v.map(toDisplayText).join('\n');
        if (typeof v === 'object') {
          if (typeof (v as any).description === 'string') return (v as any).description;
          if (typeof (v as any).content === 'string') return (v as any).content;
          if (typeof (v as any).text === 'string') return (v as any).text;
          return JSON.stringify(v, null, 2);
        }
        return String(v);
      };
      const selectedGame = GAME_TYPES.find(g => g.id === gameType);
      const apiGameTypeLabel = (selectedGame?.label || gameType).toLowerCase();
      const resp = await postJSON('/teacher/game/generate', {
        // Backend expects one of: "quiz game", "word match", "crossword", "memory game"
        gameType: apiGameTypeLabel,
        gradeLevel,
        topic: topicTheme,
        language: language.toLowerCase(),
      });
      const payload = (resp?.data && (resp.data.data || resp.data)) || resp;
      let text =
        payload?.generatedText ||
        payload?.gameText ||
        payload?.description ||
        payload?.content ||
        payload?.result ||
        payload?.text ||
        payload?.game?.description ||
        '';
      if (!text) {
        text = toDisplayText(payload);
      }
      if (!text) {
        setApiError('No game content returned from server');
        setApiStatus((resp as any)?.status ?? null);
        setGeneratedGame('');
        try { console.warn('Game generate: unexpected response shape', resp); } catch {}
      } else {
        setGeneratedGame(stripStars(text));
      }
    } catch (e: any) {
      const msg = e?.message || 'Failed to generate game';
      setApiError(msg);
      setApiStatus(e?.status ?? null);
      setGeneratedGame('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGameType('');
    setGradeLevel('');
    setTopicTheme('');
    setGeneratedGame('');
    setErrors({});
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Game Generator</h2>
          <p className="text-gray-400 mt-2">Create engaging educational games for your classroom</p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && <div className="text-sm text-green-400">{savedMsg}</div>}
          <button
            onClick={async () => {
              const title = `${GAME_TYPES.find(g=>g.id===gameType)?.label || 'Game'} - ${topicTheme || ''}`.trim();
              const payloadLocal = generatedGame
                ? { title, content: generatedGame }
                : { title, content: { gameType, gradeLevel, topicTheme } };

              // Keep existing local callback behavior
              try { onSave?.(payloadLocal); } catch {}

              // Persist to backend Game endpoint
              try {
                const selectedGame = GAME_TYPES.find(g => g.id === gameType);
                const apiGameType = (selectedGame?.label || gameType).toLowerCase();
                await postJSON('/teacher/game/', {
                  gameType: apiGameType,
                  gradeLevel,
                  topic: topicTheme,
                  language: language.toLowerCase(),
                  game: {
                    title: title || 'Game',
                    description: generatedGame || '',
                  },
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
          <h3 className="text-xl font-bold mb-6">Game Settings</h3>

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
              <label className="block text-sm font-semibold mb-3">Game Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {GAME_TYPES.map(game => (
                  <button key={game.id} type="button" onClick={() => setGameType(game.id)} className={`p-4 border-2 rounded-lg transition-all text-left ${gameType === game.id ? 'border-accent bg-accent/10' : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'}`}>
                    <div className="text-2xl mb-2">{game.icon}</div>
                    <div className="text-sm font-bold mb-1">{game.label}</div>
                    <div className="text-xs text-gray-400">{game.description}</div>
                  </button>
                ))}
              </div>
              {errors.gameType && <p className="text-red-500 text-xs mt-1">{errors.gameType}</p>}
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

            <div>
              <label className="block text-sm font-semibold mb-2">Topic / Theme *</label>
              <textarea value={topicTheme} onChange={(e) => setTopicTheme(e.target.value)} placeholder="e.g., Solar System, Multiplication Tables, American Revolution" rows={4} className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors resize-none" />
              {errors.topicTheme && <p className="text-red-500 text-xs mt-1">{errors.topicTheme}</p>}
            </div>

            <div className="flex gap-3">
              <button onClick={handleGenerate} disabled={isGenerating} className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50">
                {isGenerating ? 'Creating Game...' : 'Generate Game'}
              </button>
              <button onClick={handleReset} className="px-6 py-3 border border-gray-700 text-gray-400 rounded-lg font-semibold hover:border-accent hover:text-white transition-all">
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Generated Game</h3>
            {generatedGame && (
              <button className="text-sm text-accent hover:text-accent-light transition-colors">Print</button>
            )}
          </div>

          {apiError && (
            <div className="mb-4 text-sm text-red-400">
              {apiStatus === 401 ? (
                <div>
                  <div className="mb-2">You are not logged in. Please sign in to generate games.</div>
                  <a href="/#login-teacher" className="text-accent hover:text-accent-light underline">Go to Teacher Login</a>
                </div>
              ) : (
                apiError
              )}
            </div>
          )}

          {!generatedGame && !isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-gray-400">Your game will appear here</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Creating your game...</p>
              </div>
            </div>
          )}

          {generatedGame && (
            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6 max-h-[700px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">{generatedGame}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
