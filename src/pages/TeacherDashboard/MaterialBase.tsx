import { useState } from 'react';

interface MaterialBaseProps {
  onBack: () => void;
}

const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function MaterialBase({ onBack }: MaterialBaseProps) {
  const [gradeLevel, setGradeLevel] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setErrors({});

    await new Promise(resolve => setTimeout(resolve, 2500));

    const sampleWorksheet = `# Worksheet - Grade ${gradeLevel}
## Based on Uploaded Material

---

### Section A: Understanding (10 marks)

1. Read the content from the textbook page carefully and answer the following:

   a) What is the main topic discussed in this page?
   __________________________________________________________________

   b) List three key points you learned:
   - _________________________________________________________________
   - _________________________________________________________________
   - _________________________________________________________________

2. Define the following terms in your own words:

   a) _________________________________________________________________

   b) _________________________________________________________________

---

### Section B: Application (10 marks)

3. Based on what you read, explain how this concept applies to real life:

   __________________________________________________________________
   __________________________________________________________________
   __________________________________________________________________
   __________________________________________________________________

4. Draw a diagram or flowchart to represent the concept:

   [Space for diagram]

---

### Section C: Critical Thinking (10 marks)

5. What questions do you still have about this topic?

   __________________________________________________________________
   __________________________________________________________________

6. How would you explain this concept to a friend? Write a short paragraph:

   __________________________________________________________________
   __________________________________________________________________
   __________________________________________________________________
   __________________________________________________________________

---

### Section D: Practice Problems (10 marks)

7. Solve the following based on the textbook content:

   Problem 1:
   __________________________________________________________________

   Problem 2:
   __________________________________________________________________

   Problem 3:
   __________________________________________________________________

---

**Total Marks: 40**

**Teacher's Notes:**
This worksheet has been automatically generated to match Grade ${gradeLevel} comprehension level.
Adjust difficulty as needed for individual students.

---

Generated with Sahayak-AI Material Base`;

    setGeneratedWorksheet(sampleWorksheet);
    setIsGenerating(false);
  };

  const handleReset = () => {
    setGradeLevel('');
    setUploadedFile(null);
    setPreviewUrl('');
    setGeneratedWorksheet('');
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
          <h2 className="text-3xl font-bold">Material Base</h2>
          <p className="text-gray-400 mt-2">Transform textbook pages into interactive worksheets</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-dark-secondary border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Upload & Configure</h3>

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
