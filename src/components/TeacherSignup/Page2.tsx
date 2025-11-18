import { useState } from 'react';
import FaceCaptureModal from '../FaceCaptureModal';
import type { TeacherPage2Data } from '../TeacherSignup';

interface Page2Props {
  email: string;
  onBack: () => void;
  onNext: (data: TeacherPage2Data) => void;
}

export default function TeacherSignupPage2({ email, onBack: _onBack, onNext }: Page2Props) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showNameNote, setShowNameNote] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!surname.trim()) newErrors.surname = 'Surname is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(phoneNumber.replace(/[-\s]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (!pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({
      photoUrl,
      firstName,
      middleName,
      surname,
      phoneNumber,
      dateOfBirth,
      city,
      state,
      country,
      pincode
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20 animate-fadeIn">
      

      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 justify-center mb-4">
            <img src="/Sahayak%20AI%20logo.png" alt="Sahayak AI" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Personal Details</h1>
          <p className="text-gray-400">Step 2 of 4: Tell us about yourself</p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-accent/30 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <div className="w-12 h-1 bg-accent"></div>
            <div className="w-8 h-8 rounded-full bg-accent text-dark-primary flex items-center justify-center font-bold text-sm">2</div>
            <div className="w-12 h-1 bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
            <div className="w-12 h-1 bg-gray-700"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-sm">4</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-dark-secondary p-8 rounded-lg border border-gray-800">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-accent" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-dark-tertiary border-4 border-gray-700 flex items-center justify-center text-4xl">
                  📷
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-accent text-dark-primary p-2 rounded-full cursor-pointer hover:bg-accent-light transition-colors">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <span className="text-xl">+</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-400">Upload or capture your photo</p>
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
              >
                Use Camera
              </button>
            </div>
          </div>

          <div className="bg-dark-tertiary border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setShowNameNote(!showNameNote)}
                className="text-accent hover:text-accent-light transition-colors text-lg font-bold"
              >
                ℹ️
              </button>
              <div className="flex-1">
                <p className="text-sm text-gray-300 font-semibold mb-1">Important Note</p>
                {showNameNote && (
                  <p className="text-xs text-gray-400 animate-fadeInUp">
                    Once you submit your name details, they cannot be edited. Please ensure all information is correct before proceeding.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First"
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Middle Name</label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Middle"
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Surname *</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Last"
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="10-digit number"
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address *</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Cannot be edited</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date of Birth *</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your city"
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">State *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Your state"
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Country *</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Your country"
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Pincode *</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit pincode"
                maxLength={6}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:border-accent outline-none transition-colors"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all mt-6"
          >
            Continue to Education Details
          </button>
        </form>
      </div>
      {isCameraOpen && (
        <FaceCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCaptured={(url) => { setPhotoUrl(url); setIsCameraOpen(false); }}
          title="Teacher Photo Capture"
        />
      )}
    </div>
  );
}
