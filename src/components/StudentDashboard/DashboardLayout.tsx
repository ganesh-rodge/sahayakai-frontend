import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, BookOpen, Map, User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  currentPage?: 'dashboard' | 'lessons' | 'roadmap' | 'profile';
  onNavigate?: (page: 'dashboard' | 'lessons' | 'roadmap' | 'profile') => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
  profilePicture: string;
}

export default function DashboardLayout({ children, currentPage, onLogout, userName, userEmail, profilePicture }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // navigation is handled by react-router via NavLink; keep onNavigate for backward compatibility

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Top Navigation Bar */}
      <motion.nav
        className="bg-dark-secondary/90 backdrop-blur-xl border-b border-gray-800 fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                title="Back to Home"
              >
                <img
                  src="/Sahayak%20AI%20logo.png"
                  alt="Sahayak AI"
                  className="h-8 w-auto"
                />
              </motion.button>
            </div>

            {/* Navigation Menu - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={`/student/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
                    className={({ isActive }: { isActive: boolean }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-accent/20 to-accent-light/20 text-accent border border-accent/30' : 'text-gray-400 hover:bg-dark-tertiary hover:text-white'}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.span>
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark-tertiary transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* User Info & Logout - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 bg-dark-tertiary px-4 py-2 rounded-full">
                {profilePicture ? (
                  <img src={profilePicture} alt={userName} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center text-dark-primary font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <motion.button
                onClick={onLogout}
                className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors group"
                title="Sign Out"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-40 top-16 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-dark-secondary border-r border-gray-800 flex flex-col z-40"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      to={`/student/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
                      className={({ isActive }: { isActive: boolean }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-accent/20 to-accent-light/20 text-accent border border-accent/30' : 'text-gray-400 hover:bg-dark-tertiary hover:text-white'}`}
                      onClick={() => setIsSidebarOpen(false)}
                      style={{ display: 'flex' }}
                    >
                      <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} whileTap={{ scale: 0.95 }} className="w-full flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.span>
                    </NavLink>
                  );
                })}
              </nav>
              
              {/* Mobile User Info & Logout */}
              <div className="p-4 border-t border-gray-800 space-y-3">
                <div className="flex items-center gap-3 bg-dark-tertiary px-4 py-3 rounded-lg">
                  {profilePicture ? (
                    <img src={profilePicture} alt={userName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center text-dark-primary font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{userName}</div>
                    <div className="text-xs text-gray-400">{userEmail}</div>
                  </div>
                </div>
                <motion.button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}

