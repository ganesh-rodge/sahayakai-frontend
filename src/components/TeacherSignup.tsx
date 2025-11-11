import { useState } from 'react';
import TeacherSignupPage1 from './TeacherSignup/Page1';
import TeacherSignupPage2 from './TeacherSignup/Page2';
import TeacherSignupPage3 from './TeacherSignup/Page3';
import TeacherSignupPage4 from './TeacherSignup/Page4';

interface TeacherSignupProps {
  onBack: () => void;
  onLogin: () => void;
}

export interface TeacherPage1Data {
  username: string;
  email: string;
  password: string;
}

export interface TeacherPage2Data {
  photoUrl: string;
  firstName: string;
  middleName: string;
  surname: string;
  phoneNumber: string;
  dateOfBirth: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface TeacherPage3Data {
  highestQualification: string;
  graduationYear: string;
  university: string;
  specialization: string;
  yearsOfExperience: string;
}

export interface TeacherPage4Data {
  institutionType: string;
  institutionName: string;
  grades?: string;
  stream?: string;
  branch?: string;
  year?: string;
  subjects: string[];
  courses: string[];
  certifications: string;
  languages: string[];
}

export default function TeacherSignup({ onBack, onLogin }: TeacherSignupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [page1Data, setPage1Data] = useState<TeacherPage1Data | null>(null);
  const [page2Data, setPage2Data] = useState<TeacherPage2Data | null>(null);
  const [page3Data, setPage3Data] = useState<TeacherPage3Data | null>(null);

  const handlePage1Complete = (data: TeacherPage1Data) => {
    setPage1Data(data);
    setCurrentStep(2);
  };

  const handlePage2Complete = (data: TeacherPage2Data) => {
    setPage2Data(data);
    setCurrentStep(3);
  };

  const handlePage3Complete = (data: TeacherPage3Data) => {
    setPage3Data(data);
    setCurrentStep(4);
  };

  const handlePage2Back = () => {
    setCurrentStep(1);
  };

  const handlePage3Back = () => {
    setCurrentStep(2);
  };

  const handlePage4Back = () => {
    setCurrentStep(3);
  };

  const handlePage4Complete = async (data: TeacherPage4Data) => {
    console.log('Complete teacher registration:', { page1Data, page2Data, page3Data, page4Data: data });
    try {
      // persist teacher profile locally so dashboard can read defaults
      if (page1Data?.username) {
        localStorage.setItem('teacherName', page1Data.username);
      }
      if (data?.institutionType) {
        localStorage.setItem('teacherInstitutionType', data.institutionType);
      }
      if (data?.institutionName) {
        localStorage.setItem('teacherInstitutionName', data.institutionName);
      }
    } catch (err) {
      // ignore localStorage errors
    }

    // after registration completes, optionally navigate to login
    onLogin();
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      {currentStep === 1 && (
        <TeacherSignupPage1
          onBack={onBack}
          onLogin={onLogin}
          onNext={handlePage1Complete}
        />
      )}
      {currentStep === 2 && page1Data && (
        <TeacherSignupPage2
          email={page1Data.email}
          onBack={handlePage2Back}
          onNext={handlePage2Complete}
        />
      )}
      {currentStep === 3 && page1Data && page2Data && (
        <TeacherSignupPage3
          onBack={handlePage3Back}
          onNext={handlePage3Complete}
        />
      )}
      {currentStep === 4 && page1Data && page2Data && page3Data && (
        <TeacherSignupPage4
          onBack={handlePage4Back}
          onComplete={handlePage4Complete}
        />
      )}
    </div>
  );
}
