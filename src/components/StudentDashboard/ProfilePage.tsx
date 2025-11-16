import { useEffect, useRef, useState } from 'react';
import { User, Mail, UserCircle2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getJSON } from '../../utils/api';

interface ProfilePageProps {
  userName?: string;
  userEmail?: string;
  role?: string;
  qualification?: string;
  profilePicture?: string;
  onSaveProfile?: (data: { userName: string; userEmail: string; role?: string; qualification?: string; profilePicture?: string }) => void;
}

// avatars removed; using upload/capture only

export default function ProfilePage({ userName, userEmail, role, qualification, profilePicture, onSaveProfile }: ProfilePageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    userName: userName || '',
    userEmail: userEmail || '',
    role: role || '',
    qualification: qualification || '',
    profilePicture: profilePicture || '',
  });

  // Fetch teacher profile from API and map fields
  useEffect(() => {
    const pick = (obj: any, paths: string[]): any => {
      for (const p of paths) {
        const val = p.split('.').reduce((acc: any, key: string) => (acc == null ? undefined : acc[key]), obj);
        if (Array.isArray(val) && val.length) return val;
        if (val !== undefined && val !== null && String(val).trim() !== '') return val;
      }
      return undefined;
    };

    const mapUser = (raw: any) => {
      const data = raw?.user || raw?.data?.user || raw?.profile || raw?.data || raw;
      const first = pick(data, ['firstName', 'firstname', 'first_name', 'name.first']) || '';
      const middle = pick(data, ['middleName', 'middlename', 'middle_name', 'name.middle']) || '';
      const last = pick(data, ['lastName', 'lastname', 'last_name', 'name.last']) || '';
      const full = [first, middle, last].filter(Boolean).join(' ').trim();
      const fullFallback = pick(data, ['fullName', 'fullname', 'name', 'displayName']) || '';
      const email = pick(data, ['email', 'emailId', 'profile.email', 'user.email']) || '';
      const _role = pick(data, ['role', 'userType', 'type']) || '';
      let qual: any = pick(
        data,
        [
          'qualification',
          'highestQualification',
          'education',
          'degree',
          'qualifications',
          'profile.qualification',
          'profile.qualifications',
          'education.qualification',
          'education.qualifications',
          'academics.qualification',
        ]
      );
      if (Array.isArray(qual)) qual = qual.join(', ');
      const avatar = pick(data, ['avatarUrl', 'photoUrl', 'imageUrl', 'profilePicture']);
      setFormData((s) => ({
        ...s,
        userName: full || fullFallback || pick(data, ['username']) || (email?.includes('@') ? email.split('@')[0] : s.userName),
        userEmail: email || s.userEmail,
        role: _role || s.role,
        qualification: qual || s.qualification,
        profilePicture: avatar || s.profilePicture,
      }));
    };

    const run = async () => {
      setLoading(true);
      setApiError(null);
      try {
        let res: any | null = null;
        try { res = await getJSON('/user/me'); } catch {}
        if (!res) {
          // optional fallback if needed
          try { res = await getJSON('/user/register'); } catch {}
        }
        if (res) mapUser(res);
      } catch (e: any) {
        setApiError(e?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleSave = () => {
    onSaveProfile?.(formData);
    try { localStorage.setItem('teacherProfile', JSON.stringify(formData)); } catch {}
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setFormData({
      userName: userName || '',
      userEmail: userEmail || '',
      role: role || '',
      qualification: qualification || '',
      profilePicture: profilePicture || '',
    });
    setIsEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div className="bg-gradient-to-r from-accent/20 via-accent-light/20 to-accent/10 rounded-2xl p-6 sm:p-8 border border-accent/30 relative overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <motion.div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent opacity-40 pointer-events-none" animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile</h1>
            <p className="text-gray-300">Teacher account details</p>
          </div>
          <UserCircle2 className="w-12 h-12 text-accent" />
        </div>
      </motion.div>

      {/* Error/Loading */}
      {apiError && <div className="text-sm text-red-400">{apiError}</div>}
      {loading && <div className="text-sm text-gray-400">Loading profile…</div>}

      {/* Profile Information Section */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Profile Information</h2>
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-medium hover:shadow-lg hover:shadow-accent/30 transition-all text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Profile Picture with Upload + Capture */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Profile Picture</label>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center text-dark-primary font-bold text-2xl overflow-hidden">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (formData.userName || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-md bg-accent text-dark-primary text-sm font-semibold">Upload Photo</button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file || !file.type.startsWith('image/')) return;
                  const reader = new FileReader();
                  reader.onload = () => setFormData({ ...formData, profilePicture: String(reader.result || '') });
                  reader.readAsDataURL(file);
                }} />
                <button onClick={async () => {
                  if (cameraActive) { // stop
                    const s = streamRef.current; if (s) s.getTracks().forEach(t => t.stop());
                    if (videoRef.current) videoRef.current.srcObject = null; setCameraActive(false); return;
                  }
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
                    streamRef.current = stream; setCameraActive(true);
                  } catch {
                    setApiError('Camera access denied or unavailable');
                  }
                }} className="px-4 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-700 hover:border-accent">{cameraActive ? 'Stop Camera' : 'Capture Photo'}</button>
                {formData.profilePicture && (
                  <button onClick={() => setFormData({ ...formData, profilePicture: '' })} className="px-4 py-2 rounded-md bg-dark-tertiary text-sm border border-gray-700 hover:border-accent">Remove Photo</button>
                )}
              </div>
            </div>

            {cameraActive && (
              <div className="mt-3 flex items-start gap-3">
                <video ref={videoRef} className="w-56 h-40 bg-black rounded-lg border border-gray-800" />
                <button onClick={() => {
                  const video = videoRef.current; if (!video) return;
                  const canvas = document.createElement('canvas');
                  canvas.width = video.videoWidth || 256; canvas.height = video.videoHeight || 256;
                  const ctx = canvas.getContext('2d'); if (!ctx) return;
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const dataUrl = canvas.toDataURL('image/png');
                  setFormData({ ...formData, profilePicture: dataUrl });
                  const s = streamRef.current; if (s) s.getTracks().forEach(t => t.stop());
                  if (videoRef.current) videoRef.current.srcObject = null; setCameraActive(false);
                }} className="px-4 py-2 rounded-md bg-accent text-dark-primary text-sm font-semibold">Take Snapshot</button>
              </div>
            )}
          </div>

          {/* Full Name (editable) */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            {isEditMode ? (
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors text-white"
                placeholder="Enter your name"
              />
            ) : (
              <div className="px-4 py-3 bg-dark-tertiary rounded-lg text-gray-300">{formData.userName}</div>
            )}
          </div>

          {/* Email Address (read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <>
              <div className="px-4 py-3 bg-dark-tertiary rounded-lg text-gray-300">{formData.userEmail}</div>
              <p className="text-xs text-gray-500 mt-2">Email address cannot be changed</p>
            </>
          </div>

          {/* Role (read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2">Role</label>
            <div className="px-4 py-3 bg-dark-tertiary rounded-lg text-gray-300">{formData.role || '—'}</div>
          </div>

          {/* Qualification (read-only) */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2">Qualification</label>
            <div className="px-4 py-3 bg-dark-tertiary rounded-lg text-gray-300">{formData.qualification || '—'}</div>
          </div>

          {/* Action Buttons */}
          {isEditMode && (
            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={handleSave}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-medium hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="flex-1 sm:flex-none px-6 py-3 bg-dark-tertiary text-gray-300 border border-gray-700 rounded-lg font-medium hover:bg-dark-primary transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
                Cancel
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
