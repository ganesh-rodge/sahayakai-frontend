import { useEffect, useRef, useState } from 'react';
import { getJSON } from '../../utils/api';

type InstitutionType = 'school' | 'college';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  institution?: string;
  institutionType: InstitutionType;
  eduLevel?: InstitutionType;
  collegeName?: string;
  bio?: string;
  avatarType: 'emoji' | 'image';
  avatarEmoji?: string; // e.g., "🧑‍🏫"
  avatarImageDataUrl?: string; // base64 data URL
}

interface ProfileProps {
  onBack: () => void;
  onSaved?: (profile: ProfileData) => void;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'Dr. Smith',
  email: 'teacher@example.com',
  phone: '',
  role: 'Teacher',
  institution: '',
  institutionType: 'school',
  eduLevel: 'school',
  collegeName: '',
  bio: '',
  avatarType: 'emoji',
  avatarEmoji: '🧑‍🏫',
  avatarImageDataUrl: ''
};

export default function Profile({ onBack, onSaved }: ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Load from localStorage first, then fetch from API
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherProfile');
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch {}

    const mapApiToProfile = (raw: any): ProfileData => {
      const pick = (obj: any, paths: string[]): any => {
        for (const p of paths) {
          const val = p.split('.').reduce((acc: any, key: string) => (acc == null ? undefined : acc[key]), obj);
          if (Array.isArray(val) && val.length) return val;
          if (val !== undefined && val !== null && String(val).trim() !== '') return val;
        }
        return undefined;
      };

      const data =
        raw?.user || raw?.data?.user || raw?.data?.profile || raw?.profile || raw?.data || raw;

      const first = pick(data, ['firstName', 'firstname', 'first_name', 'name.first', 'profile.firstName', 'user.firstName']) || '';
      const middle = pick(data, ['middleName', 'middlename', 'middle_name', 'name.middle']) || '';
      const last = pick(data, ['lastName', 'lastname', 'last_name', 'name.last', 'profile.lastName', 'user.lastName']) || '';

      const fullNameFromParts = [first, middle, last].filter(Boolean).join(' ').trim();
      const fullNameFallback =
        pick(data, ['fullName', 'fullname', 'name', 'profile.name', 'user.name', 'displayName']) || '';
      const emailVal = pick(data, ['email', 'emailId', 'profile.email', 'user.email']) || DEFAULT_PROFILE.email;
      const usernameFallback = typeof emailVal === 'string' && emailVal.includes('@') ? emailVal.split('@')[0] : DEFAULT_PROFILE.name;
      const name = fullNameFromParts || fullNameFallback || pick(data, ['username', 'user.username']) || usernameFallback;

      const eduLevelRaw = (pick(data, ['eduLevel', 'educationLevel', 'institutionType', 'typeOfInstitution']) || '').toString().toLowerCase();
      const eduLevel: InstitutionType = eduLevelRaw.includes('school') ? 'school' : eduLevelRaw.includes('college') ? 'college' : DEFAULT_PROFILE.institutionType;
      const institutionType: InstitutionType = eduLevel;

      // Prefer collegeName explicitly when level is college, else prefer schoolName
      let institution = '';
      if (eduLevel === 'college') {
        institution = pick(data, [
          'collegeName',
          'college',
          'institutionName',
          'organization',
          'orgName',
          'university',
          'deptName',
          'department',
        ]) || '';
      } else {
        institution = pick(data, [
          'schoolName',
          'school',
          'institutionName',
          'organization',
          'orgName',
          'deptName',
          'department',
        ]) || '';
      }

      const roleVal = pick(data, ['role', 'userType', 'type', 'profile.role', 'user.role']) || 'Teacher';

      const phoneVal = pick(data, ['phone', 'phoneNumber', 'mobile', 'mobileNumber', 'contact', 'profile.phone', 'user.phone']) || DEFAULT_PROFILE.phone;

      const merged: ProfileData = {
        ...DEFAULT_PROFILE,
        name,
        email: emailVal,
        phone: phoneVal,
        role: roleVal || DEFAULT_PROFILE.role,
        institution: institution || DEFAULT_PROFILE.institution,
        institutionType,
        eduLevel,
        collegeName: eduLevel === 'college' ? (institution || '') : '',
        bio: DEFAULT_PROFILE.bio,
        avatarType: DEFAULT_PROFILE.avatarType,
        avatarEmoji: DEFAULT_PROFILE.avatarEmoji,
        avatarImageDataUrl: DEFAULT_PROFILE.avatarImageDataUrl,
      };
      return merged;
    };

    const fetchProfile = async () => {
      setLoading(true);
      setApiError(null);
      try {
        // Prefer /user/me if available; else fallback to /user/register as requested
        let res: any | null = null;
        try {
          res = await getJSON('/user/me');
        } catch {
          // ignore and try /user/register
        }
        if (!res) {
          res = await getJSON('/user/register');
        }
        const mapped = mapApiToProfile(res || {});
        setProfile(mapped);
        try { localStorage.setItem('teacherProfile', JSON.stringify(mapped)); } catch {}
      } catch (e: any) {
        setApiError(e?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const setField = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setProfile((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const onChooseEmoji = (emoji: string) => {
    setField('avatarType', 'emoji');
    setField('avatarEmoji', emoji);
    setField('avatarImageDataUrl', '');
  };

  const onPickImage = () => fileInputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setField('avatarType', 'image');
      setField('avatarImageDataUrl', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('teacherProfile', JSON.stringify(profile));
      setDirty(false);
      onSaved?.(profile);
    } finally {
      setSaving(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      streamRef.current = stream;
      setCameraActive(true);
    } catch (e) {
      setApiError('Camera access denied or unavailable');
    }
  };

  const stopCamera = () => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 256;
    canvas.height = video.videoHeight || 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setField('avatarType', 'image');
    setField('avatarImageDataUrl', dataUrl);
    stopCamera();
  };

  const randomEmojis = ['🧑‍🏫','👩‍🏫','👨‍🏫','📚','✏️','📖','🧠','📝','🧪','🧮'];
  const randomizeEmoji = () => {
    const e = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
    onChooseEmoji(e);
  };

  const Avatar = () => (
    <div className="relative w-28 h-28 rounded-full overflow-hidden bg-dark-tertiary border border-gray-800 grid place-items-center text-5xl">
      {profile.avatarType === 'image' && profile.avatarImageDataUrl ? (
        <img src={profile.avatarImageDataUrl} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <span>{profile.avatarEmoji || '🧑‍🏫'}</span>
      )}
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors mb-6 flex items-center gap-2">← Back</button>

      <div className="bg-dark-secondary border border-gray-800 rounded-2xl p-6 md:p-8">
        {apiError && (
          <div className="mb-4 text-sm text-red-400">{apiError}</div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-gray-400">Loading profile from server…</div>
        )}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
          <Avatar />

          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <button onClick={randomizeEmoji} className="px-3 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-800 hover:border-accent">Random Emoji</button>
              <input
                value={profile.avatarEmoji || ''}
                onChange={(e) => onChooseEmoji(e.target.value)}
                placeholder="Type an emoji"
                className="px-3 py-2 w-36 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none text-center"
              />
              <button onClick={onPickImage} className="px-3 py-2 rounded-md bg-accent text-dark-primary text-sm font-semibold">Upload Photo</button>
              <button onClick={() => (cameraActive ? stopCamera() : startCamera())} className="px-3 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-800 hover:border-accent">
                {cameraActive ? 'Stop Camera' : 'Capture Photo'}
              </button>
              {profile.avatarType === 'image' && profile.avatarImageDataUrl && (
                <button onClick={() => setField('avatarImageDataUrl', '')} className="px-3 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-800 hover:border-accent">Remove Photo</button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>

            {cameraActive && (
              <div className="mb-4 flex items-start gap-4">
                <video ref={videoRef} className="w-56 h-40 bg-black rounded-lg border border-gray-800" />
                <div className="flex flex-col gap-2">
                  <button onClick={capturePhoto} className="px-3 py-2 rounded-md bg-accent text-dark-primary text-sm font-semibold w-max">Take Snapshot</button>
                  <button onClick={stopCamera} className="px-3 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-800 hover:border-accent w-max">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Full Name</span>
                <input value={profile.name} onChange={(e) => setField('name', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="Your full name" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Email</span>
                <input type="email" value={profile.email} disabled className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none opacity-70 cursor-not-allowed" placeholder="you@example.com" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Phone</span>
                <input value={profile.phone || ''} onChange={(e) => setField('phone', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="Phone" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Role</span>
                <input value={profile.role || ''} onChange={(e) => setField('role', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="Role" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">{(profile.eduLevel || profile.institutionType) === 'college' ? 'College Name' : 'School Name'}</span>
                <input
                  value={profile.institution || ''}
                  onChange={(e) => {
                    setField('institution', e.target.value);
                    if ((profile.eduLevel || profile.institutionType) === 'college') setField('collegeName', e.target.value as any);
                  }}
                  className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none"
                  placeholder={(profile.eduLevel || profile.institutionType) === 'college' ? 'College name' : 'School name'}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Edu Level</span>
                <select
                  value={(profile.eduLevel || profile.institutionType) as InstitutionType}
                  onChange={(e) => {
                    const val = e.target.value as InstitutionType;
                    setField('eduLevel', val);
                    setField('institutionType', val as any);
                  }}
                  className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none"
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1 mt-4">
              <span className="text-sm text-gray-300">Bio</span>
              <textarea value={profile.bio || ''} onChange={(e) => setField('bio', e.target.value)} rows={3} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none resize-y" placeholder="A short introduction about yourself" />
            </label>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={onBack} className="px-5 py-2 rounded-md border border-gray-800 text-gray-300 hover:border-accent">Cancel</button>
              <button disabled={!dirty || saving} onClick={handleSave} className="px-6 py-2 rounded-md font-semibold text-dark-primary bg-gradient-to-r from-accent to-accent-light disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
