import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface HeroProps {
  onExploreStudent: () => void;
  onExploreTeacher: () => void;
  onGetStarted: () => void;
  onExplore?: () => void; // optional: scroll to a section instead of opening modal
}

export default function Hero({ onExploreStudent, onExploreTeacher, onGetStarted, onExplore }: HeroProps) {
  const [showExploreModal, setShowExploreModal] = useState(false);

  // lock body scroll when modal is open
  useEffect(() => {
    if (showExploreModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [showExploreModal]);

  // close on ESC for accessibility
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowExploreModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <section className="min-h-screen bg-dark-primary flex items-center justify-center py-20 px-6 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-accent/15 via-transparent to-transparent opacity-40 pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent-light/5 rounded-full blur-3xl"
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Transform</span> the learning
          <br />
          experience with AI
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Empowering teachers with intelligent tools and students with personalized learning paths to achieve academic excellence together.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.button
              onClick={() => {
                if (onExplore) {
                  onExplore();
                  return;
                }
                setShowExploreModal((s) => !s);
              }}
              className="px-8 py-3 rounded-lg font-semibold w-full sm:w-auto text-dark-primary
                         bg-gradient-to-r from-accent to-accent-light shadow-[0_10px_30px_rgba(0,212,170,0.35)] hover:shadow-[0_16px_44px_rgba(0,212,170,0.5)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              aria-expanded={showExploreModal}
              aria-haspopup="dialog"
            >
              Explore
            </motion.button>
            {showExploreModal &&
              createPortal(
                <>
                  {/* overlay to dismiss */}
                  <motion.div
                    className="fixed inset-0 bg-black/60 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowExploreModal(false)}
                  />

                  {/* responsive: bottom sheet on mobile, centered card on larger screens */}
                  <motion.div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <div className="pointer-events-auto w-full sm:w-[min(92vw,560px)] max-h-[85dvh] sm:max-h-[70vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-accent/30 ring-1 ring-accent/20 bg-dark-secondary shadow-[0_18px_60px_rgba(0,212,170,0.18)] p-4 sm:p-6 mx-auto pb-[max(16px,env(safe-area-inset-bottom))]">
                      {/* mobile drag handle */}
                      <div className="sm:hidden flex justify-center mb-2">
                        <span className="block h-1.5 w-12 rounded-full bg-white/20" />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Explore Sahayak-AI</h3>
                        <button
                          aria-label="Close"
                          onClick={() => setShowExploreModal(false)}
                          className="text-gray-400 hover:text-white rounded-full p-2"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <button
                          onClick={() => {
                            setShowExploreModal(false);
                            onExploreStudent();
                          }}
                          className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-dark-secondary/70 backdrop-blur-md hover:border-accent/40 hover:bg-dark-secondary/90 transition-colors text-left"
                        >
                          <span className="text-3xl leading-none">🎓</span>
                          <span className="block">
                            <span className="block font-semibold">Student Explore</span>
                            <span className="block text-xs text-gray-400">Personalized roadmaps, AI tutor, adaptive tests.</span>
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setShowExploreModal(false);
                            onExploreTeacher();
                          }}
                          className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-dark-secondary/70 backdrop-blur-md hover:border-accent/40 hover:bg-dark-secondary/90 transition-colors text-left"
                        >
                          <span className="text-3xl leading-none">🧑‍🏫</span>
                          <span className="block">
                            <span className="block font-semibold">Teacher Explore</span>
                            <span className="block text-xs text-gray-400">Lesson planning, content generator, analytics.</span>
                          </span>
                        </button>
                      </div>

                      {/* No secondary CTA here as requested */}
                    </div>
                  </motion.div>
                </>,
                document.body
              )}
          </div>

          <motion.button
            onClick={onGetStarted}
            className="px-7 py-3 rounded-full font-semibold w-full sm:w-auto border border-white/10 bg-dark-secondary/70 backdrop-blur-md text-white hover:border-accent/50"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
