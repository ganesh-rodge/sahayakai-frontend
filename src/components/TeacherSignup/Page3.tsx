import { useState } from 'react';
import type { TeacherPage3Data } from '../TeacherSignup';

interface Page3Props {
  onBack: () => void;
  onNext: (data: TeacherPage3Data) => void;
}

const QUALIFICATIONS = [
  'Advanced Diploma',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Certificate',
  'Diploma',
  'High School / Secondary',
  'Master\'s Degree',
  'MPhil (Master of Philosophy)',
  'Other',
  'PhD',
  'Post-Doctoral',
  'Professional Degree (e.g., MBBS, LLB, B.Ed)',
  'Vocational / Technical Qualification'
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - i);

export default function TeacherSignupPage3({ onBack: _onBack, onNext }: Page3Props) {
  const [highestQualification, setHighestQualification] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [university, setUniversity] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!highestQualification) newErrors.highestQualification = 'Please select your qualification';
    if (!graduationYear) newErrors.graduationYear = 'Graduation year is required';
    if (!university.trim()) newErrors.university = 'University/Institution name is required';
    if (!specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({
      highestQualification,
      graduationYear,
      university,
      specialization,
      yearsOfExperience
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20 animate-fadeIn">
      

      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 justify-center mb-4">
            <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Education & Experience</h1>
          <p className="text-gray-400">Step 3 of 4: Your qualifications</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-accent/30 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 rounded-full bg-accent/30 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 rounded-full bg-accent text-dark-primary flex items-center justify-center font-bold text-sm">3</div>
            <div className="w-12 h-1 bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-sm">4</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-dark-secondary p-8 rounded-lg border border-gray-800">
          <div>
            <label className="block text-sm font-semibold mb-2">Highest Qualification *</label>
            <select
              value={highestQualification}
              onChange={(e) => setHighestQualification(e.target.value)}
              className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
            >
              <option value="">Select your qualification</option>
              {QUALIFICATIONS.map(qual => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
            {errors.highestQualification && <p className="text-red-500 text-xs mt-1">{errors.highestQualification}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Graduation Year *</label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              >
                <option value="">Select year</option>
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.graduationYear && <p className="text-red-500 text-xs mt-1">{errors.graduationYear}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Years of Teaching Experience *</label>
              <select
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              >
                <option value="">Select years</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              {errors.yearsOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">University/Institution *</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Enter your university name"
              className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
            />
            {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Specialization/Subject of Study *</label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g., Mathematics, Physics, English, Computer Science"
              className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
            />
            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all mt-6"
          >
            Continue to School/College Details
          </button>
        </form>
      </div>
    </div>
  );
}
