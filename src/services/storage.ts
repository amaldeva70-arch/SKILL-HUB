import { QuizAttempt, StudentProfile, Lesson } from '../types';
import { INITIAL_LESSONS } from '../data/lessonsData';

const STORAGE_KEYS = {
  PROFILE: 'skillbridge_student_profile_v1',
  ATTEMPTS: 'skillbridge_quiz_attempts_v1',
  LESSONS: 'skillbridge_lessons_v1',
};

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Ananya Sharma',
  preferredLanguage: 'en',
  streakDays: 4,
  targetGoal: 'SDG 4: Master Core CS Foundations',
  joinedDate: '2026-10-18T10:00:00Z',
};

// Seed attempts matching the prompt's required illustrative scores:
// Python: 80% (4/5)
// Data Structures: 40% (2/5)
// Algorithms: 60% (3/5)
// DBMS: 100% (5/5)
const SEED_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'seed_attempt_py',
    timestamp: '2026-10-22T14:30:00Z',
    topicId: 'python',
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    isDemoSample: true,
    timeTakenSeconds: 145,
    answers: [
      { questionId: 'py_01', selectedOption: 3, isCorrect: true },
      { questionId: 'py_02', selectedOption: 1, isCorrect: true },
      { questionId: 'py_03', selectedOption: 0, isCorrect: true },
      { questionId: 'py_04', selectedOption: 0, isCorrect: false }, // Missed dict get vs bracket
      { questionId: 'py_05', selectedOption: 2, isCorrect: true },
    ],
  },
  {
    id: 'seed_attempt_ds',
    timestamp: '2026-10-23T09:15:00Z',
    topicId: 'data-structures',
    score: 2,
    totalQuestions: 5,
    percentage: 40,
    isDemoSample: true,
    timeTakenSeconds: 190,
    answers: [
      { questionId: 'ds_01', selectedOption: 0, isCorrect: false }, // Missed head insertion O(1)
      { questionId: 'ds_02', selectedOption: 1, isCorrect: true },
      { questionId: 'ds_03', selectedOption: 1, isCorrect: true },
      { questionId: 'ds_04', selectedOption: 2, isCorrect: false }, // Missed BST condition
      { questionId: 'ds_05', selectedOption: 0, isCorrect: false }, // Missed Inorder traversal
    ],
  },
  {
    id: 'seed_attempt_algo',
    timestamp: '2026-10-23T16:45:00Z',
    topicId: 'algorithms',
    score: 3,
    totalQuestions: 5,
    percentage: 60,
    isDemoSample: true,
    timeTakenSeconds: 160,
    answers: [
      { questionId: 'algo_01', selectedOption: 1, isCorrect: true },
      { questionId: 'algo_02', selectedOption: 1, isCorrect: true },
      { questionId: 'algo_03', selectedOption: 2, isCorrect: true },
      { questionId: 'algo_04', selectedOption: 1, isCorrect: false }, // Missed Merge Sort O(N) space
      { questionId: 'algo_06', selectedOption: 0, isCorrect: false }, // Missed Quicksort sorted worst-case
    ],
  },
  {
    id: 'seed_attempt_dbms',
    timestamp: '2026-10-24T08:00:00Z',
    topicId: 'dbms',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    isDemoSample: true,
    timeTakenSeconds: 120,
    answers: [
      { questionId: 'dbms_01', selectedOption: 1, isCorrect: true },
      { questionId: 'dbms_02', selectedOption: 1, isCorrect: true },
      { questionId: 'dbms_03', selectedOption: 1, isCorrect: true },
      { questionId: 'dbms_04', selectedOption: 0, isCorrect: true },
      { questionId: 'dbms_05', selectedOption: 1, isCorrect: true },
    ],
  },
];

export class StorageService {
  public static getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed reading profile from localStorage', e);
    }
    this.saveProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  }

  public static saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed saving profile', e);
    }
  }

  public static getQuizAttempts(): QuizAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (data) {
        const attempts = JSON.parse(data);
        if (Array.isArray(attempts) && attempts.length > 0) {
          return attempts;
        }
      }
    } catch (e) {
      console.warn('Failed reading quiz attempts', e);
    }

    // Seed default illustrative demo attempts
    this.saveQuizAttempts(SEED_ATTEMPTS);
    return SEED_ATTEMPTS;
  }

  public static saveQuizAttempts(attempts: QuizAttempt[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    } catch (e) {
      console.warn('Failed saving quiz attempts', e);
    }
  }

  public static addQuizAttempt(newAttempt: QuizAttempt): QuizAttempt[] {
    const existing = this.getQuizAttempts();
    const updated = [newAttempt, ...existing];
    this.saveQuizAttempts(updated);
    return updated;
  }

  public static getLessons(): Lesson[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
      if (data) {
        const lessons = JSON.parse(data);
        if (Array.isArray(lessons) && lessons.length > 0) {
          return lessons;
        }
      }
    } catch (e) {
      console.warn('Failed reading lessons', e);
    }
    this.saveLessons(INITIAL_LESSONS);
    return INITIAL_LESSONS;
  }

  public static saveLessons(lessons: Lesson[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    } catch (e) {
      console.warn('Failed saving lessons', e);
    }
  }

  public static toggleLessonCompletion(lessonId: string, completed: boolean): Lesson[] {
    const lessons = this.getLessons();
    const updated = lessons.map((l) =>
      l.id === lessonId
        ? {
            ...l,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          }
        : l
    );
    this.saveLessons(updated);
    return updated;
  }

  /**
   * Resets student progress to default illustrative seed data or completely clears it
   */
  public static resetToSeed(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(SEED_ATTEMPTS));
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    } catch (e) {
      console.warn('Failed resetting storage', e);
    }
  }

  public static clearAllAttempts(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
    } catch (e) {
      console.warn('Failed clearing attempts', e);
    }
  }
}
