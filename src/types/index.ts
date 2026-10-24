export type TopicId = 'python' | 'data-structures' | 'algorithms' | 'dbms';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type MasteryLevel = 'Needs focused revision' | 'Developing' | 'Strong' | 'Not assessed';

export interface TopicInfo {
  id: TopicId;
  name: string;
  malayalamName: string;
  tagline: string;
  description: string;
  color: string;
  badgeBg: string;
  accentBorder: string;
  iconName: string;
}

export interface Question {
  id: string;
  topicId: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0-indexed (0, 1, 2, 3)
  explanation: string;
  malayalamExplanation: string;
  codeSnippet?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number; // -1 if skipped
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  topicId: TopicId;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: QuizAnswer[];
  isDemoSample?: boolean;
  timeTakenSeconds?: number;
}

export interface TopicPerformance {
  topicId: TopicId;
  topicName: string;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  accuracy: number | null; // null represents 'Not assessed'
  classification: MasteryLevel;
  attemptsCount: number;
  latestScorePercentage: number | null;
  lastAttemptTimestamp?: string;
}

export interface Recommendation {
  topicId: TopicId;
  topicName: string;
  accuracy: number | null;
  classification: MasteryLevel;
  priorityOrder: number;
  reason: string;
  suggestedLessonId: string;
  suggestedLessonTitle: string;
  suggestedPractice: string;
  estimatedTime: string;
}

export interface LessonContentSection {
  heading: string;
  body: string;
  code?: string;
  malayalamSummary?: string;
  keyPoints?: string[];
}

export interface LessonPracticeQuestion {
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
  malayalamExplanation?: string;
}

export interface Lesson {
  id: string;
  topicId: TopicId;
  title: string;
  malayalamTitle: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  learningObjective: string;
  malayalamObjective: string;
  sections: LessonContentSection[];
  practiceQuestions: LessonPracticeQuestion[];
  completed: boolean;
  completedAt?: string;
}

export interface StudentProfile {
  name: string;
  preferredLanguage: 'en' | 'ml';
  streakDays: number;
  targetGoal: string;
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: 'en' | 'ml';
  isFallback?: boolean;
  topicContext?: string;
}
