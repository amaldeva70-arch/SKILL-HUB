import React from 'react';
import {
  StudentProfile,
  QuizAttempt,
  TopicPerformance,
  Recommendation,
  Lesson,
  TopicId,
} from '../../types';
import { TOPICS, TOPIC_LIST } from '../../data/topics';
import { MasteryBadge } from '../common/MasteryBadge';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock,
  Flame,
  Award,
  BookOpen,
  AlertCircle,
  HelpCircle,
  Layers,
  Terminal,
  Cpu,
  Database,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';

interface DashboardPageProps {
  profile: StudentProfile;
  attempts: QuizAttempt[];
  topicPerformances: Record<TopicId, TopicPerformance>;
  recommendations: Recommendation[];
  primaryRecommendation: Recommendation | null;
  overallAccuracy: number | null;
  lessons: Lesson[];
  onStartQuiz: (topicId: TopicId) => void;
  onOpenLesson: (lessonId: string) => void;
  onNavigate: (page: string) => void;
  currentLanguage: 'en' | 'ml';
}

const getTopicIcon = (iconName: string) => {
  switch (iconName) {
    case 'Terminal':
      return <Terminal className="w-5 h-5 text-sky-600" />;
    case 'Layers':
      return <Layers className="w-5 h-5 text-indigo-600" />;
    case 'Cpu':
      return <Cpu className="w-5 h-5 text-violet-600" />;
    case 'Database':
      return <Database className="w-5 h-5 text-teal-600" />;
    default:
      return <BookOpen className="w-5 h-5 text-indigo-600" />;
  }
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  attempts,
  topicPerformances,
  primaryRecommendation,
  overallAccuracy,
  lessons,
  onStartQuiz,
  onOpenLesson,
  onNavigate,
  currentLanguage,
}) => {
  const completedLessonsCount = lessons.filter((l) => l.completed).length;

  // Prepare chart data for Recharts
  const chartData = TOPIC_LIST.map((topic) => {
    const perf = topicPerformances[topic.id];
    return {
      topicKey: topic.id,
      name: currentLanguage === 'ml' ? topic.malayalamName : topic.name,
      shortName:
        topic.id === 'data-structures'
          ? 'Data Structures'
          : topic.id === 'algorithms'
          ? 'Algorithms'
          : topic.id === 'dbms'
          ? 'DBMS'
          : 'Python',
      accuracy: perf.accuracy !== null ? perf.accuracy : 0,
      isAssessed: perf.accuracy !== null,
      classification: perf.classification,
      correct: perf.totalCorrect,
      attempted: perf.totalAttempted,
    };
  });

  const getBarColor = (accuracy: number, isAssessed: boolean) => {
    if (!isAssessed) return '#94a3b8'; // slate-400
    if (accuracy < 50) return '#f43f5e'; // rose-500
    if (accuracy < 75) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner & Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                SDG 4: Quality Education
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {profile.streakDays}-Day Activity Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentLanguage === 'ml'
                ? `സ്വാഗതം, ${profile.name}!`
                : `Welcome back, ${profile.name}!`}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {currentLanguage === 'ml'
                ? 'നിങ്ങളുടെ കമ്പ്യൂട്ടർ സയൻസ് ഡയഗ്നോസ്റ്റിക് ഫലങ്ങൾ പരിശോധിക്കുകയും വിജ്ഞാന വിടവുകൾ നികത്താൻ പഠനയാത്ര തുടരുകയും ചെയ്യുക.'
                : 'Every learner is different. SkillBridge AI benchmarks your skills, identifies knowledge gaps, and tailors your learning roadmap.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:translate-y-[-1px]"
            >
              <BookOpen className="w-4 h-4" />
              <span>{currentLanguage === 'ml' ? 'ക്വിസ് ആരംഭിക്കുക' : 'Take Diagnostic Quiz'}</span>
            </button>
            <button
              onClick={() => onNavigate('assistant')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span>{currentLanguage === 'ml' ? 'AI ട്യൂട്ടർ' : 'Ask AI Tutor'}</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row inside banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 font-medium">Overall Accuracy</p>
            <p className="text-2xl font-bold text-white mt-1">
              {overallAccuracy !== null ? `${overallAccuracy}%` : 'Not assessed'}
            </p>
            <p className="text-[11px] text-indigo-300 mt-0.5">Across assessed topics</p>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 font-medium">Quizzes Completed</p>
            <p className="text-2xl font-bold text-white mt-1">{attempts.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Diagnostic benchmarks</p>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 font-medium">Lessons Mastered</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {completedLessonsCount} / {lessons.length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Interactive modules</p>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-xs text-slate-400 font-medium">Urgent Priority</p>
            <p className="text-base font-bold text-rose-300 mt-1 truncate">
              {primaryRecommendation?.topicName || 'None'}
            </p>
            <p className="text-[11px] text-rose-400 mt-0.5 font-medium">
              {primaryRecommendation?.accuracy !== null
                ? `${primaryRecommendation?.accuracy}% accuracy`
                : 'Pending test'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Recommendation Hero Card (Rule-based Engine Output) */}
      {primaryRecommendation && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                #1
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Recommended Next Step
                  </span>
                  <MasteryBadge level={primaryRecommendation.classification} size="sm" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  Priority: {primaryRecommendation.topicName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Estimated Time:</span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                {primaryRecommendation.estimatedTime}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                {primaryRecommendation.reason}
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Next Action:</strong>{' '}
                  {primaryRecommendation.suggestedPractice}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => onOpenLesson(primaryRecommendation.suggestedLessonId)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                <span>Open Recommended Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onStartQuiz(primaryRecommendation.topicId)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-colors"
              >
                <span>Take Diagnostic Quiz for This Topic</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Topic Mastery Chart & Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts Topic Mastery Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Topic Mastery Overview</h3>
                <p className="text-xs text-slate-500">
                  Calculated from cumulative diagnostic quiz submissions
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-600">&lt;50% Needs Rev</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600">50-74% Developing</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600">&gt;=75% Strong</span>
                </span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
                >
                  <XAxis
                    dataKey="shortName"
                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-100">{data.name}</p>
                            <p className="text-slate-300">
                              Accuracy:{' '}
                              <span className="font-bold text-white">
                                {data.isAssessed ? `${data.accuracy}%` : 'Not assessed'}
                              </span>
                            </p>
                            {data.isAssessed && (
                              <p className="text-slate-400">
                                Score: {data.correct} / {data.attempted} correct
                              </p>
                            )}
                            <p className="text-indigo-300 font-semibold mt-1">
                              Status: {data.classification}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={75}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Strong (75%)',
                      position: 'top',
                      fill: '#059669',
                      fontSize: 10,
                    }}
                  />
                  <ReferenceLine
                    y={50}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Revision (<50%)',
                      position: 'bottom',
                      fill: '#e11d48',
                      fontSize: 10,
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.accuracy, entry.isAssessed)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mt-2 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">
              Data Structures is currently the lowest-scoring topic (40%). Retaking its diagnostic
              will dynamically update this chart.
            </span>
            <button
              onClick={() => onStartQuiz('data-structures')}
              className="text-indigo-600 font-bold hover:underline flex-shrink-0 ml-3"
            >
              Test DS Now &rarr;
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Launcher & Topics List */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Computer Science Modules</h3>
            <p className="text-xs text-slate-500 mb-4">Select any topic to benchmark or review</p>

            <div className="space-y-3">
              {TOPIC_LIST.map((topic) => {
                const perf = topicPerformances[topic.id];
                return (
                  <div
                    key={topic.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {getTopicIcon(topic.iconName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{topic.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {currentLanguage === 'ml' ? topic.malayalamName : topic.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-900">
                        {perf.accuracy !== null ? `${perf.accuracy}%` : 'Pending'}
                      </span>
                      <MasteryBadge level={perf.classification} size="sm" showIcon={false} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('quiz')}
            className="w-full mt-4 py-2.5 px-4 bg-slate-900 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
          >
            Launch Full Diagnostic Assessment
          </button>
        </div>
      </div>

      {/* 4. Continue Learning & Interactive Lessons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Continue Learning</h3>
            <p className="text-xs text-slate-500">
              Interactive modules designed to build intuition with code and Malayalam explanations
            </p>
          </div>
          <button
            onClick={() => onNavigate('learning')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Learning Paths</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lessons.map((lesson) => {
            const topic = TOPICS[lesson.topicId];
            return (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                {lesson.completed && (
                  <div className="absolute top-3 right-3 text-emerald-600 bg-emerald-50 rounded-full p-1 border border-emerald-200">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-2">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${topic.badgeBg}`}>
                    {topic.name}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{lesson.learningObjective}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.estimatedMinutes} mins
                  </span>
                  <button
                    onClick={() => onOpenLesson(lesson.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>{lesson.completed ? 'Review' : 'Start'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Quiz Attempts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Quiz Attempts</h3>
            <p className="text-xs text-slate-500">
              Historical assessments recorded for this student profile
            </p>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View Full History &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Evaluation</th>
                <th className="py-3 px-4">Data Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {attempts.slice(0, 5).map((attempt) => {
                const topic = TOPICS[attempt.topicId];
                return (
                  <tr key={attempt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(attempt.timestamp).toLocaleDateString()}{' '}
                      {new Date(attempt.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{topic.name}</td>
                    <td className="py-3 px-4 font-semibold">
                      {attempt.score} / {attempt.totalQuestions}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{attempt.percentage}%</td>
                    <td className="py-3 px-4">
                      {attempt.percentage >= 75 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Strong
                        </span>
                      ) : attempt.percentage >= 50 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Developing
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Needs Revision
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {attempt.isDemoSample ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Sample Demonstration Data
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Live Student Attempt
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
