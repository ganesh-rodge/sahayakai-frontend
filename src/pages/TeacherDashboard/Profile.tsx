import { useEffect, useRef, useState } from 'react';

type InstitutionType = 'school' | 'college';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  institution?: string;
  institutionType: InstitutionType;
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
  subject: '',
  institution: '',
  institutionType: 'school',
  bio: '',
  avatarType: 'emoji',
  avatarEmoji: '🧑‍🏫',
  avatarImageDataUrl: ''
};

export default function Profile({ onBack, onSaved }: ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('teacherProfile');
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      }
    } catch {}
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
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
          <Avatar />

          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <button onClick={() => onChooseEmoji('🧑‍🏫')} className="px-3 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-800 hover:border-accent">Use Emoji</button>
              <button onClick={onPickImage} className="px-3 py-2 rounded-md bg-accent text-dark-primary text-sm font-semibold">Upload Photo</button>
              {profile.avatarType === 'image' && profile.avatarImageDataUrl && (
                <button onClick={() => setField('avatarImageDataUrl', '')} className="px-3 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-800 hover:border-accent">Remove Photo</button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Full Name</span>
                <input value={profile.name} onChange={(e) => setField('name', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="Your full name" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Email</span>
                <input type="email" value={profile.email} onChange={(e) => setField('email', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="you@example.com" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Phone</span>
                <input value={profile.phone || ''} onChange={(e) => setField('phone', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="Optional" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Subject / Role</span>
                <input value={profile.subject || ''} onChange={(e) => setField('subject', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="e.g., Mathematics" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Institution</span>
                <input value={profile.institution || ''} onChange={(e) => setField('institution', e.target.value)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none" placeholder="School/College name" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-300">Type</span>
                <select value={profile.institutionType} onChange={(e) => setField('institutionType', e.target.value as InstitutionType)} className="px-3 py-2 rounded-md bg-dark-tertiary border border-gray-800 focus:border-accent outline-none">
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
