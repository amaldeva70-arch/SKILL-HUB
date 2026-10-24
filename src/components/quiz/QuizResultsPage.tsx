import React, { useState } from 'react';
import { QuizAttempt, Question, TopicPerformance } from '../../types';
import { TOPICS } from '../../data/topics';
import { QUESTION_BANK } from '../../data/questionBank';
import { MasteryBadge } from '../common/MasteryBadge';
import { AiService } from '../../services/aiService';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  AlertTriangle,
  Globe,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface QuizResultsPageProps {
  attempt: QuizAttempt;
  topicPerformance?: TopicPerformance;
  onRetryQuiz: (topicId: string) => void;
  onOpenLesson: (topicId: string) => void;
  onGoToDashboard: () => void;
  currentLanguage: 'en' | 'ml';
}

export const QuizResultsPage: React.FC<QuizResultsPageProps> = ({
  attempt,
  topicPerformance,
  onRetryQuiz,
  onOpenLesson,
  onGoToDashboard,
  currentLanguage,
}) => {
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({});
  const [selectedLanguageForAi, setSelectedLanguageForAi] = useState<'en' | 'ml'>(currentLanguage);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const topic = TOPICS[attempt.topicId];
  const correctCount = attempt.score;
  const totalCount = attempt.totalQuestions;
  const incorrectCount = totalCount - correctCount;
  const percentage = attempt.percentage;

  // Find all question models for this attempt
  const questionDetails = attempt.answers.map((ans) => {
    const q = QUESTION_BANK.find((item) => item.id === ans.questionId);
    return {
      answer: ans,
      question: q,
    };
  });

  const toggleExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleRequestAiExplanation = async (
    qId: string,
    question: Question,
    studentOptionIndex: number
  ) => {
    const studentAnswerText =
      studentOptionIndex >= 0 ? question.options[studentOptionIndex] : 'Unanswered / Skipped';
    const correctAnswerText = question.options[question.correctAnswer];

    setLoadingAi((prev) => ({ ...prev, [qId]: true }));
    try {
      const res = await AiService.explainQuizAnswer({
        question: question.question,
        studentAnswer: studentAnswerText,
        correctAnswer: correctAnswerText,
        explanation: question.explanation,
        language: selectedLanguageForAi,
        topic: topic.name,
      });

      setAiExplanations((prev) => ({ ...prev, [qId]: res.text }));
      setExpandedQuestions((prev) => ({ ...prev, [qId]: true }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi((prev) => ({ ...prev, [qId]: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* 1. Header & Summary Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Diagnostic Assessment Complete
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {topic.name} Evaluation
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Submitted on {new Date(attempt.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onRetryQuiz(attempt.topicId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => onOpenLesson(attempt.topicId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Recommended Lesson</span>
            </button>
          </div>
        </div>

        {/* Big Score Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-center items-center text-center">
            <span className="text-xs font-medium text-slate-500">Total Score</span>
            <span className="text-3xl font-black text-slate-900 mt-1">
              {correctCount} / {totalCount}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">Questions Correct</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-center items-center text-center">
            <span className="text-xs font-medium text-slate-500">Calculated Accuracy</span>
            <span
              className={`text-3xl font-black mt-1 ${
                percentage >= 75
                  ? 'text-emerald-600'
                  : percentage >= 50
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {percentage}%
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">Rule-based score</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-center items-center text-center">
            <span className="text-xs font-medium text-slate-500">Mastery Classification</span>
            <div className="mt-2">
              <MasteryBadge
                level={
                  percentage >= 75
                    ? 'Strong'
                    : percentage >= 50
                    ? 'Developing'
                    : 'Needs focused revision'
                }
                size="md"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">SDG 4 Standard</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-center items-center text-center">
            <span className="text-xs font-medium text-slate-500">Knowledge Gaps</span>
            <span className="text-3xl font-black text-rose-600 mt-1">{incorrectCount}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              {incorrectCount === 0 ? 'Flawless attempt' : 'Concepts to review'}
            </span>
          </div>
        </div>

        {/* Feedback Alert Box */}
        <div className="mt-6 p-4 rounded-2xl border bg-slate-50/70 border-slate-200 text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            {percentage >= 75 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>Knowledge Gap Analysis &amp; Recommendation:</span>
          </p>
          <p className="leading-relaxed">
            {percentage >= 75
              ? `Excellent performance in ${topic.name}! You demonstrated solid comprehension across key principles. Continue reviewing advanced edge cases to maintain retention.`
              : percentage >= 50
              ? `Developing comprehension in ${topic.name}. You grasped the fundamental rules but encountered obstacles on application questions. We have scheduled targeted revision.`
              : `Knowledge gap detected in ${topic.name} (${percentage}% accuracy). The recommendation engine has prioritized this topic to the top of your learning path.`}
          </p>
        </div>
      </div>

      {/* 2. Detailed Question-by-Question Review */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Question-by-Question Analysis</h3>
            <p className="text-xs text-slate-500">
              Inspect your chosen answer, correct reasoning, and bilingual explanations
            </p>
          </div>

          {/* AI Explanation Language Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500 font-medium">Explain with AI in:</span>
            <button
              onClick={() => setSelectedLanguageForAi('en')}
              className={`font-semibold px-2 py-0.5 rounded ${
                selectedLanguageForAi === 'en'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setSelectedLanguageForAi('ml')}
              className={`font-semibold px-2 py-0.5 rounded ${
                selectedLanguageForAi === 'ml'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              മലയാളം
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {questionDetails.map(({ answer, question }, idx) => {
            if (!question) return null;
            const isCorrect = answer.isCorrect;
            const letters = ['A', 'B', 'C', 'D'];
            const studentChoice = answer.selectedOption;
            const isExpanded = expandedQuestions[question.id] || !isCorrect; // auto-expand wrong answers

            return (
              <div
                key={question.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isCorrect
                    ? 'border-slate-200 shadow-xs'
                    : 'border-rose-200 bg-rose-50/10 shadow-xs'
                }`}
              >
                {/* Collapsible header */}
                <div
                  onClick={() => toggleExpand(question.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 rounded-2xl transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCorrect ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Question {idx + 1}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                          {question.subtopic}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {question.question}
                      </h4>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
                    {question.codeSnippet && (
                      <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                        <pre>{question.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Options list showing student selection vs correct answer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {question.options.map((opt, optIdx) => {
                        const isStudentPick = studentChoice === optIdx;
                        const isRightAnswer = question.correctAnswer === optIdx;

                        let optClasses = 'border-slate-200 bg-white text-slate-700';
                        if (isRightAnswer) {
                          optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                        } else if (isStudentPick && !isRightAnswer) {
                          optClasses = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 ${optClasses}`}
                          >
                            <span className="w-5 h-5 rounded font-bold flex items-center justify-center bg-slate-100 text-slate-600 text-[11px] flex-shrink-0">
                              {letters[optIdx]}
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                            {isRightAnswer && (
                              <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                                Correct
                              </span>
                            )}
                            {isStudentPick && !isRightAnswer && (
                              <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded">
                                Your Pick
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Curated Explanation Box */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                      <div>
                        <strong className="text-slate-900 font-bold block mb-1">
                          Standard Explanation:
                        </strong>
                        <p className="leading-relaxed">{question.explanation}</p>
                      </div>

                      {/* Malayalam explanation note */}
                      <div className="pt-2 border-t border-slate-200/80">
                        <strong className="text-indigo-900 font-bold block mb-1">
                          മലയാളം വിവരണം (Malayalam Summary):
                        </strong>
                        <p className="text-slate-800 leading-relaxed font-sans">
                          {question.malayalamExplanation}
                        </p>
                      </div>
                    </div>

                    {/* AI Explanation Result or Button */}
                    <div className="pt-1">
                      {aiExplanations[question.id] ? (
                        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>
                              SkillBridge AI Pedagogical Breakdown (
                              {selectedLanguageForAi === 'ml' ? 'മലയാളം' : 'English'})
                            </span>
                          </div>
                          <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                            {aiExplanations[question.id]}
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleRequestAiExplanation(question.id, question, studentChoice)
                          }
                          disabled={loadingAi[question.id]}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-colors"
                        >
                          {loadingAi[question.id] ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating AI explanation...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                              <span>
                                Ask AI Tutor to Explain this (
                                {selectedLanguageForAi === 'ml' ? 'മലയാളം' : 'English'})
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Next Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 rounded-2xl text-white">
        <div>
          <h4 className="text-sm font-bold text-white">Continue Your Personalized Learning Journey</h4>
          <p className="text-xs text-slate-400">
            Open the tailored lesson module to cement your understanding, then re-benchmark.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToDashboard}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => onOpenLesson(attempt.topicId)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
          >
            <span>Proceed to Learning Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
