import { useState, useEffect } from 'react';
import type { TeacherPage4Data } from '../TeacherSignup';
import { INDIAN_COLLEGES } from '../../utils/indianColleges';

interface Page4Props {
  onBack: () => void;
  onComplete: (data: TeacherPage4Data) => void;
}

const SCHOOL_GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const COLLEGE_STREAMS = ['Science', 'Commerce', 'Arts', 'Engineering'];
const BRANCHES = ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics', 'Information Technology', 'Biotechnology'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

export default function TeacherSignupPage4({ onBack, onComplete }: Page4Props) {
  const [institutionType, setInstitutionType] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionNameOther, setInstitutionNameOther] = useState('');
  const [colleges, setColleges] = useState<string[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [stream, setStream] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const [courseInput, setCourseInput] = useState('');
  const [certifications, setCertifications] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [otherLanguage, setOtherLanguage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleGrade = (grade: string) => {
    setGrades(prev => prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]);
  };

  const toggleLanguage = (lang: string) => {
    setLanguages(prev => {
      if (prev.includes(lang)) {
        // if removing 'Other', also clear the otherLanguage input
        if (lang === 'Other') setOtherLanguage('');
        return prev.filter(l => l !== lang);
      }
      return [...prev, lang];
    });
  };

  const addSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput('');
      setErrors(prev => ({ ...prev, subjects: '' }));
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const addCourse = () => {
    if (courseInput.trim() && !courses.includes(courseInput.trim())) {
      setCourses([...courses, courseInput.trim()]);
      setCourseInput('');
      setErrors(prev => ({ ...prev, courses: '' }));
    }
  };

  const removeCourse = (course: string) => {
    setCourses(courses.filter(c => c !== course));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!institutionType) newErrors.institutionType = 'Please select institution type';
    const finalInstitutionName = institutionType === 'college' && institutionName === 'Other (not listed)'
      ? institutionNameOther.trim()
      : institutionName.trim();
    if (!finalInstitutionName) newErrors.institutionName = 'Institution name is required';
    if (subjects.length === 0) newErrors.subjects = 'Please add at least one subject';
    if (courses.length === 0) newErrors.courses = 'Please add at least one course';
    // Handle 'Other' language: require the user to enter the custom language and replace 'Other' with it
    let finalLanguages = [...languages];
    if (finalLanguages.includes('Other')) {
      if (!otherLanguage.trim()) {
        newErrors.otherLanguage = 'Please enter the other language';
      } else {
        finalLanguages = finalLanguages.map(l => l === 'Other' ? otherLanguage.trim() : l);
      }
    }

    if (finalLanguages.length === 0) newErrors.languages = 'Please select at least one language';

    if (institutionType === 'school' && grades.length === 0) {
      newErrors.grades = 'Please select at least one grade';
    }

    if (institutionType === 'college') {
      if (!stream) newErrors.stream = 'Please select stream';
      if (!branch) newErrors.branch = 'Please select branch';
      if (!year) newErrors.year = 'Please select year';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onComplete({
      institutionType,
      institutionName: finalInstitutionName,
      ...(institutionType === 'school' && { grades: grades.join(',') }),
      ...(institutionType === 'college' && { stream, branch, year }),
      subjects,
      courses,
      certifications,
      languages: finalLanguages
    });
  };

  useEffect(() => {
    let mounted = true;
    fetch('/data/india_institutions.json')
      .then(res => res.json())
      .then((data) => {
        if (!mounted) return;
        setColleges(Array.isArray(data.colleges) && data.colleges.length ? data.colleges : INDIAN_COLLEGES);
        setSchools(Array.isArray(data.schools) ? data.schools : []);
      })
      .catch(() => {
        if (!mounted) return;
        setColleges(INDIAN_COLLEGES);
        setSchools(['Delhi Public School', 'Kendriya Vidyalaya', "St. Xavier's High School", 'Other (not listed)']);
      });
    return () => { mounted = false; };
  }, []);

  const COMMON_LANGUAGES = ['English', 'Hindi', 'Marathi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Other'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20 animate-fadeIn">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors hover:scale-110"
      >
        ← Back
      </button>

      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
            <div className="flex items-center gap-2 justify-center mb-4">
            <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">School/College Details</h1>
          <p className="text-gray-400">Step 4 of 4: Complete your profile</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-accent/30 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 rounded-full bg-accent/30 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 rounded-full bg-accent/30 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 rounded-full bg-accent text-dark-primary flex items-center justify-center font-bold text-sm">4</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-dark-secondary p-8 rounded-lg border border-gray-800">
          <div>
            <label className="block text-sm font-semibold mb-3">Institution Type *</label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setInstitutionType('school'); setStream(''); setBranch(''); setYear(''); }}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  institutionType === 'school'
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'
                }`}
              >
                <div className="text-2xl mb-2">🏫</div>
                <h3 className="font-bold mb-1">School</h3>
                <p className="text-xs text-gray-400">Classes 1-12</p>
              </button>
              <button
                type="button"
                onClick={() => { setInstitutionType('college'); setGrades([]); }}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  institutionType === 'college'
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'
                }`}
              >
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="font-bold mb-1">College/University</h3>
                <p className="text-xs text-gray-400">Higher Education</p>
              </button>
            </div>
            {errors.institutionType && <p className="text-red-500 text-xs mt-2">{errors.institutionType}</p>}
          </div>

          {institutionType && (
            <div className="animate-fadeInUp space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Institution Name *</label>
                {institutionType === 'college' ? (
                  <>
                    <select
                      id="teacherInstitutionNameCollege"
                      aria-label="College/University name"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                      <option value="">Select your college/university</option>
                      {colleges.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                      {colleges.indexOf('Other (not listed)') === -1 && <option value="Other (not listed)">Other (not listed)</option>}
                    </select>
                    {institutionName === 'Other (not listed)' && (
                      <input
                        id="teacherInstitutionNameOtherCollege"
                        type="text"
                        value={institutionNameOther}
                        onChange={(e) => setInstitutionNameOther(e.target.value)}
                        placeholder="Enter your college/university name"
                        className="mt-3 w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <select
                      id="teacherInstitutionNameSchool"
                      aria-label="School name"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                      <option value="">Select your school</option>
                      {schools.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {schools.indexOf('Other (not listed)') === -1 && <option value="Other (not listed)">Other (not listed)</option>}
                    </select>
                    {institutionName === 'Other (not listed)' && (
                      <input
                        id="teacherInstitutionNameOtherSchool"
                        type="text"
                        value={institutionNameOther}
                        onChange={(e) => setInstitutionNameOther(e.target.value)}
                        placeholder="Enter your school name"
                        className="mt-3 w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                      />
                    )}
                  </>
                )}
                {errors.institutionName && <p className="text-red-500 text-xs mt-1">{errors.institutionName}</p>}
              </div>

              {institutionType === 'school' && (
                <div>
                  <label className="block text-sm font-semibold mb-3">Grades You Teach *</label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {SCHOOL_GRADES.map(grade => (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => toggleGrade(grade)}
                        className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                          grades.includes(grade)
                            ? 'bg-accent text-dark-primary'
                            : 'bg-dark-tertiary border border-gray-700 text-gray-400 hover:border-accent'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                  {errors.grades && <p className="text-red-500 text-xs mt-2">{errors.grades}</p>}
                </div>
              )}

              {institutionType === 'college' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="stream" className="block text-sm font-semibold mb-2">Stream *</label>
                    <select
                      id="stream"
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                      <option value="">Select stream</option>
                      {COLLEGE_STREAMS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.stream && <p className="text-red-500 text-xs mt-1">{errors.stream}</p>}
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-semibold mb-2">Branch *</label>
                    <select
                      id="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                      <option value="">Select branch</option>
                      {BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-semibold mb-2">Year *</label>
                    <select
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                      <option value="">Select year</option>
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Subjects You Teach *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                    placeholder="e.g., Mathematics"
                    className="flex-1 px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addSubject}
                    className="px-4 py-3 bg-accent/20 text-accent border border-accent rounded-lg font-semibold hover:bg-accent hover:text-dark-primary transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjects.map(subject => (
                    <span key={subject} className="bg-accent/20 text-accent px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                      {subject}
                      <button
                        type="button"
                        onClick={() => removeSubject(subject)}
                        className="hover:text-accent-light transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {errors.subjects && <p className="text-red-500 text-xs mt-2">{errors.subjects}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Courses Done *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
                    placeholder="e.g., Algebra 101"
                    className="flex-1 px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={addCourse}
                    className="px-4 py-3 bg-accent/20 text-accent border border-accent rounded-lg font-semibold hover:bg-accent hover:text-dark-primary transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courses.map(course => (
                    <span key={course} className="bg-accent/20 text-accent px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                      {course}
                      <button
                        type="button"
                        onClick={() => removeCourse(course)}
                        className="hover:text-accent-light transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {errors.courses && <p className="text-red-500 text-xs mt-2">{errors.courses}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Certifications (Optional)</label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="e.g., TEFL, PGCE, Advanced Diploma"
                  className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">Languages You Know *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {COMMON_LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                        languages.includes(lang)
                          ? 'bg-accent text-dark-primary'
                          : 'bg-dark-tertiary border border-gray-700 text-gray-400 hover:border-accent'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Show input when user selects Other to provide a custom language */}
                {languages.includes('Other') && (
                  <div className="mt-3">
                    <input
                      id="teacherOtherLanguage"
                      type="text"
                      value={otherLanguage}
                      onChange={(e) => setOtherLanguage(e.target.value)}
                      placeholder="Enter other language"
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    />
                    {errors.otherLanguage && <p className="text-red-500 text-xs mt-2">{errors.otherLanguage}</p>}
                  </div>
                )}

                {errors.languages && <p className="text-red-500 text-xs mt-2">{errors.languages}</p>}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
