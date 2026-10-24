import React from 'react';
import { QuizAttempt, TopicPerformance, Lesson, TopicId } from '../../types';
import { TOPICS, TOPIC_LIST } from '../../data/topics';
import { MasteryBadge } from '../common/MasteryBadge';
import {
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Flame,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface ProgressPageProps {
  attempts: QuizAttempt[];
  topicPerformances: Record<TopicId, TopicPerformance>;
  lessons: Lesson[];
  onTakeQuiz: (topicId?: TopicId) => void;
  onOpenLesson: (lessonId: string) => void;
  currentLanguage: 'en' | 'ml';
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  attempts,
  topicPerformances,
  lessons,
  onTakeQuiz,
  onOpenLesson,
  currentLanguage,
}) => {
  // If no attempts (empty state)
  if (attempts.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Assessment History Yet</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          You haven't completed any diagnostic quizzes yet. Take your first quiz to calculate
          your topic mastery and populate personalized growth analytics.
        </p>
        <button
          onClick={() => onTakeQuiz('data-structures')}
          className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all"
        >
          Take First Diagnostic Quiz
        </button>
      </div>
    );
  }

  // Calculate score trend data sorted chronologically
  const chronologicalAttempts = [...attempts].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const trendChartData = chronologicalAttempts.map((att, idx) => ({
    attemptNum: `#${idx + 1}`,
    topicName: TOPICS[att.topicId].name,
    percentage: att.percentage,
    date: new Date(att.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    isDemo: att.isDemoSample,
  }));

  // Improvement metric: compare first attempt percentage to latest attempt
  const firstScore = chronologicalAttempts[0]?.percentage || 0;
  const latestScore = chronologicalAttempts[chronologicalAttempts.length - 1]?.percentage || 0;
  const improvementDelta = latestScore - firstScore;

  // Topic-level comparison data
  const topicCompData = TOPIC_LIST.map((t) => {
    const perf = topicPerformances[t.id];
    return {
      name: t.name,
      accuracy: perf.accuracy !== null ? perf.accuracy : 0,
      isAssessed: perf.accuracy !== null,
      classification: perf.classification,
    };
  });

  const completedLessons = lessons.filter((l) => l.completed);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Analytics &amp; Historical Trajectory
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Learning Progress &amp; Growth Trends
        </h1>
        <p className="text-xs text-slate-500">
          Persistent evaluation tracking student diagnostic attempts, mastery transitions, and lesson milestones.
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Diagnostic Attempts</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{attempts.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total tests recorded</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Latest Attempt Score</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{latestScore}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Most recent test</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Attempt Improvement</p>
          <p
            className={`text-2xl font-bold mt-1 ${
              improvementDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {improvementDelta > 0 ? `+${improvementDelta}%` : `${improvementDelta}%`}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Trajectory between tests</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Completed Lessons</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {completedLessons.length} / {lessons.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Modules finalized</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Trend Line Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Score Trend Over Time</h3>
                <p className="text-xs text-slate-500">Chronological accuracy trajectory</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-bold">
                Recharts
              </span>
            </div>

            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendChartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="attemptNum" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-100">
                              {d.attemptNum}: {d.topicName}
                            </p>
                            <p className="text-slate-300">
                              Score: <span className="font-bold text-white">{d.percentage}%</span>
                            </p>
                            <p className="text-slate-400">{d.date}</p>
                            {d.isDemo && (
                              <p className="text-amber-300 text-[10px]">Sample Demo Data</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-2">
            Higher scores demonstrate effective knowledge gap remediation.
          </p>
        </div>

        {/* Topic-Level Comparison Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Topic-Level Accuracy Breakdown</h3>
                <p className="text-xs text-slate-500">Cross-subject proficiency evaluation</p>
              </div>
            </div>

            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicCompData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                            <p className="font-bold text-slate-100">{d.name}</p>
                            <p className="text-slate-300">
                              Accuracy:{' '}
                              <span className="font-bold text-white">
                                {d.isAssessed ? `${d.accuracy}%` : 'Not assessed'}
                              </span>
                            </p>
                            <p className="text-indigo-300 font-semibold">{d.classification}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                    {topicCompData.map((entry, index) => {
                      const color =
                        !entry.isAssessed
                          ? '#94a3b8'
                          : entry.accuracy < 50
                          ? '#f43f5e'
                          : entry.accuracy < 75
                          ? '#f59e0b'
                          : '#10b981';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-500 font-medium">
              Data Structures is lowest (40%) &bull; DBMS is highest (100%)
            </span>
            <button
              onClick={() => onTakeQuiz('data-structures')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Retake DS &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Full History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Complete Assessment Log</h3>
            <p className="text-xs text-slate-500">Every recorded diagnostic submission</p>
          </div>
          <button
            onClick={() => onTakeQuiz()}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            New Quiz
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Attempt #</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Mastery Status</th>
                <th className="py-3 px-4">Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {attempts.map((att, idx) => {
                const topic = TOPICS[att.topicId];
                return (
                  <tr key={att.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{attempts.length - idx}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(att.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{topic.name}</td>
                    <td className="py-3 px-4 font-medium">
                      {att.score} / {att.totalQuestions}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{att.percentage}%</td>
                    <td className="py-3 px-4">
                      {att.percentage >= 75 ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Strong
                        </span>
                      ) : att.percentage >= 50 ? (
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
                      {att.isDemoSample ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Sample Demonstration Data
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Live Student Assessment
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
