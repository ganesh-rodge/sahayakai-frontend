import { useEffect, useState } from 'react';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisual, setGeneratedVisual] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    await new Promise(resolve => setTimeout(resolve, 2500));

    const selectedType = VISUAL_AID_TYPES.find(t => t.id === visualType);

    const sampleVisual = `# ${selectedType?.label}: ${description}

## Generated Visual Aid

${visualType === 'diagram' ? `
┌─────────────────────────────────────────────────────────┐
│                    ${description}                        │
│                                                           │
│     ┌──────────────┐                                     │
│     │   Start      │                                     │
│     └──────┬───────┘                                     │
│            │                                              │
│            ▼                                              │
│     ┌──────────────┐                                     │
│     │  Process 1   │────────┐                           │
│     └──────┬───────┘        │                           │
│            │                 │                            │
│            ▼                 ▼                            │
│     ┌──────────────┐  ┌──────────────┐                 │
│     │  Process 2   │  │   Decision   │                  │
│     └──────┬───────┘  └──────┬───────┘                 │
│            │                 │                            │
│            └────────┬────────┘                           │
│                     │                                     │
│                     ▼                                     │
│             ┌──────────────┐                            │
│             │   Process 3  │                             │
│             └──────┬───────┘                            │
│                    │                                      │
│                    ▼                                      │
│             ┌──────────────┐                            │
│             │   End Result │                             │
│             └──────────────┘                            │
└─────────────────────────────────────────────────────────┘

Key Components:
• Start: Initial phase of the process
• Process 1: First major step
• Process 2: Secondary processing
• Decision: Critical decision point
• Process 3: Final processing step
• End Result: Final outcome

Instructions for Use:
1. Print this diagram on A4 or larger paper
2. Use colors to highlight different stages
3. Add student notes around each component
4. Discuss each step with the class
`
: visualType === 'chart' ? `
┌─────────────────────────────────────────────────────────┐
│              ${description}                              │
│                                                           │
│  100% ┤                          ╭───╮                   │
│       │                          │   │                   │
│   80% ┤           ╭───╮          │   │                   │
│       │           │   │          │   │                   │
│   60% ┤   ╭───╮   │   │  ╭───╮  │   │                   │
│       │   │   │   │   │  │   │  │   │                   │
│   40% ┤   │   │   │   │  │   │  │   │   ╭───╮          │
│       │   │   │   │   │  │   │  │   │   │   │          │
│   20% ┤   │   │   │   │  │   │  │   │   │   │          │
│       │   │   │   │   │  │   │  │   │   │   │          │
│    0% └───┴───┴───┴───┴──┴───┴──┴───┴───┴───┴──────────│
│         Cat1  Cat2  Cat3  Cat4  Cat5                     │
└─────────────────────────────────────────────────────────┘

Data Points:
• Category 1: 60% - Significant presence
• Category 2: 80% - High performance
• Category 3: 65% - Above average
• Category 4: 100% - Maximum value
• Category 5: 45% - Moderate level

Analysis:
This chart shows the distribution and comparison across
different categories. Category 4 shows the highest value,
while Category 5 represents the lowest.

Teaching Notes:
- Discuss what each category represents
- Compare relative heights and differences
- Calculate percentages and ratios
- Analyze trends and patterns
`
: visualType === 'map' ? `
┌─────────────────────────────────────────────────────────┐
│              ${description}                              │
│                                                           │
│                    ┌─────────────┐                       │
│                    │ Central     │                       │
│                    │ Concept     │                       │
│                    └──────┬──────┘                       │
│                           │                               │
│         ┌────────────────┼────────────────┐             │
│         │                 │                 │             │
│         ▼                 ▼                 ▼             │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐       │
│   │ Branch 1 │     │ Branch 2 │     │ Branch 3 │       │
│   └────┬─────┘     └────┬─────┘     └────┬─────┘       │
│        │                 │                 │              │
│   ┌────┴────┐       ┌───┴───┐        ┌───┴───┐         │
│   ▼         ▼       ▼       ▼        ▼       ▼          │
│ ┌───┐    ┌───┐   ┌───┐   ┌───┐    ┌───┐   ┌───┐       │
│ │Sub│    │Sub│   │Sub│   │Sub│    │Sub│   │Sub│       │
│ │1.1│    │1.2│   │2.1│   │2.2│    │3.1│   │3.2│       │
│ └───┘    └───┘   └───┘   └───┘    └───┘   └───┘       │
└─────────────────────────────────────────────────────────┘

