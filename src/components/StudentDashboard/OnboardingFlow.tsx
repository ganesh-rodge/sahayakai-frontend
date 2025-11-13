import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, MessageCircle, Map, BookOpen, ArrowLeft } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: { 
    learningGoal: string; 
    experience: string[]; 
    timeCommitment: string;
    skillLevel: string;
    preferredTopics: string[];
    weeksNeeded: number;
  }) => void;
  onBack?: () => void;
}

export default function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [step, setStep] = useState(0); // Start at 0 for field selection
  const [selectedField, setSelectedField] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [experience, setExperience] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [preferredTopics, setPreferredTopics] = useState<string[]>([]);
  const [weeksNeeded, setWeeksNeeded] = useState<number | null>(null);

  // Field definitions with custom questions
  const fields = {
    'Software Development': {
      icon: '💻',
      languages: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Ruby', 'Go', 'Swift', 'Kotlin', 'PHP', 'Rust', 'Dart', 'R', 'MATLAB', 'Scala', 'Perl'],
      topics: ['Web Development', 'Mobile Development', 'Backend Development', 'Frontend Development', 'Full Stack', 'DevOps', 'Cloud Computing', 'API Development', 'Microservices']
    },
    'Data Science & AI': {
      icon: '📊',
      languages: ['Python', 'R', 'SQL', 'Julia', 'MATLAB', 'Scala', 'Java'],
      topics: ['Machine Learning', 'Deep Learning', 'Data Analysis', 'Statistical Modeling', 'Data Visualization', 'Big Data', 'Natural Language Processing', 'Computer Vision', 'Data Engineering']
    },
    'Design': {
      icon: '🎨',
      languages: ['HTML/CSS', 'JavaScript', 'None'],
      topics: ['UI Design', 'UX Design', 'Graphic Design', 'Motion Graphics', 'Product Design', 'Brand Design', 'Web Design', 'Mobile Design', 'Design Systems']
    },
    'Business & Marketing': {
      icon: '📈',
      languages: ['Excel/Spreadsheets', 'SQL', 'Python', 'None'],
      topics: ['Digital Marketing', 'SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Business Analytics', 'Market Research', 'Product Management', 'Sales Strategy', 'Brand Management']
    },
    'Cybersecurity': {
      icon: '🔒',
      languages: ['Python', 'C', 'C++', 'Java', 'JavaScript', 'Bash/Shell', 'PowerShell'],
      topics: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Security Analysis', 'Cryptography', 'Cloud Security', 'Security Operations', 'Incident Response', 'Threat Intelligence']
    },
    'Game Development': {
      icon: '🎮',
      languages: ['C#', 'C++', 'JavaScript', 'Python', 'Lua', 'Java'],
      topics: ['2D Game Development', '3D Game Development', 'Game Design', 'Game Physics', 'Game AI', 'Mobile Games', 'VR/AR Games', 'Multiplayer Games', 'Game Engines']
    },
    'Cloud & DevOps': {
      icon: '☁️',
      languages: ['Python', 'Bash/Shell', 'Go', 'JavaScript', 'YAML', 'PowerShell'],
      topics: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Monitoring & Logging', 'Serverless']
    },
    'Blockchain': {
      icon: '⛓️',
      languages: ['Solidity', 'JavaScript', 'Python', 'Go', 'Rust'],
      topics: ['Smart Contracts', 'DeFi', 'NFTs', 'Blockchain Architecture', 'Cryptocurrency', 'Web3', 'dApps', 'Consensus Mechanisms', 'Blockchain Security']
    },
    'Creative Arts': {
      icon: '🎬',
      languages: ['None'],
      topics: ['Video Editing', '3D Modeling', 'Animation', 'Photography', 'Audio Production', 'Content Creation', 'Digital Art', 'VFX', 'Motion Design']
    },
    'Health & Fitness': {
      icon: '💪',
      languages: ['None'],
      topics: ['Personal Training', 'Nutrition', 'Yoga', 'Fitness Coaching', 'Sports Science', 'Mental Health', 'Wellness', 'Physical Therapy', 'Health Coaching']
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      onComplete({ learningGoal: learningGoal || selectedField, experience, timeCommitment, skillLevel, preferredTopics, weeksNeeded: weeksNeeded || 0 } as any);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFieldSelect = (field: string) => {
    setSelectedField(field);
    setExperience([]);
    setPreferredTopics([]);
    setStep(1);
  };

  const isStepValid = () => {
    if (step === 0) return selectedField.length > 0;
    if (step === 1) return learningGoal.trim().length > 0;
    if (step === 2) return experience.length > 0;
    if (step === 3) return skillLevel.length > 0;
    if (step === 4) return preferredTopics.length > 0;
    if (step === 5) return timeCommitment.length > 0;
    if (step === 6) return typeof weeksNeeded === 'number' && weeksNeeded > 0;
    return false;
  };

  const totalSteps = 7; // Including field selection + weekCommitment
  const progress = (step / (totalSteps - 1)) * 100;
  
  const currentField = fields[selectedField as keyof typeof fields];

  return (
    <div className="min-h-screen bg-dark-primary flex items-center justify-center px-4 py-8">
      {/* Back Button - Top Left */}
      {onBack && (
        <motion.button
          onClick={onBack}
          className="fixed top-6 left-6 p-3 bg-dark-secondary border border-gray-800 rounded-lg hover:bg-dark-tertiary transition-all group z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
        </motion.button>
      )}

      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Sahayak AI</h1>
        </div>

        {/* Progress Bar */}
        {step > 0 && (
          <div className="mb-8">
            <div className="text-center text-sm text-gray-400 mb-4">
              Question {step} of {totalSteps - 1} <span className="text-accent">• {Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-accent-light"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Content Card */}
        <motion.div
          key={step}
          className="bg-dark-secondary rounded-2xl p-8 border border-gray-800"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 0: Field Selection */}
          {step === 0 && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-accent/20 rounded-full">
                  <Target className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Choose Your Field</h2>
              <p className="text-gray-400 text-center mb-8">Select the area you want to learn and grow in</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(fields).map(([field, data]) => (
                    <button
                      key={field}
                      onClick={() => handleFieldSelect(field)}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        selectedField === field
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-dark-tertiary border-gray-700 text-gray-300 hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{data.icon}</span>
                        <span className="font-medium">{field}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Learning Goal */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-accent/20 rounded-full">
                  <Target className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">What's Your Goal?</h2>
              <p className="text-gray-400 text-center mb-8">Tell us what you want to achieve in {selectedField}</p>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  What is your specific learning goal?
                </label>
                <input
                  type="text"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder={
                    selectedField === 'Software Development' ? 'e.g., I want to become a Full Stack Developer' :
                    selectedField === 'Data Science & AI' ? 'e.g., I want to become a Machine Learning Engineer' :
                    selectedField === 'Design' ? 'e.g., I want to become a UI/UX Designer' :
                    selectedField === 'Business & Marketing' ? 'e.g., I want to become a Digital Marketing Expert' :
                    selectedField === 'Cybersecurity' ? 'e.g., I want to become an Ethical Hacker' :
                    selectedField === 'Game Development' ? 'e.g., I want to create my own indie game' :
                    selectedField === 'Cloud & DevOps' ? 'e.g., I want to become a Cloud Architect' :
                    selectedField === 'Blockchain' ? 'e.g., I want to develop smart contracts' :
                    selectedField === 'Creative Arts' ? 'e.g., I want to become a professional video editor' :
                    'e.g., I want to become a certified fitness trainer'
                  }
                  className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors text-white"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Experience/Tools */}
          {step === 2 && currentField && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-accent/20 rounded-full">
                  <MessageCircle className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Your Experience</h2>
              <p className="text-gray-400 text-center mb-8">
                {selectedField.includes('Development') || selectedField.includes('Data Science') || selectedField.includes('Cybersecurity') || selectedField.includes('Blockchain')
                  ? 'Which languages/tools are you already familiar with?'
                  : selectedField === 'Design'
                  ? 'Which design tools have you used?'
                  : selectedField === 'Business & Marketing'
                  ? 'Which tools/platforms have you used?'
                  : 'What experience do you already have?'}
              </p>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Select all that apply
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentField.languages.concat(['None']).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        if (lang === 'None') {
                          setExperience(['None']);
                        } else {
                          setExperience((prev) =>
                            prev.includes(lang)
                              ? prev.filter((l) => l !== lang && l !== 'None')
                              : prev.filter((l) => l !== 'None').concat(lang)
                          );
                        }
                      }}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        experience.includes(lang)
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-dark-tertiary border-gray-700 text-gray-300 hover:border-accent/50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skill Level */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-accent/20 rounded-full">
                  <Target className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Your Skill Level</h2>
              <p className="text-gray-400 text-center mb-8">How would you rate your current programming skills?</p>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Select your level
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { value: 'beginner', label: 'Beginner', desc: 'Just starting my coding journey' },
                    { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with basic concepts' },
                    { value: 'advanced', label: 'Advanced', desc: 'Experienced with multiple languages' },
                    { value: 'expert', label: 'Expert', desc: 'Professional developer' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSkillLevel(option.value)}
                      className={`px-4 py-4 rounded-lg border transition-all text-left ${
                        skillLevel === option.value
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-dark-tertiary border-gray-700 text-gray-300 hover:border-accent/50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferred Topics */}
          {step === 4 && currentField && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-accent/20 rounded-full">
                  <BookOpen className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Areas of Interest</h2>
              <p className="text-gray-400 text-center mb-8">Which topics in {selectedField} would you like to focus on?</p>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Select all that interest you
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentField.topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setPreferredTopics((prev) =>
                          prev.includes(topic)
                            ? prev.filter((t) => t !== topic)
                            : prev.concat(topic)
                        );
                      }}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        preferredTopics.includes(topic)
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-dark-tertiary border-gray-700 text-gray-300 hover:border-accent/50'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Time Commitment */}
          {step === 5 && (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-accent/20 rounded-full">
                  <Map className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Time Commitment</h2>
              <p className="text-gray-400 text-center mb-8">How much time can you dedicate to learning per week?</p>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Select your availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: '1-5', label: '1-5 hours/week', desc: 'Light learning pace' },
                    { value: '5-10', label: '5-10 hours/week', desc: 'Moderate commitment' },
                    { value: '10-20', label: '10-20 hours/week', desc: 'Serious learner' },
                    { value: '20+', label: '20+ hours/week', desc: 'Intensive study' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeCommitment(option.value)}
                      className={`px-4 py-4 rounded-lg border transition-all text-left ${
                        timeCommitment === option.value
                          ? 'bg-accent/20 border-accent text-accent'
                          : 'bg-dark-tertiary border-gray-700 text-gray-300 hover:border-accent/50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

                  {/* Step 6: Weeks Needed (number input) */}
                  {step === 6 && (
                    <div>
                      <div className="flex items-center justify-center mb-6">
                        <div className="p-4 bg-accent/20 rounded-full">
                          <Map className="w-8 h-8 text-accent" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-center mb-2">How Many Weeks?</h2>
                      <p className="text-gray-400 text-center mb-8">Enter how many weeks you expect it will take to reach this learning goal.</p>

                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-300">Number of weeks</label>
                        <input
                          type="number"
                          min={1}
                          value={weeksNeeded ?? ''}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (Number.isNaN(v) || v <= 0) setWeeksNeeded(null);
                            else setWeeksNeeded(v);
                          }}
                          placeholder="e.g., 12"
                          className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors text-white"
                        />
                        <p className="text-xs text-gray-500">Tip: choose realistic weeks based on your time commitment.</p>
                      </div>
                    </div>
                  )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 bg-dark-tertiary text-gray-300 border border-gray-700 rounded-lg font-medium hover:bg-dark-primary transition-all"
              >
                Previous
              </button>
            )}
            {step === 0 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-accent to-accent-light text-dark-primary hover:shadow-lg hover:shadow-accent/30'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-accent to-accent-light text-dark-primary hover:shadow-lg hover:shadow-accent/30'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {step === 5 ? 'Create Roadmap' : 'Next'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
