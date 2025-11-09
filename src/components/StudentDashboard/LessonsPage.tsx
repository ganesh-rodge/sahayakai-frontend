import { Clock, CheckCircle2, Play, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

interface Week {
  weekNumber: number;
  title: string;
  lessonsCompleted: number;
  totalLessons: number;
  lessons: Lesson[];
}

interface LessonsPageProps {
  weeks: Week[];
  onStartLesson: (lessonId: string) => void;
  hasRoadmap: boolean;
  onCreateRoadmap: () => void;
}

export default function LessonsPage({ weeks, onStartLesson, hasRoadmap, onCreateRoadmap }: LessonsPageProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]); // Week 1 expanded by default

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber)
        ? prev.filter((w) => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const completedLessons = weeks.reduce((total, week) => total + week.lessonsCompleted, 0);
  const totalLessons = weeks.reduce((total, week) => total + week.totalLessons, 0);

  // Show empty state if no roadmap
  if (!hasRoadmap) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-accent/20 via-accent-light/20 to-accent/10 rounded-2xl p-6 sm:p-8 border border-accent/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">My Lessons</h1>
          <p className="text-gray-300">Create a roadmap to access your personalized lessons</p>
        </motion.div>

        {/* Empty State */}
        <motion.div
          className="bg-dark-secondary rounded-2xl p-12 border border-gray-800 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-accent/20 rounded-full">
              <BookOpen className="w-16 h-16 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">No Lessons Available</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            You need to create a roadmap first to get access to personalized lessons tailored to your learning goals.
          </p>
          <button
            onClick={onCreateRoadmap}
            className="px-8 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-medium hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            Create Your Roadmap
          </button>
        </motion.div>
      </div>
    );
  }

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
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Lessons</h1>
          <p className="text-gray-300 mb-4">Continue your learning journey</p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-dark-secondary px-4 py-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="font-medium">Completed: {completedLessons}</span>
            </div>
            <div className="flex items-center gap-2 bg-dark-secondary px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Total: {totalLessons}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weeks List */}
      <div className="space-y-4">
        {weeks.map((week, weekIndex) => {
          const isExpanded = expandedWeeks.includes(week.weekNumber);
          const progress = Math.round((week.lessonsCompleted / week.totalLessons) * 100);

          return (
            <motion.div
              key={week.weekNumber}
              className="bg-dark-secondary rounded-xl border border-gray-800 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: weekIndex * 0.1 }}
            >
              {/* Week Header */}
              <motion.button
                onClick={() => toggleWeek(week.weekNumber)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-dark-tertiary transition-colors"
                whileHover={{ backgroundColor: "rgba(26, 26, 36, 0.5)" }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    className="flex items-center justify-center w-12 h-12 bg-dark-tertiary rounded-full border-2 border-accent/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="font-bold text-accent">W{week.weekNumber}</span>
                  </motion.div>
                  <div className="text-left flex-1">
                    <h2 className="text-lg font-bold mb-1">{week.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span>{week.lessonsCompleted} of {week.totalLessons} lessons completed</span>
                      <span className="text-accent font-medium">{progress}% Complete</span>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="ml-4"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-accent" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </motion.div>
              </motion.button>

              {/* Progress Bar */}
              <div className="px-6 pb-2">
                <div className="h-2 bg-dark-tertiary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent-light"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Lessons Grid */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="px-6 pb-6 pt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {week.lessons.map((lesson, lessonIndex) => (
                        <motion.div
                          key={lesson.id}
                          className="bg-dark-tertiary rounded-lg p-5 border border-gray-800 hover:border-accent/30 transition-all group"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: lessonIndex * 0.05 }}
                          whileHover={{ scale: 1.02, y: -3 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold group-hover:text-accent transition-colors">
                                  {lesson.title}
                                </h3>
                                {lesson.completed && (
                                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mb-3">{lesson.description}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>

                          {lesson.completed ? (
                            <button className="w-full mt-4 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium flex items-center justify-center gap-2 border border-green-500/30">
                              <CheckCircle2 className="w-4 h-4" />
                              Completed
                            </button>
                          ) : (
                            <motion.button
                              onClick={() => onStartLesson(lesson.id)}
                              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-medium hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Play className="w-4 h-4" />
                              Start
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