Concept Hierarchy:

Central Concept: Main topic or theme

Branch 1: First major division
  • Sub-concept 1.1: Detailed aspect
  • Sub-concept 1.2: Related element

Branch 2: Second major division
  • Sub-concept 2.1: Key component
  • Sub-concept 2.2: Supporting idea

Branch 3: Third major division
  • Sub-concept 3.1: Important feature
  • Sub-concept 3.2: Additional detail

Connections:
- All branches connect to the central concept
- Sub-concepts support their parent branches
- Relationships show hierarchy and organization

Usage Guide:
1. Start from the center and work outward
2. Explain each branch's relationship to the center
3. Explore sub-concepts in detail
4. Show connections between branches
`
: `
┌─────────────────────────────────────────────────────────┐
│              ${description}                              │
│                                                           │
│  PAST ←──────────────────────────────────→ PRESENT      │
│                                                           │
│  ▼        ▼        ▼        ▼        ▼        ▼          │
│                                                           │
│ 1900     1920     1940     1960     1980     2000        │
│  │        │        │        │        │        │          │
│  │        │        │        │        │        │          │
│  ●────────●────────●────────●────────●────────●          │
│  │        │        │        │        │        │          │
│Event 1  Event 2  Event 3  Event 4  Event 5  Event 6     │
│                                                           │
└─────────────────────────────────────────────────────────┘

Timeline Events:

📍 Event 1 (1900)
   - Description of what happened
   - Significance and impact
   - Key people involved

📍 Event 2 (1920)
   - Major development or change
   - Consequences and effects
   - Related outcomes

📍 Event 3 (1940)
   - Important milestone
   - Historical context
   - Long-term implications

📍 Event 4 (1960)
   - Critical turning point
   - Changes introduced
   - Lasting effects

📍 Event 5 (1980)
   - Significant progress
   - Innovations or discoveries
   - Impact on future

📍 Event 6 (2000)
   - Recent developments
   - Current relevance
   - Future implications

Context & Analysis:
This timeline shows the progression and development of
events over time. Each point represents a significant
milestone that contributed to the overall narrative.

Teaching Activities:
- Discuss cause and effect between events
- Analyze the time periods between events
- Compare early vs. later developments
- Create additional timeline branches
`}

---

Visual Aid Information:
• Type: ${selectedType?.label}
• Description: ${description}
• Format: ASCII Art / Text-based
• Purpose: Classroom teaching and presentations

Suggested Use:
1. Display on projector or smartboard
2. Print for student handouts
3. Use as discussion starter
4. Adapt for different grade levels
5. Add colors when printing

Customization Tips:
- Add specific labels relevant to your lesson
- Include student names or examples
- Use different colors for emphasis
- Scale size based on classroom needs
- Create interactive versions with movable parts

---

*Generated with Sahayak-AI Visual Aid Generator*`;

    setGeneratedVisual(sampleVisual);
    setIsGenerating(false);
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
            onClick={() => {
              const payload = generatedVisual ? { title: `${visualType || 'Visual Aid'}`, content: generatedVisual } : { title: `${visualType || 'Visual Aid'}`, content: { visualType, description } };
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
          <h3 className="text-xl font-bold mb-6">Visual Aid Settings</h3>

          <div className="space-y-6">
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
