import { useState, useEffect } from 'react';
import type { Page3Data } from '../StudentSignup';
import StepHeader from '../Signup/StepHeader';
import { INDIAN_COLLEGES } from '../../utils/indianColleges';

interface Page3Props {
  onBack: () => void;
  onComplete: (data: Page3Data) => void;
}

const EDUCATION_LEVELS = {
  SCHOOL: 'school',
  COLLEGE: 'college'
};

const SCHOOL_CLASSES = [
  '1st Standard', '2nd Standard', '3rd Standard', '4th Standard', '5th Standard',
  '6th Standard', '7th Standard', '8th Standard', '9th Standard', '10th Standard',
  '11th Standard', '12th Standard'
];

const SCHOOL_STREAMS = {
  '11th Standard': ['Science', 'Commerce', 'Arts'],
  '12th Standard': ['Science', 'Commerce', 'Arts']
};

const COLLEGE_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
const COLLEGE_SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8', 'Semester 9', 'Semester 10'];

export default function StudentSignupPage3({ onBack: _onBack, onComplete }: Page3Props) {
  const [educationLevel, setEducationLevel] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionNameOther, setInstitutionNameOther] = useState('');
  const [streamDept, setStreamDept] = useState('');
  const [semester, setSemester] = useState('');
  const [colleges, setColleges] = useState<string[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEducationLevelChange = (level: string) => {
    setEducationLevel(level);
    setClassGrade('');
    setStreamDept('');
    setSemester('');
  };

  const handleClassGradeChange = (grade: string) => {
    setClassGrade(grade);
    if (educationLevel === EDUCATION_LEVELS.SCHOOL && !['11th Standard', '12th Standard'].includes(grade)) {
      setStreamDept('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!educationLevel) newErrors.educationLevel = 'Please select education level';
    if (!classGrade) newErrors.classGrade = 'Please select class/grade';
    const finalInstitutionName = educationLevel === EDUCATION_LEVELS.COLLEGE && institutionName === 'Other (not listed)'
      ? institutionNameOther.trim()
      : institutionName.trim();
    if (!finalInstitutionName) newErrors.institutionName = 'Institution name is required';

    if (educationLevel === EDUCATION_LEVELS.SCHOOL) {
      if (['11th Standard', '12th Standard'].includes(classGrade) && !streamDept) {
        newErrors.streamDept = 'Please select your stream';
      }
    } else if (educationLevel === EDUCATION_LEVELS.COLLEGE) {
      if (!streamDept.trim()) newErrors.streamDept = 'Department is required';
      if (!semester) newErrors.semester = 'Please select semester';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onComplete({
      educationLevel,
      classGrade,
      institutionName: finalInstitutionName,
      streamDept,
      semester
    });
  };

  // Fetch institutions (acts like an API). Falls back to bundled list if fetch fails.
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

  const DEPARTMENTS = [
    'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Business', 'Economics', 'Commerce', 'Arts', 'Law', 'Medicine'
  ];

  const showStreamForSchool = educationLevel === EDUCATION_LEVELS.SCHOOL && ['11th Standard', '12th Standard'].includes(classGrade);
  const showDeptForCollege = educationLevel === EDUCATION_LEVELS.COLLEGE;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20 animate-fadeIn">
      <div className="max-w-2xl w-full">
        <StepHeader title="Educational Details" subtitle="Step 3 of 3: Almost there!" current={3} total={3} />

        <form onSubmit={handleSubmit} className="space-y-6 bg-dark-secondary p-8 rounded-lg border border-gray-800">
          <div>
            <label className="block text-sm font-semibold mb-3">Education Level *</label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleEducationLevelChange(EDUCATION_LEVELS.SCHOOL)}
                className={`p-6 border-2 rounded-lg transition-all text-left ${
                  educationLevel === EDUCATION_LEVELS.SCHOOL
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'
                }`}
              >
                <div className="text-3xl mb-2">🏫</div>
                <h3 className="font-bold mb-1">School</h3>
                <p className="text-sm text-gray-400">Classes 1-12</p>
              </button>
              <button
                type="button"
                onClick={() => handleEducationLevelChange(EDUCATION_LEVELS.COLLEGE)}
                className={`p-6 border-2 rounded-lg transition-all text-left ${
                  educationLevel === EDUCATION_LEVELS.COLLEGE
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 bg-dark-tertiary hover:border-accent/50'
                }`}
              >
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-bold mb-1">College/University</h3>
                <p className="text-sm text-gray-400">Undergraduate & Graduate</p>
              </button>
            </div>
            {errors.educationLevel && <p className="text-red-500 text-xs mt-2">{errors.educationLevel}</p>}
          </div>

          {educationLevel && (
            <div className="animate-fadeInUp space-y-6">
              <div>
                <label htmlFor="classGrade" className="block text-sm font-semibold mb-2">
                  {educationLevel === EDUCATION_LEVELS.SCHOOL ? 'Class/Grade *' : 'Year *'}
                </label>
                <select
                  id="classGrade"
                  value={classGrade}
                  onChange={(e) => handleClassGradeChange(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                >
                  <option value="">Select {educationLevel === EDUCATION_LEVELS.SCHOOL ? 'class' : 'year'}</option>
                  {educationLevel === EDUCATION_LEVELS.SCHOOL
                    ? SCHOOL_CLASSES.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))
                    : COLLEGE_YEARS.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))
                  }
                </select>
                {errors.classGrade && <p className="text-red-500 text-xs mt-1">{errors.classGrade}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {educationLevel === EDUCATION_LEVELS.SCHOOL ? 'School Name *' : 'College/University Name *'}
                </label>
                {educationLevel === EDUCATION_LEVELS.COLLEGE ? (
                  <>
                    <select
                      id="studentInstitutionNameCollege"
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
                        id="studentInstitutionNameOtherCollege"
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
                      id="studentInstitutionNameSchool"
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
                        id="studentInstitutionNameOtherSchool"
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

              {showStreamForSchool && (
                <div className="animate-fadeInUp">
                  <label htmlFor="streamDept" className="block text-sm font-semibold mb-2">Stream *</label>
                    <select
                      id="streamDept"
                      value={streamDept}
                      onChange={(e) => setStreamDept(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                    <option value="">Select stream</option>
                    {SCHOOL_STREAMS[classGrade as keyof typeof SCHOOL_STREAMS]?.map(stream => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                  {errors.streamDept && <p className="text-red-500 text-xs mt-1">{errors.streamDept}</p>}
                </div>
              )}

              {showDeptForCollege && (
                <div className="animate-fadeInUp space-y-6">
                  <div>
                    <label htmlFor="studentDepartment" className="block text-sm font-semibold mb-2">Department/Major *</label>
                    <select
                      id="studentDepartment"
                      value={streamDept}
                      onChange={(e) => setStreamDept(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                      <option value="">Select department/major</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {errors.streamDept && <p className="text-red-500 text-xs mt-1">{errors.streamDept}</p>}
                  </div>

                  <div>
                    <label htmlFor="studentSemester" className="block text-sm font-semibold mb-2">Semester *</label>
                    <select
                      id="studentSemester"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
                    >
                      <option value="">Select semester</option>
                      {COLLEGE_SEMESTERS.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                    {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
                  </div>
                </div>
              )}
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
