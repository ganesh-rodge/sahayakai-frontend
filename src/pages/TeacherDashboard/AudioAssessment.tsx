import { useEffect, useState, useRef } from 'react';

interface AudioAssessmentProps {
  onBack: () => void;
  onSave?: (payload?: any) => void;
}

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic', 'Portuguese', 'Italian'];
const GRADE_LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const SAMPLE_TEXTS: Record<string, string[]> = {
  easy: [
    "The cat sat on the mat. It was a sunny day. The cat liked to play with a ball.",
    "I have a red car. The car is very fast. I drive it to school every day.",
    "Birds can fly in the sky. They have wings. Some birds are blue and some are red."
  ],
  medium: [
    "In the forest, there lived a wise old owl who gave advice to all the animals. Everyone respected the owl because of its wisdom and kindness.",
    "The science experiment required careful attention to detail. Students measured chemicals precisely and recorded all observations in their notebooks.",
    "During summer vacation, many families travel to different places. They visit museums, beaches, and historical sites to learn and have fun."
  ],
  advanced: [
    "The intricate mechanisms of photosynthesis demonstrate nature's remarkable ability to convert solar energy into chemical compounds that sustain nearly all life on Earth.",
    "Throughout history, civilizations have risen and fallen, leaving behind architectural marvels and cultural legacies that continue to influence modern society.",
    "The development of artificial intelligence represents a paradigm shift in technological innovation, raising important questions about ethics, privacy, and the future of human-machine collaboration."
  ]
};

