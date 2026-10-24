import React, { useState, useEffect } from 'react';
import { TopicId, Question, QuizAttempt, QuizAnswer } from '../../types';
import { TOPICS, TOPIC_LIST } from '../../data/topics';
import { QUESTION_BANK } from '../../data/questionBank';
import { StorageService } from '../../services/storage';
import {
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Layers,
  Cpu,
  Database,
  ChevronRight,
} from 'lucide-react';

interface QuizPageProps {
  initialTopicId?: TopicId;
  onQuizComplete: (attempt: QuizAttempt) => void;
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
      return <HelpCircle className="w-5 h-5 text-indigo-600" />;
  }
};

export const QuizPage: React.FC<QuizPageProps> = ({
  initialTopicId = 'data-structures',
  onQuizComplete,
  currentLanguage,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>(initialTopicId);
  const [quizLength, setQuizLength] = useState<5 | 10>(5);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Sync if initialTopicId prop updates
  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
    }
  }, [initialTopicId]);

  // Quiz timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuizActive) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizActive]);

  const handleStartQuiz = () => {
    const topicQuestions = QUESTION_BANK.filter((q) => q.topicId === selectedTopicId);
    // Shuffle or select slice
    const selected = topicQuestions.slice(0, quizLength);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setSecondsElapsed(0);
    setIsQuizActive(true);
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleClearSelection = () => {
    const currentQ = questions[currentIndex];
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSubmitQuiz = () => {
    // Calculate real score and generate answers array
    let score = 0;
    const finalAnswers: QuizAnswer[] = questions.map((q) => {
      const selectedOption = answers[q.id] !== undefined ? answers[q.id] : -1;
      const isCorrect = selectedOption === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        questionId: q.id,
        selectedOption,
        isCorrect,
      };
    });

    const percentage = Math.round((score / questions.length) * 100);

    const newAttempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      topicId: selectedTopicId,
      score,
      totalQuestions: questions.length,
      percentage,
      answers: finalAnswers,
      isDemoSample: false, // Live student result
      timeTakenSeconds: secondsElapsed,
    };

    // Save to storage
    StorageService.addQuizAttempt(newAttempt);

    setIsQuizActive(false);
    setShowSubmitModal(false);
    onQuizComplete(newAttempt);
  };

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Render Setup / Topic Selection View
  if (!isQuizActive) {
    const selectedTopic = TOPICS[selectedTopicId];

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Adaptive Diagnostic Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Diagnostic Knowledge Gap Quiz
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Choose a subject to pinpoint your specific strengths and weaknesses. Results are evaluated
            deterministically to generate customized learning recommendations.
          </p>
        </div>

        {/* 1. Topic Selection Cards */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Step 1: Select Computer Science Topic
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOPIC_LIST.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-5 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-indigo-600 bg-indigo-100 rounded-full p-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      {getTopicIcon(topic.iconName)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{topic.name}</h3>
                      <p className="text-xs text-indigo-600 font-medium">{topic.malayalamName}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">{topic.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Quiz Length Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Step 2: Choose Assessment Length
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setQuizLength(5)}
              className={`p-4 rounded-xl border text-left transition-all ${
                quizLength === 5
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">5 Questions</span>
                <span className="text-xs font-medium text-slate-500">~5 mins</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Quick diagnostic to rapidly uncover core misconceptions.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setQuizLength(10)}
              className={`p-4 rounded-xl border text-left transition-all ${
                quizLength === 10
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">10 Questions</span>
                <span className="text-xs font-medium text-slate-500">~10 mins</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Comprehensive benchmark covering edge cases and advanced concepts.
              </p>
            </button>
          </div>
        </div>

        {/* 3. Pre-Quiz Guidelines Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600">
          <p className="font-bold text-slate-800">Quiz Integrity &amp; Scoring Details:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Correct answers are not shown until you officially submit your assessment.</li>
            <li>Calculated accuracy directly influences your personalized learning path.</li>
            <li>Each question includes detailed English and Malayalam explanations post-submission.</li>
          </ul>
        </div>

        {/* 4. Start Button */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleStartQuiz}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start {selectedTopic.name} Diagnostic</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const currentQ = questions[currentIndex];
  const selectedOptionForCurrentQ = answers[currentQ.id];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Quiz Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Diagnostic in Progress
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            {TOPICS[selectedTopicId].name}
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="font-mono font-bold text-slate-800">{formatTime(secondsElapsed)}</span>
          </div>

          <div className="text-slate-500">
            Answered:{' '}
            <strong className="text-slate-800">
              {answeredCount} / {questions.length}
            </strong>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Meta badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentQ.subtopic}
            </span>
          </div>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              currentQ.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : currentQ.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Optional Code Snippet */}
          {currentQ.codeSnippet && (
            <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* 4 Multiple Choice Options (No answers revealed before submit!) */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOptionForCurrentQ === idx;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {letters[idx]}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-indigo-950 font-semibold' : 'text-slate-800'}`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clear selection link */}
        {selectedOptionForCurrentQ !== undefined && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              currentIndex === 0
                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Jump Palette */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
          Question Palette
        </p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-sm'
                    : isAnswered
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ready to Submit?</h3>
                <p className="text-xs text-slate-500">
                  Topic: {TOPICS[selectedTopicId].name}
                </p>
              </div>
            </div>

            {unansweredCount > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Notice:</strong> You have{' '}
                  <span className="font-bold">{unansweredCount}</span> unattempted{' '}
                  {unansweredCount === 1 ? 'question' : 'questions'}. They will be counted as
                  incorrect.
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                You have answered all {questions.length} questions. Your score will be calculated
                immediately and your topic mastery will be updated.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                Confirm &amp; See Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
