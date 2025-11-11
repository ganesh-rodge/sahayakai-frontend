import { useState } from 'react';

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

    await new Promise(resolve => setTimeout(resolve, 2500));

    const plan = `# LESSON PLAN
## ${subject} - Grade ${gradeLevel}

**Topic:** ${topic}
**Duration:** ${duration}
**Date:** ${new Date().toLocaleDateString()}

---

## LEARNING OBJECTIVES

By the end of this lesson, students will be able to:
1. Understand the fundamental concepts of ${topic}
2. Apply knowledge through practical examples
3. Demonstrate comprehension through discussion and activities
4. Connect concepts to real-world applications

---

## MATERIALS NEEDED

- Whiteboard and markers
- Student notebooks and writing materials
- Visual aids and diagrams
- Handouts and worksheets
- Digital presentation (optional)

---

## LESSON STRUCTURE

### Introduction (10% of time)
- Greet students and take attendance
- Review previous lesson concepts
- Introduce today's topic: ${topic}
- Share learning objectives with students
- Engage students with a hook or thought-provoking question

### Warm-Up Activity (10% of time)
- Quick brainstorming session about ${topic}
- Activate prior knowledge
- Address any initial questions or concerns
- Set the context for the main lesson

### Main Instruction (40% of time)

**Part 1: Direct Instruction**
- Present core concepts of ${topic}
- Use visual aids and examples
- Break down complex ideas into manageable parts
- Check for understanding regularly

**Part 2: Guided Practice**
- Work through examples together
- Encourage student participation
- Address misconceptions immediately
- Provide scaffolding as needed

**Part 3: Independent Practice**
- Students work on problems individually
- Circulate and provide support
- Monitor progress and understanding
- Offer differentiated support

### Activities & Discussion (25% of time)

**Group Activity:**
Students work in pairs or small groups to:
- Discuss key concepts
- Solve problems collaboratively
- Create presentations or projects
- Share findings with the class

**Class Discussion:**
- Review key takeaways
- Address questions and clarifications
- Connect to real-world applications
- Encourage critical thinking

### Assessment & Closure (15% of time)

**Formative Assessment:**
- Quick quiz or exit ticket
- Think-Pair-Share activity
- Thumbs up/down understanding check
- Q&A session

**Lesson Closure:**
- Summarize main points
- Review learning objectives achieved
- Preview next lesson
- Assign homework (if applicable)

---

## DIFFERENTIATION STRATEGIES

**For Advanced Learners:**
- Provide extension activities
- Offer more challenging problems
- Encourage deeper research

**For Struggling Learners:**
- Provide additional scaffolding
- Offer simplified explanations
- Use visual aids and manipulatives
- Allow extra time for practice

**For English Language Learners:**
- Use visual aids extensively
- Provide vocabulary support
- Allow peer collaboration
- Offer bilingual resources when possible

---

## ASSESSMENT METHODS

**During Lesson:**
- Observation of student participation
- Questioning and responses
- Formative checks for understanding
- Group work evaluation

**Post Lesson:**
- Review of completed work
- Exit tickets analysis
- Homework review (if assigned)
- Quiz or test results

---

## HOMEWORK/EXTENSION ACTIVITIES

1. Complete practice problems on ${topic}
2. Research real-world applications
3. Prepare questions for next class
4. Optional: Create a visual representation

---

## REFLECTION NOTES

**What worked well:**
[Space for teacher notes]

**What needs improvement:**
[Space for teacher notes]

**Student engagement level:**
[Space for teacher notes]

**Adjustments for next time:**
[Space for teacher notes]

---

## ADDITIONAL RESOURCES

- Textbook pages: [Specify pages]
- Online resources: [List websites]
- Videos: [Educational video links]
- Supplementary materials: [Additional worksheets]

---

**Standards Alignment:**
This lesson aligns with grade-level educational standards for ${subject}.

**Safety Considerations:**
[Note any safety concerns or precautions if applicable]

---

*Generated with Sahayak-AI Lesson Planner*
*Subject: ${subject} | Grade: ${gradeLevel} | Duration: ${duration}*`;

    setGeneratedPlan(plan);
    setIsGenerating(false);
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
          <button onClick={() => {
            const payload = generatedPlan ? { title: `${subject || 'Lesson'} - ${topic || ''}`, content: generatedPlan } : { title: `${subject || 'Lesson'} - ${topic || ''}`, content: { subject, topic, duration, gradeLevel } };
            onSave?.(payload);
            setSavedMsg('Saved');
            setTimeout(() => setSavedMsg(''), 1800);
          }} className="px-4 py-2 rounded-md bg-accent text-dark-primary font-semibold text-sm">Save Work</button>
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
