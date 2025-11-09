import { useState } from 'react';

interface GameGeneratorProps {
  onBack: () => void;
}

const GAME_TYPES = [
  { id: 'quiz', label: 'Quiz Game', icon: '❓', description: 'Multiple choice questions' },
  { id: 'word-match', label: 'Word Match', icon: '🔤', description: 'Match words to definitions' },
  { id: 'crossword', label: 'Crossword', icon: '📝', description: 'Interactive crossword puzzle' },
  { id: 'memory', label: 'Memory Game', icon: '🧠', description: 'Match pairs of cards' }
];

const GRADE_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function GameGenerator({ onBack }: GameGeneratorProps) {
  const [gameType, setGameType] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [topicTheme, setTopicTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    await new Promise(resolve => setTimeout(resolve, 2500));

    const selectedGame = GAME_TYPES.find(g => g.id === gameType);

    let gameContent = `# ${selectedGame?.label}: ${topicTheme}
## Grade ${gradeLevel} Educational Game

---

`;

    if (gameType === 'quiz') {
      gameContent += `## QUIZ GAME INSTRUCTIONS

**Setup:**
- Display questions one at a time
- Students can work individually or in teams
- Keep score on the board
- Award points for correct answers

**Game Rules:**
- Each question has 4 options (A, B, C, D)
- Students have 30 seconds to answer
- Correct answer = 10 points
- No penalty for wrong answers

---

### QUESTION 1
**What is the main concept of ${topicTheme}?**

A) First possible answer related to the topic
B) Second possible answer with details
C) Correct answer that explains the concept accurately
D) Fourth option as distractor

**CORRECT ANSWER: C**
*Explanation: Brief explanation of why C is correct and how it relates to ${topicTheme}.*

---

### QUESTION 2
**Which of the following best describes ${topicTheme}?**

A) Description option one
B) Correct comprehensive description
C) Partial description option
D) Incorrect description

**CORRECT ANSWER: B**
*Explanation: Detailed reasoning for the correct answer.*

---

### QUESTION 3
**In the context of ${topicTheme}, what happens when...?**

A) First scenario outcome
B) Second scenario outcome
C) Third scenario outcome
D) Correct scenario outcome

**CORRECT ANSWER: D**
*Explanation: Step-by-step explanation of the correct process.*

---

### QUESTION 4
**True or False: Statement about ${topicTheme}**

A) True - with reasoning
B) False - because of specific reason
C) Partially true but incomplete
D) Correct answer with full explanation

**CORRECT ANSWER: A**
*Explanation: Why this statement is true and its significance.*

---

### QUESTION 5
**Apply your knowledge: Real-world scenario about ${topicTheme}**

A) Solution approach one
B) Solution approach two
C) Correct comprehensive solution
D) Incomplete solution

**CORRECT ANSWER: C**
*Explanation: How to apply the concept in practical situations.*

---

### BONUS QUESTION
**Advanced concept related to ${topicTheme}:**

A) Complex answer option
B) Correct advanced concept explanation
C) Partial understanding
D) Common misconception

**CORRECT ANSWER: B**
*Explanation: Deeper dive into advanced aspects.*

---

**SCORING GUIDE:**
- 60 points: Excellent mastery
- 40-50 points: Good understanding
- 20-30 points: Needs review
- 0-10 points: Requires additional study

**FOLLOW-UP ACTIVITIES:**
- Discuss why wrong answers were incorrect
- Create student-generated questions
- Quiz variations for practice`;

    } else if (gameType === 'word-match') {
      gameContent += `## WORD MATCH GAME

**How to Play:**
1. Create two columns on the board
2. Column A: Terms | Column B: Definitions (shuffled)
3. Students draw lines to match
4. Can be played individually or in teams
5. Time limit: 5 minutes

---

### MATCH THE FOLLOWING:

**COLUMN A - TERMS**

1. Primary Concept of ${topicTheme}
2. Key Process in ${topicTheme}
3. Important Component
4. Related Principle
5. Main Application
6. Secondary Factor
7. Contributing Element
8. Result or Outcome
9. Essential Tool or Method
10. Supporting Theory

---

**COLUMN B - DEFINITIONS**

A. The practical use or implementation in real scenarios
B. The fundamental idea that underlies this entire topic
C. The sequence of steps or actions involved
D. A basic rule or law that governs behavior
E. A crucial part or ingredient of the system
F. An additional element that supports the main concept
G. The final product or consequence of the process
H. A device, technique, or approach used in practice
I. Another aspect that influences the outcome
J. The theoretical framework that explains why it works

---

### ANSWER KEY:

1 - B (Primary Concept matches fundamental idea)
2 - C (Key Process matches sequence of steps)
3 - E (Important Component matches crucial part)
4 - D (Related Principle matches basic rule)
5 - A (Main Application matches practical use)
6 - I (Secondary Factor matches influencing aspect)
7 - F (Contributing Element matches supporting element)
8 - G (Result matches final product)
9 - H (Essential Tool matches technique used)
10 - J (Supporting Theory matches theoretical framework)

---

**VARIATIONS:**

**Easy Mode (Fewer Matches):**
Use only items 1-5 for younger or struggling students

**Challenge Mode:**
- Time limit reduced to 3 minutes
- No word bank, write definitions from memory
- Add 5 more advanced terms

**Team Competition:**
- Teams compete for fastest completion
- Award bonus points for all correct
- Penalty for wrong matches

---

**EXTENSION ACTIVITY:**
Students create their own word-match game with new terms related to ${topicTheme}`;

    } else if (gameType === 'crossword') {
      gameContent += `## CROSSWORD PUZZLE

**Instructions:**
- Complete the crossword using clues about ${topicTheme}
- Write one letter per box
- Use pencil so you can erase mistakes
- Work individually or with a partner

---

### CROSSWORD GRID:

     1     2     3     4     5
   ┌─────┬─────┬─────┬─────┬─────┐
 1 │  ■  │  1→ │  ■  │  2↓ │  ■  │
   ├─────┼─────┼─────┼─────┼─────┤
 2 │  3→ │     │     │     │  ■  │
   ├─────┼─────┼─────┼─────┼─────┤
 3 │  ■  │  4↓ │  ■  │  5→ │     │
   ├─────┼─────┼─────┼─────┼─────┤
 4 │  6→ │     │     │     │     │
   ├─────┼─────┼─────┼─────┼─────┤
 5 │  ■  │  7↓ │  ■  │  8→ │     │
   └─────┴─────┴─────┴─────┴─────┘

---

### CLUES:

**ACROSS:**
1. The main process involved in ${topicTheme} (starts at 1,2)
3. A key component or element (starts at 2,1)
5. The result or outcome of the process (starts at 3,4)
6. Important tool or method used (starts at 4,1)
8. Secondary factor that influences (starts at 5,4)

**DOWN:**
2. Fundamental concept of ${topicTheme} (starts at 1,4)
4. Related principle or rule (starts at 3,2)
7. Supporting theory or idea (starts at 5,2)

---

### WORD BANK (Optional Help):
- PROCESS
- CONCEPT
- OUTCOME
- METHOD
- FACTOR
- PRINCIPLE
- THEORY
- ELEMENT

---

### ANSWER KEY:

**ACROSS:**
1. [Word related to main process - 7-10 letters]
3. [Key component term - 6-8 letters]
5. [Result term - 6-9 letters]
6. [Tool/method term - 5-8 letters]
8. [Factor term - 6-8 letters]

**DOWN:**
2. [Fundamental concept - 7-10 letters]
4. [Principle term - 8-10 letters]
7. [Theory term - 6-9 letters]

---

**DIFFICULTY VARIATIONS:**

**Easier Version:**
- Provide first letter of each word
- Use word bank
- Shorter words only

**Harder Version:**
- No word bank
- More complex vocabulary
- Cryptic clues instead of direct definitions`;

    } else {
      gameContent += `## MEMORY MATCH GAME

**Setup:**
- Create cards with matching pairs
- Cards face down on table
- Shuffle thoroughly
- Arrange in a grid

**Rules:**
- Players take turns flipping 2 cards
- If cards match, player keeps them and goes again
- If no match, cards flip back and next player goes
- Winner has most pairs when all cards are matched

---

### CARD PAIRS (Create These Cards):

**PAIR 1:**
Card A: "Term related to ${topicTheme}"
Card B: "Definition or matching concept"

**PAIR 2:**
Card A: "Second key term"
Card B: "Its corresponding definition"

**PAIR 3:**
Card A: "Important process"
Card B: "Description of that process"

**PAIR 4:**
Card A: "Principle or rule"
Card B: "Explanation of the principle"

**PAIR 5:**
Card A: "Application example"
Card B: "Context where it applies"

**PAIR 6:**
Card A: "Component or element"
Card B: "Its function or purpose"

**PAIR 7:**
Card A: "Related concept"
Card B: "How it connects to ${topicTheme}"

**PAIR 8:**
Card A: "Real-world example"
Card B: "Why this example fits"

**PAIR 9:**
Card A: "Historical context"
Card B: "Significance or impact"

**PAIR 10:**
Card A: "Advanced concept"
Card B: "Detailed explanation"

---

### GAME VARIATIONS:

**Speed Round:**
- Set 5-minute timer
- See how many matches in time limit

**Team Play:**
- Teams of 2-3 players
- Collaborate to remember positions

**Challenge Mode:**
- Add 5 more pairs (15 total)
- Use only related but not identical matches

**Study Mode:**
- Allow students to review all cards first
- Then play memory game to test retention

---

**MATERIALS NEEDED:**
- 20 index cards (or printable cards)
- Markers for writing
- Timer
- Score sheet

**PREPARATION:**
1. Write terms on 10 cards
2. Write definitions on 10 cards
3. Keep matching pairs clear
4. Laminate for durability (optional)

---

**LEARNING BENEFITS:**
- Improves memory and recall
- Reinforces vocabulary
- Encourages active learning
- Builds pattern recognition`;
    }

    gameContent += `

---

**ASSESSMENT NOTES:**
Use this game to assess student understanding of ${topicTheme}. Observe which concepts students struggle with and plan additional lessons accordingly.

**MODIFICATIONS:**
- For visual learners: Add images or diagrams
- For kinesthetic learners: Make it physical/active
- For auditory learners: Read questions aloud
- For advanced students: Add bonus challenges

---

*Generated with Sahayak-AI Game Generator*
*Game Type: ${selectedGame?.label} | Grade: ${gradeLevel} | Topic: ${topicTheme}*`;

    setGeneratedGame(gameContent);
    setIsGenerating(false);
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
      <div className="mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2">
          ← Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold">Game Generator</h2>
        <p className="text-gray-400 mt-2">Create engaging educational games for your classroom</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Game Settings</h3>

          <div className="space-y-6">
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
