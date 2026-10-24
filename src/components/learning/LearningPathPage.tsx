import React, { useState } from 'react';
import { Recommendation, Lesson, TopicId } from '../../types';
import { TOPICS } from '../../data/topics';
import { MasteryBadge } from '../common/MasteryBadge';
import { StorageService } from '../../services/storage';
import {
  Compass,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X,
  Code,
  Check,
  RotateCcw,
  Terminal,
  Layers,
  Cpu,
  Database,
  ArrowUpRight,
} from 'lucide-react';

interface LearningPathPageProps {
  recommendations: Recommendation[];
  lessons: Lesson[];
  onLessonsUpdated: (updatedLessons: Lesson[]) => void;
  onTakeQuizForTopic: (topicId: TopicId) => void;
  activeLessonId?: string;
  onCloseActiveLesson?: () => void;
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

export const LearningPathPage: React.FC<LearningPathPageProps> = ({
  recommendations,
  lessons,
  onLessonsUpdated,
  onTakeQuizForTopic,
  activeLessonId,
  onCloseActiveLesson,
  currentLanguage,
}) => {
  const [selectedLessonModal, setSelectedLessonModal] = useState<Lesson | null>(() => {
    if (activeLessonId) {
      return lessons.find((l) => l.id === activeLessonId) || null;
    }
    return null;
  });

  // Practice question state inside modal
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number>>({});
  const [showPracticeResults, setShowPracticeResults] = useState<Record<number, boolean>>({});

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLessonModal(lesson);
    setPracticeAnswers({});
    setShowPracticeResults({});
  };

  const handleCloseModal = () => {
    setSelectedLessonModal(null);
    if (onCloseActiveLesson) onCloseActiveLesson();
  };

  const handleToggleCompletion = (lessonId: string, currentStatus: boolean) => {
    const updated = StorageService.toggleLessonCompletion(lessonId, !currentStatus);
    onLessonsUpdated(updated);
    if (selectedLessonModal && selectedLessonModal.id === lessonId) {
      setSelectedLessonModal({
        ...selectedLessonModal,
        completed: !currentStatus,
        completedAt: !currentStatus ? new Date().toISOString() : undefined,
      });
    }
  };

  const handleSelectPracticeOption = (qIdx: number, optIdx: number) => {
    setPracticeAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setShowPracticeResults((prev) => ({ ...prev, [qIdx]: true }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Adaptive Curriculum
          </span>
          <span className="text-xs text-slate-500 font-medium">SDG 4: Quality Education</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Personalized Learning Path
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
          Your learning roadmap is automatically ordered by your diagnostic assessment accuracy.
          Topics requiring focused revision are prioritized first to build solid foundational intuition.
        </p>
      </div>

      {/* Prioritized Recommendation Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const topic = TOPICS[rec.topicId];
          const lesson = lessons.find((l) => l.topicId === rec.topicId) || lessons[0];
          const isHighestPriority = rec.priorityOrder === 1;

          return (
            <div
              key={rec.topicId}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                isHighestPriority
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                      isHighestPriority
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    #{rec.priorityOrder}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{topic.name}</span>
                      <MasteryBadge level={rec.classification} size="sm" />
                    </div>
                    <p className="text-xs text-indigo-600 font-medium">{topic.malayalamName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">
                    Accuracy:{' '}
                    <strong className="text-slate-900">
                      {rec.accuracy !== null ? `${rec.accuracy}%` : 'Not assessed'}
                    </strong>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rec.estimatedTime}
                  </span>
                </div>
              </div>

              {/* Recommendation Reason & Next Step */}
              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {rec.reason}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <p>
                    <strong className="text-slate-800">Target Objective:</strong>{' '}
                    {lesson.learningObjective}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <strong className="text-slate-700">Practice Goal:</strong>{' '}
                    {rec.suggestedPractice}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleCompletion(lesson.id, lesson.completed)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    lesson.completed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${lesson.completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{lesson.completed ? 'Lesson Completed' : 'Mark as Completed'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onTakeQuizForTopic(rec.topicId)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
                  >
                    Take Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenLesson(lesson)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                  >
                    <span>Open Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Interactive Lesson Modal */}
      {selectedLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Interactive Lesson Module
                  </span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {TOPICS[selectedLessonModal.topicId].name}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedLessonModal.title}
                </h2>
                <p className="text-xs text-indigo-600 font-medium">
                  {selectedLessonModal.malayalamTitle}
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
              {/* Learning Objective Box */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-1">
                <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  Learning Objective:
                </p>
                <p className="text-xs text-indigo-950 font-medium">
                  {selectedLessonModal.learningObjective}
                </p>
                <p className="text-[11px] text-indigo-800 pt-1 font-sans">
                  {selectedLessonModal.malayalamObjective}
                </p>
              </div>

              {/* Lesson Sections */}
              <div className="space-y-6">
                {selectedLessonModal.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3 pb-4 border-b border-slate-100 last:border-b-0">
                    <h3 className="text-base font-bold text-slate-900">{section.heading}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {section.body}
                    </p>

                    {/* Code Snippet if present */}
                    {section.code && (
                      <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                        <pre>{section.code}</pre>
                      </div>
                    )}

                    {/* Malayalam Summary Note */}
                    {section.malayalamSummary && (
                      <div className="p-3 bg-slate-50 border-l-4 border-indigo-600 rounded-r-xl text-xs text-slate-800">
                        <strong className="text-indigo-900 font-bold block mb-0.5">
                          മലയാളം സംഗ്രഹം (Malayalam Summary):
                        </strong>
                        <p>{section.malayalamSummary}</p>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    {section.keyPoints && section.keyPoints.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                        {section.keyPoints.map((kp, kpIdx) => (
                          <li key={kpIdx}>{kp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Practice Checkpoint Questions */}
              {selectedLessonModal.practiceQuestions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Quick Practice Checkpoint
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {selectedLessonModal.practiceQuestions.map((pq, pqIdx) => {
                      const userPick = practiceAnswers[pqIdx];
                      const isRevealed = showPracticeResults[pqIdx];

                      return (
                        <div key={pqIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <p className="font-bold text-slate-900 text-sm">{pq.question}</p>
                          <div className="space-y-2">
                            {pq.options.map((opt, optIdx) => {
                              const isSelected = userPick === optIdx;
                              const isCorrect = pq.answerIndex === optIdx;

                              let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50';
                              if (isRevealed) {
                                if (isCorrect) {
                                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                                } else if (isSelected && !isCorrect) {
                                  btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectPracticeOption(pqIdx, optIdx)}
                                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${btnStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {isRevealed && (
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                              <strong className="text-slate-900 block mb-0.5">Explanation:</strong>
                              <p>{pq.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  handleToggleCompletion(selectedLessonModal.id, selectedLessonModal.completed)
                }
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  selectedLessonModal.completed
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {selectedLessonModal.completed ? 'Lesson Completed' : 'Mark as Completed'}
                </span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const tid = selectedLessonModal.topicId;
                    handleCloseModal();
                    onTakeQuizForTopic(tid);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  Take {TOPICS[selectedLessonModal.topicId].name} Quiz
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