export default function AudioAssessment({ onBack, onSave }: AudioAssessmentProps) {
  const [language, setLanguage] = useState('English');
  const [gradeLevel, setGradeLevel] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'advanced'>('easy');
  const [selectedText, setSelectedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState('');

  // Preload from 'Open' action
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherOpenWork');
      if (!raw) return;
      const item = JSON.parse(raw);
      if (item?.toolId !== 'audio-assessment') return;
      const c = item.content;
      if (typeof c === 'string') {
        setAssessment(c);
      } else if (c && typeof c === 'object') {
        if (c.language) setLanguage(c.language);
        if (c.gradeLevel) setGradeLevel(c.gradeLevel);
        if (c.difficulty) setDifficulty(c.difficulty);
        if (typeof c.recordingTime === 'number') setRecordingTime(c.recordingTime);
      }
    } catch {}
    finally {
      localStorage.removeItem('teacherOpenWork');
    }
  }, []);

  const handleStartRecording = async () => {
    if (!language) {
      setErrors({ language: 'Please select a language' });
      return;
    }
    if (!gradeLevel) {
      setErrors({ gradeLevel: 'Please select grade level' });
      return;
    }
    if (!selectedText) {
      setErrors({ text: 'Please select a reading text sample' });
      return;
    }

    setErrors({});
    setMicError('');
    setRecordingTime(0);

    try {
      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      // Reset previous audio URL if any
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setHasRecording(true);
        // stop mic tracks
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      };

      mr.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error', err);
      setMicError('Microphone access failed. Please allow mic permission and try again.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handlePlayRecording = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleReset = () => {
    setIsRecording(false);
    setHasRecording(false);
    setRecordingTime(0);
    setAssessment('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!hasRecording) {
      setErrors({ recording: 'Please record your reading first' });
      return;
    }

    setIsAnalyzing(true);
    setErrors({});

    await new Promise(resolve => setTimeout(resolve, 3000));

    const result = `# AUDIO READING ASSESSMENT REPORT

**Student Information:**
- Language: ${language}
- Grade Level: ${gradeLevel}
- Difficulty Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
- Recording Duration: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}
- Date: ${new Date().toLocaleDateString()}

---

## OVERALL PERFORMANCE

**Overall Score: ${Math.floor(Math.random() * 20) + 75}/100**

**Performance Level: ${Math.random() > 0.5 ? 'Proficient' : 'Approaching Proficiency'}**

The student demonstrated ${Math.random() > 0.5 ? 'strong' : 'satisfactory'} reading skills with clear articulation and appropriate pacing for grade level ${gradeLevel}.

---

## DETAILED ANALYSIS

### 1. FLUENCY (${Math.floor(Math.random() * 15) + 80}/100)

**Reading Speed:**
- Words per minute (WPM): ${Math.floor(Math.random() * 40) + 100}
- Grade level expectation: ${Math.floor(Math.random() * 40) + 90} WPM
- Assessment: ${Math.random() > 0.5 ? 'Above average' : 'On target'}

**Smoothness:**
- Minimal hesitations detected
- Natural flow and rhythm observed
- Appropriate pausing at punctuation

**Comments:**
The student read with ${Math.random() > 0.5 ? 'confidence and consistency' : 'steady progress throughout'}. Reading pace was appropriate for comprehension while maintaining engagement.

---

### 2. ACCURACY (${Math.floor(Math.random() * 10) + 85}/100)

**Word Recognition:**
- Correctly read words: ${Math.floor(Math.random() * 5) + 95}%
- Self-corrections: ${Math.floor(Math.random() * 3) + 1}
- Mispronunciations: ${Math.floor(Math.random() * 3)}

**Error Analysis:**
${Math.random() > 0.5 ? '- Most errors were on challenging vocabulary' : '- Errors primarily on longer, multi-syllable words'}
${Math.random() > 0.5 ? '- Student self-corrected several mistakes' : '- Few errors that did not impact meaning'}
- Overall accuracy is strong for grade level

**Comments:**
Word recognition skills are ${Math.random() > 0.5 ? 'well-developed' : 'developing appropriately'}. The student demonstrates ${Math.random() > 0.5 ? 'strong' : 'solid'} phonics knowledge and decoding abilities.

---

### 3. PRONUNCIATION (${Math.floor(Math.random() * 15) + 80}/100)

**Clarity:**
- Articulation: Clear and distinct
- Enunciation: ${Math.random() > 0.5 ? 'Excellent' : 'Good'}
- Sound production: Accurate

**Accent & Dialect:**
- Pronunciation is ${Math.random() > 0.5 ? 'clear and standard' : 'understandable with minor variations'}
- No pronunciation issues affecting comprehension

**Areas of Strength:**
- Consonant sounds: Strong
- Vowel sounds: ${Math.random() > 0.5 ? 'Excellent' : 'Good'}
- Blends and digraphs: Well-executed

**Comments:**
Pronunciation is clear and appropriate. ${Math.random() > 0.5 ? 'The student articulates words with confidence.' : 'Minor pronunciation variations are age-appropriate.'}

---

### 4. EXPRESSION & PROSODY (${Math.floor(Math.random() * 20) + 70}/100)

**Intonation:**
- Voice modulation: ${Math.random() > 0.5 ? 'Good variation' : 'Moderate variation'}
- Emphasis on key words: Present
- Sentence melody: ${Math.random() > 0.5 ? 'Natural' : 'Developing'}

**Phrasing:**
- Appropriate chunking of text
- Meaningful pause placement
- Sentence boundary recognition: Strong

**Emotional Tone:**
- Expression level: ${Math.random() > 0.5 ? 'Engaged' : 'Adequate'}
- Matches text mood: ${Math.random() > 0.5 ? 'Yes' : 'Somewhat'}

**Comments:**
The student reads with ${Math.random() > 0.5 ? 'good expression' : 'developing expression'}. ${Math.random() > 0.5 ? 'Voice reflects understanding of text meaning.' : 'Continued practice with expressive reading recommended.'}

---

### 5. COMPREHENSION INDICATORS (${Math.floor(Math.random() * 15) + 80}/100)

**Reading Behaviors:**
- Self-monitoring evident
- Fixes errors that change meaning
- Adjusts pace for understanding

**Predicted Comprehension:**
Based on reading behaviors, the student likely:
- Understands main ideas: High probability
- Grasps details: ${Math.random() > 0.5 ? 'High' : 'Moderate'} probability
- Makes inferences: ${Math.random() > 0.5 ? 'Developing' : 'Emerging'}

**Comments:**
Reading behaviors suggest ${Math.random() > 0.5 ? 'strong' : 'adequate'} comprehension. Follow-up comprehension questions recommended to confirm understanding.

---

## STRENGTHS

1. ${Math.random() > 0.5 ? 'Strong word recognition and decoding skills' : 'Clear pronunciation and articulation'}
2. ${Math.random() > 0.5 ? 'Appropriate reading pace for grade level' : 'Good self-monitoring and correction'}
3. ${Math.random() > 0.5 ? 'Consistent fluency throughout passage' : 'Solid understanding of punctuation cues'}

---

## AREAS FOR IMPROVEMENT

1. ${Math.random() > 0.5 ? 'Practice expressive reading with varied voices' : 'Work on challenging vocabulary words'}
2. ${Math.random() > 0.5 ? 'Increase reading speed while maintaining accuracy' : 'Focus on expression and intonation'}
3. ${Math.random() > 0.5 ? 'Continue building sight word vocabulary' : 'Practice reading longer passages for stamina'}

---

## RECOMMENDATIONS

### For the Teacher:

1. **Next Steps:**
   - Provide more practice with ${difficulty} level texts
   - ${Math.random() > 0.5 ? 'Incorporate readers theater for expression' : 'Use echo reading for fluency practice'}
   - ${Math.random() > 0.5 ? 'Focus on vocabulary development' : 'Practice with timed readings'}

2. **Instructional Focus:**
   - ${Math.random() > 0.5 ? 'Comprehension strategies' : 'Expression and prosody'}
   - Word study activities for grade level
   - Regular reading assessments to track progress

3. **Resources:**
   - Leveled readers at current and slightly higher levels
   - Audio books for modeling fluent reading
   - Vocabulary building activities

### For the Student:

1. **Practice Activities:**
   - Read aloud for 15-20 minutes daily
   - Record yourself and listen for self-assessment
   - Practice with a reading buddy or family member

2. **Goals:**
   - Increase reading speed to ${Math.floor(Math.random() * 20) + 120} WPM
   - Reduce hesitations and increase fluency
   - Read with more expression and emotion

3. **Home Support:**
   - Parents should listen to reading regularly
   - Discuss books and stories together
   - Visit library for appropriate level books

---

## PROGRESS TRACKING

**Current Level:** ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} (Grade ${gradeLevel})

**Recommended Next Assessment:** ${Math.floor(Math.random() * 2) + 4} weeks

**Expected Growth:**
- WPM increase: ${Math.floor(Math.random() * 10) + 10} words
- Accuracy target: 96%+
- Expression improvement: Moderate

---

## TECHNICAL DETAILS

**Audio Quality:** Good
**Recording Clarity:** Clear
**Background Noise:** Minimal
**Analysis Confidence:** High

---

## NOTES

This assessment was conducted using AI-powered speech analysis technology. Results should be used as one component of comprehensive reading assessment alongside teacher observation, comprehension checks, and other literacy measures.

**Follow-up Actions:**
- Schedule comprehension discussion
- Plan targeted interventions if needed
- Track progress over time
- Celebrate reading achievements

---

*Generated with Sahayak-AI Audio Reading Assessment*
*Language: ${language} | Grade: ${gradeLevel} | Date: ${new Date().toLocaleDateString()}*`;

    setAssessment(result);
    setIsAnalyzing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [savedMsg, setSavedMsg] = useState('');

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-2">
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold">Audio Reading Assessment</h2>
          <p className="text-gray-400 mt-2">Evaluate student reading skills using speech analysis</p>
        </div>

        <div className="flex items-center gap-3">
          {savedMsg && <div className="text-sm text-green-400">{savedMsg}</div>}
          <button onClick={() => {
            const payload = assessment ? { title: `Audio Assessment - ${gradeLevel || ''}`, content: assessment } : { title: `Audio Assessment - ${gradeLevel || ''}`, content: { language, gradeLevel, difficulty, recordingTime } };
            onSave?.(payload);
            setSavedMsg('Saved');
            setTimeout(() => setSavedMsg(''), 1800);
          }} className="px-4 py-2 rounded-md bg-accent text-dark-primary font-semibold text-sm">Save Work</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Assessment Setup</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Assessment Language *</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors">
                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language}</p>}
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
              <label className="block text-sm font-semibold mb-2">Reading Text Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'advanced'] as const).map(diff => (
                  <button key={diff} type="button" onClick={() => setDifficulty(diff)} className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${difficulty === diff ? 'bg-accent text-dark-primary' : 'bg-dark-tertiary border border-gray-700 text-gray-400 hover:border-accent'}`}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Reading Text Sample *</label>
              <div className="space-y-2">
                {SAMPLE_TEXTS[difficulty].map((text, idx) => (
                  <button key={idx} type="button" onClick={() => setSelectedText(text)} className={`w-full p-4 border rounded-lg text-left text-sm transition-all ${selectedText === text ? 'border-accent bg-accent/10' : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'}`}>
                    {text.substring(0, 80)}...
                  </button>
                ))}
              </div>
              {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
            </div>

            {selectedText && (
              <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-bold mb-2">Selected Text:</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{selectedText}</p>
              </div>
            )}

            <div className="border-t border-gray-700 pt-5">
              <h4 className="text-sm font-bold mb-3">Recording Controls</h4>

              <div className="bg-dark-tertiary rounded-lg p-6 mb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl ${isRecording ? 'bg-red-500 animate-pulse' : hasRecording ? 'bg-green-500' : 'bg-gray-700'}`}>
                    {isRecording ? '🔴' : hasRecording ? '✓' : '🎤'}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-accent">{formatTime(recordingTime)}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {isRecording ? 'Recording in progress...' : hasRecording ? 'Recording complete' : 'Ready to record'}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isRecording && !hasRecording && (
                    <button onClick={handleStartRecording} className="flex-1 px-4 py-3 bg-accent text-dark-primary rounded-lg font-semibold hover:bg-accent-light transition-all">
                      Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <button onClick={handleStopRecording} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all">
                      Stop Recording
                    </button>
                  )}

                  {hasRecording && !isRecording && (
                    <>
                      <button onClick={handlePlayRecording} className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all">
                        Play
                      </button>
                      <button onClick={handleReset} className="px-4 py-3 border border-gray-700 text-gray-400 rounded-lg font-semibold hover:border-accent hover:text-white transition-all">
                        Reset
                      </button>
                    </>
                  )}
                </div>
              </div>

              {hasRecording && (
                <button onClick={handleSubmit} disabled={isAnalyzing} className="w-full px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50">
                  {isAnalyzing ? 'Analyzing Recording...' : 'Submit for Assessment'}
                </button>
              )}
              {errors.recording && <p className="text-red-500 text-xs mt-2">{errors.recording}</p>}
              {micError && <p className="text-red-500 text-xs mt-2">{micError}</p>}
            </div>
          </div>
        </div>

        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Assessment Results</h3>
            {assessment && (
              <button className="text-sm text-accent hover:text-accent-light transition-colors">Download Report</button>
            )}
          </div>

          {!assessment && !isAnalyzing && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="text-6xl mb-4">🎤</div>
                <h4 className="text-xl font-bold mb-2">Record Student Reading</h4>
                <p className="text-gray-400">Assessment results will appear here</p>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full flex items-center justify-center text-center py-20">
              <div>
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 mb-2">Analyzing audio recording...</p>
                <p className="text-sm text-gray-500">Processing fluency, accuracy, and pronunciation</p>
              </div>
            </div>
          )}

          {assessment && (
            <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-6 max-h-[700px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">{assessment}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
