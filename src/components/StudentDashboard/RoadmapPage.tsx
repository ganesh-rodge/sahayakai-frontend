import { Target, TrendingUp, CheckCircle2, Clock, Play, Map, TreePine, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import RoadmapTree from './RoadmapTree';

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
  progress?: number;
  lessons: Lesson[];
}

interface RoadmapPageProps {
  learningGoal: string;
  weeks: Week[];
  onStartLesson: (lessonId: string) => void;
  onCreateRoadmap: () => void;
  onDeleteRoadmap: () => void;
  hasRoadmap: boolean;
}

export default function RoadmapPage({ learningGoal, weeks, onStartLesson, onCreateRoadmap, onDeleteRoadmap, hasRoadmap }: RoadmapPageProps) {
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number | null>(null);
  const [focusWeek, setFocusWeek] = useState<number | null>(null);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const totalLessons = weeks.reduce((total, week) => total + week.totalLessons, 0);
  const completedLessons = weeks.reduce((total, week) => total + week.lessonsCompleted, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // When switching to list view with a selected week, scroll to and highlight it.
  useEffect(() => {
    if (viewMode !== 'list' || !selectedWeekNumber) return;
    const el = sectionRefs.current[selectedWeekNumber];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFocusWeek(selectedWeekNumber);
      const t = setTimeout(() => setFocusWeek(null), 1600);
      return () => clearTimeout(t);
    }
  }, [viewMode, selectedWeekNumber]);

  // Debug: log weeks prop whenever it changes so dev can inspect mapped roadmap
  useEffect(() => {
    try {
      console.log('RoadmapPage - weeks prop:', weeks);
    } catch (e) {
      // silent
    }
  }, [weeks]);

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
          <h1 className="text-3xl font-bold mb-2">Learning Roadmap</h1>
          <p className="text-gray-300">Plan your personalized learning journey</p>
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
              <Map className="w-16 h-16 text-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">No Roadmap Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Create a personalized learning roadmap tailored to your goals and experience level. Our AI will guide you through a structured learning path.
          </p>
          <button
            onClick={onCreateRoadmap}
            className="px-8 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-medium hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            Create Roadmap
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
        <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Learning Roadmap</h1>
            <p className="text-gray-300 mb-4">Learning Roadmap: {learningGoal}</p>
            <div className="flex items-center gap-2 text-sm text-accent">
              <Target className="w-4 h-4" />
              <span className="font-medium">Goal:</span>
              <span className="text-gray-300">{learningGoal}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overall Progress Card */}
      <div className="bg-dark-secondary rounded-xl p-6 border border-gray-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Overall Progress</h2>
            <p className="text-gray-400 text-sm">{completedLessons} of {totalLessons} lessons completed</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-accent" />
            <span className="text-3xl font-bold text-accent">{overallProgress}%</span>
          </div>
        </div>
        <div className="h-4 bg-dark-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Roadmap Actions */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded-lg font-medium hover:shadow-lg hover:shadow-accent/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateRoadmap}
        >
          New Roadmap
        </motion.button>
        <motion.button
          className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-medium hover:bg-red-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDeleteRoadmap}
        >
          Delete Roadmap
        </motion.button>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-2 bg-dark-secondary border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              viewMode === 'tree'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'text-gray-300 hover:text-accent'
            }`}
            aria-pressed={viewMode === 'tree'}
          >
            <TreePine className="w-4 h-4" /> Tree
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              viewMode === 'list'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'text-gray-300 hover:text-accent'
            }`}
            aria-pressed={viewMode === 'list'}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {viewMode === 'tree' ? (
        <RoadmapTree
          weeks={weeks}
          onShowWeekInList={(week) => {
            setSelectedWeekNumber(week.weekNumber);
            setViewMode('list');
          }}
        />
      ) : (
        <div className="space-y-4">
        {weeks.map((week) => {
          const weekProgress = Math.round((week.lessonsCompleted / week.totalLessons) * 100);
          const isComplete = week.lessonsCompleted === week.totalLessons;

          return (
            <div
              key={week.weekNumber}
              ref={(el) => { sectionRefs.current[week.weekNumber] = el; }}
              className={`bg-dark-secondary rounded-xl p-6 border transition-all ${
                isComplete ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800'
              } ${focusWeek === week.weekNumber ? 'ring-2 ring-accent/60 ring-offset-2 ring-offset-dark-secondary' : ''}`}
            >
              {/* Week Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full border-2 ${
                      isComplete
                        ? 'bg-green-500/20 border-green-500'
                        : 'bg-dark-tertiary border-accent/30'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-7 h-7 text-green-500" />
                    ) : (
                      <span className="font-bold text-accent text-lg">W{week.weekNumber}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{week.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>{week.lessonsCompleted} of {week.totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={isComplete ? 'text-green-400 font-medium' : 'text-accent font-medium'}>
                          {weekProgress}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-3 bg-dark-tertiary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                        : 'bg-gradient-to-r from-accent to-accent-light'
                    }`}
                    style={{ width: `${weekProgress}%` }}
                  />
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {week.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border transition-all ${
                      lesson.completed
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-dark-tertiary border-gray-700 hover:border-accent/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{lesson.title}</h3>
                          {lesson.completed && (
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{lesson.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>

                    {!lesson.completed && (
                      <button
                        onClick={() => onStartLesson(lesson.id)}
                        className="w-full mt-3 px-3 py-1.5 bg-gradient-to-r from-accent to-accent-light text-dark-primary rounded text-xs font-medium hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3 h-3" />
                        Start
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
