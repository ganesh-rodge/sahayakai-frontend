import { Clock, Trophy, Target, TrendingUp, CheckCircle2, Play, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../../utils/animations';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  progress?: number;
}

interface Week {
  weekNumber: number;
  title: string;
  lessonsCompleted: number;
  totalLessons: number;
  progress: number;
  lessons: Lesson[];
}

interface DashboardHomeProps {
  userName: string;
  learningGoal: string;
  totalWeeks: number;
  totalLessons: number;
  lessonsCompleted: number;
  overallProgress: number;
  studyTimeHours: number;
  testAccuracy: number;
  currentWeekNumber: number;
  weekData?: Week;
  onStartLesson: (lessonId: string) => void;
  hasRoadmap: boolean;
  onCreateRoadmap: () => void;
}

export default function DashboardHome({
  userName,
  learningGoal,
  totalLessons,
  lessonsCompleted,
  overallProgress,
  studyTimeHours,
  testAccuracy,
  currentWeekNumber,
  weekData,
  onStartLesson,
  hasRoadmap,
  onCreateRoadmap,
}: DashboardHomeProps) {

  // Show empty state if no roadmap
  if (!hasRoadmap) {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-accent/20 via-accent-light/20 to-accent/10 rounded-2xl p-6 sm:p-8 border border-accent/30 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative z-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Welcome to Sahayak AI, {userName}!</h1>
            <p className="text-gray-300 text-lg mb-6">Let's start your learning journey</p>
          </div>
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
          <h2 className="text-2xl font-bold mb-3">No Roadmap Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Create your personalized learning roadmap to get started with your journey. Answer a few questions to help us customize your experience.
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
      {/* Welcome Section */}
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-300 mb-4">Continue your learning journey</p>
          <div className="flex items-center gap-2 text-sm text-accent">
            <Target className="w-4 h-4" />
            <span className="font-medium">Learning Goal:</span>
            <span className="text-gray-300">{learningGoal}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Learning Progress */}
        <motion.div
          className="bg-dark-secondary rounded-xl p-6 border border-gray-800 hover:border-accent/30 transition-colors"
          variants={fadeInUp}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-blue-400">{overallProgress}%</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Learning Progress</h3>
          <p className="text-xs text-gray-500">{lessonsCompleted} of {totalLessons} lessons</p>
        </motion.div>

        {/* Time Spent */}
        <motion.div
          className="bg-dark-secondary rounded-xl p-6 border border-gray-800 hover:border-accent/30 transition-colors"
          variants={fadeInUp}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-green-400">{studyTimeHours}h</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Time Spent</h3>
          <p className="text-xs text-gray-500">Total study time</p>
        </motion.div>

        {/* Test Accuracy */}
        <motion.div
          className="bg-dark-secondary rounded-xl p-6 border border-gray-800 hover:border-accent/30 transition-colors"
          variants={fadeInUp}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-purple-400">{testAccuracy}%</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Test Accuracy</h3>
          <p className="text-xs text-gray-500">Average test score</p>
        </motion.div>

        {/* Current Week */}
        <motion.div
          className="bg-dark-secondary rounded-xl p-6 border border-gray-800 hover:border-accent/30 transition-colors"
          variants={fadeInUp}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <span className="text-2xl font-bold text-accent">Week {currentWeekNumber}</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Current Week</h3>
          <p className="text-xs text-gray-500">{weekData?.progress || 0}% of roadmap</p>
        </motion.div>
      </motion.div>

      {/* Roadmap Progress */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Roadmap Progress</h2>
            <p className="text-gray-400 text-sm">Track your overall progress</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Overall Progress</div>
              <div className="text-2xl font-bold text-accent">{overallProgress}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-1">Week Progress</div>
              <div className="text-2xl font-bold text-blue-400">{weekData?.progress || 0}%</div>
            </div>
          </div>
        </div>
        <div className="h-3 bg-dark-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
        <div className="flex items-center gap-3 p-4 bg-dark-tertiary rounded-lg border border-accent/20">
          <div className="p-3 bg-accent/20 rounded-full">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Completed Java Refresher</h3>
            <p className="text-sm text-gray-400">100% completion rate</p>
          </div>
        </div>
      </div>

      {/* Current Week Lessons */}
      <motion.div
        className="bg-dark-secondary rounded-xl p-6 border border-gray-800"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Current Week: {weekData?.title || 'No Week Active'}</h2>
            <p className="text-gray-400 text-sm">{weekData?.lessonsCompleted || 0} of {weekData?.totalLessons || 0} lessons completed</p>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {weekData?.lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              className="bg-dark-tertiary rounded-lg p-5 border border-gray-800 hover:border-accent/30 transition-all group"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -3 }}
              transition={{ type: "spring", stiffness: 300, delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold group-hover:text-accent transition-colors">{lesson.title}</h3>
                    {lesson.completed && (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
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
        </motion.div>
      </motion.div>
    </div>
  );
}
