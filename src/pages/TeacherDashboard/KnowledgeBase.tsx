import { useEffect, useState } from 'react';

interface KnowledgeBaseProps {
  onBack: () => void;
  onSave?: (payload?: any) => void;
}

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese',
  'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian', 'Bengali', 'Tamil',
  'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'
];

const SAMPLE_QUESTIONS = [
  'What is photosynthesis and how does it work?',
  'Explain the Pythagorean theorem with examples',
  'What are the main causes of World War II?',
  'How do neurons transmit signals in the brain?',
  'What is the difference between DNA and RNA?',
  'Explain Newton\'s laws of motion'
];

export default function KnowledgeBase({ onBack, onSave }: KnowledgeBaseProps) {
  const [savedMsg, setSavedMsg] = useState('');
  const [language, setLanguage] = useState('English');
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preload from 'Open' action
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherOpenWork');
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.toolId !== 'knowledge-base') return;
      const c = item.content;
      if (typeof c === 'string') {
        setGeneratedAnswer(c);
      } else if (c && typeof c === 'object') {
        if (c.language) setLanguage(c.language);
        if (c.question) setQuestion(c.question);
      }
    } catch {}
    finally {
      localStorage.removeItem('teacherOpenWork');
    }
  }, []);

  const handleQuestionSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!question.trim()) {
      newErrors.question = 'Please enter a question';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsGenerating(true);
    setErrors({});

    await new Promise(resolve => setTimeout(resolve, 2000));

    const sampleAnswer = `# Answer to: ${question}

## Response in ${language}

### Overview
This is a comprehensive answer to your question about "${question}". Let me break this down into easy-to-understand sections.

### Main Explanation
${question.toLowerCase().includes('what is') || question.toLowerCase().includes('what are')
  ? `The concept you're asking about is fundamental to understanding this subject. Here's a detailed explanation:

1. **Definition**: This refers to the basic principle or concept that forms the foundation of this topic.

2. **Key Components**:
   - First important aspect
   - Second critical element
   - Third essential feature

3. **How it Works**: The process involves several steps that work together systematically to produce the desired outcome.`
  : question.toLowerCase().includes('how')
  ? `Let me explain the process step by step:

**Step 1**: Initial phase where the foundation is established
**Step 2**: Development phase where key changes occur
**Step 3**: Final phase where results are observed

The mechanism involves careful coordination between different elements.`
  : `Here's what you need to know:

The topic relates to several important concepts that are interconnected. Understanding these relationships helps build a complete picture of the subject matter.

**Key Points**:
- First major point with detailed explanation
- Second important consideration
- Third crucial aspect to remember`}

### Practical Examples
Let me provide some real-world examples to illustrate this concept:

**Example 1**: In everyday life, you can observe this when...

**Example 2**: Another common instance is...

**Example 3**: Students often encounter this in...

### Common Misconceptions
Some people mistakenly believe that... However, the actual truth is...

### Related Concepts
This topic connects to:
- Related Topic 1
- Related Topic 2
- Related Topic 3

### Teaching Tips
When explaining this to students:
1. Start with simple analogies they can relate to
2. Use visual aids and diagrams
3. Provide hands-on activities when possible
4. Check understanding frequently

### Further Reading
For deeper understanding, students can explore:
- Additional resource topics
- Extended learning materials
- Practice exercises

---

*Generated with Sahayak-AI Knowledge Base*
*Response Language: ${language}*`;

    setGeneratedAnswer(sampleAnswer);
    setIsGenerating(false);
  };

  const handleSampleClick = (sample: string) => {
    setQuestion(sample);
    setGeneratedAnswer('');
  };

  const handleReset = () => {
    setQuestion('');
    setGeneratedAnswer('');
    setErrors({});
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAnswer);
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
          <h2 className="text-3xl font-bold">Knowledge Base</h2>
          <p className="text-gray-400 mt-2">Get instant AI-powered explanations for any topic</p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && <div className="text-sm text-green-400">{savedMsg}</div>}
          <button
            onClick={() => {
              const payload = generatedAnswer ? { title: `Answer - ${question || 'Query'}`, content: generatedAnswer } : { title: `Answer - ${question || 'Query'}`, content: { language, question } };
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
          <h3 className="text-xl font-bold mb-6">Ask Your Question</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3">Response Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Your Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                rows={6}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors resize-none"
              />
              {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleQuestionSubmit}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating Answer...' : 'Get Answer'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-700 text-gray-400 rounded-lg font-semibold hover:border-accent hover:text-white transition-all"
              >
                Reset
              </button>
            </div>

            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6">
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                <span className="text-accent">✨</span>
                Sample Questions
              </h4>
              <div className="space-y-2">
                {SAMPLE_QUESTIONS.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleClick(sample)}
                    className="w-full text-left px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-accent hover:text-white transition-all"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-accent mb-1">Pro Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Be specific with your questions for better answers</li>
                    <li>• Include context like grade level or subject area</li>
                    <li>• Ask follow-up questions to dive deeper</li>
                    <li>• Use the generated content as teaching material</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Generated Answer</h3>
            {generatedAnswer && (
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1"
                >
                  <span>📋</span> Copy
                </button>
                <button className="text-sm text-accent hover:text-accent-light transition-colors flex items-center gap-1">
                  <span>📄</span> Export
                </button>
              </div>
            )}
          </div>

          {!generatedAnswer && !isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="text-6xl mb-4">🤖</div>
                <h4 className="text-xl font-bold mb-2">AI-Powered Knowledge Base</h4>
                <p className="text-gray-400">Ask any question and get detailed explanations</p>
                <p className="text-sm text-gray-500 mt-2">Your answer will appear here</p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Generating comprehensive answer...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            </div>
          )}

          {generatedAnswer && (
            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6 max-h-[700px] overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                  {generatedAnswer}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
