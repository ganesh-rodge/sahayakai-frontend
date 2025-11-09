import { useState } from 'react';
import { User, Mail, Target, Sun, Moon, UserCircle2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfilePageProps {
  userName: string;
  userEmail: string;
  learningGoal: string;
  profilePicture?: string;
  onSaveProfile: (data: { userName: string; userEmail: string; learningGoal: string; profilePicture?: string }) => void;
}

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
];

export default function ProfilePage({ userName, userEmail, learningGoal, profilePicture, onSaveProfile }: ProfilePageProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [formData, setFormData] = useState({
    userName,
    userEmail,
    learningGoal,
    profilePicture: profilePicture || '',
  });

  const handleSave = () => {
    onSaveProfile(formData);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setFormData({ userName, userEmail, learningGoal, profilePicture: profilePicture || '' });
    setIsEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-accent/20 via-accent-light/20 to-accent/10 rounded-2xl p-6 sm:p-8 border border-accent/30 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent opacity-40 pointer-events-none"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-gray-300">Manage your account information</p>
          </div>
          <UserCircle2 className="w-12 h-12 text-accent" />
        </div>
      </motion.div>

      {/* Appearance Section */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-6">Appearance</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Theme</label>
            <p className="text-xs text-blue-400 mb-3">Choose between light and dark mode</p>
            <div className="flex gap-3">
              <motion.button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  theme === 'light'
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-dark-tertiary border-gray-700 text-gray-400 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sun className="w-4 h-4" />
                <span className="text-sm font-medium">Light</span>
              </motion.button>
              <motion.button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-dark-tertiary border-gray-700 text-gray-400 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Moon className="w-4 h-4" />
                <span className="text-sm font-medium">Dark</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

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
          {/* Profile Picture */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Profile Picture</label>
            {isEditMode ? (
              <div>
                <p className="text-xs text-gray-500 mb-4">Choose from predefined avatars</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
                  <button
                    onClick={() => setFormData({ ...formData, profilePicture: '' })}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                      !formData.profilePicture
                        ? 'bg-accent/20 border-accent'
                        : 'bg-dark-tertiary border-gray-700 hover:border-accent/50'
                    }`}
                  >
                    <User className="w-6 h-6 text-gray-400" />
                  </button>
                  {avatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData({ ...formData, profilePicture: avatar })}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 transition-all overflow-hidden ${
                        formData.profilePicture === avatar
                          ? 'border-accent scale-110'
                          : 'border-gray-700 hover:border-accent/50 hover:scale-105'
                      }`}
                    >
                      <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center text-dark-primary font-bold text-2xl overflow-hidden">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="w-full h-full" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
            )}
          </div>

          {/* Full Name */}
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

          {/* Email Address */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            {isEditMode ? (
              <>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors text-white"
                  placeholder="Enter your email"
                />
                <p className="text-xs text-gray-500 mt-2">Email address cannot be changed</p>
              </>
            ) : (
              <>
                <div className="px-4 py-3 bg-dark-tertiary rounded-lg text-gray-300">{formData.userEmail}</div>
                <p className="text-xs text-gray-500 mt-2">Email address cannot be changed</p>
              </>
            )}
          </div>

          {/* Learning Goal */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Learning Goal
            </label>
            {isEditMode ? (
              <input
                type="text"
                value={formData.learningGoal}
                onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
                className="w-full px-4 py-3 bg-dark-tertiary border border-gray-700 rounded-lg focus:outline-none focus:border-accent transition-colors text-white"
                placeholder="e.g., I want to become a Software Developer"
              />
            ) : (
              <div className="px-4 py-3 bg-dark-tertiary rounded-lg text-gray-300">{formData.learningGoal}</div>
            )}
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

      {/* Account Statistics */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-6">Account Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark-tertiary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-accent mb-1">-</div>
            <div className="text-sm text-gray-400">Lessons Completed</div>
          </div>
          <div className="bg-dark-tertiary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">-</div>
            <div className="text-sm text-gray-400">Hours Studied</div>
          </div>
          <div className="bg-dark-tertiary rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">-</div>
            <div className="text-sm text-gray-400">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
