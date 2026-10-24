import { TopicId, QuizAttempt, TopicPerformance, Recommendation, MasteryLevel } from '../types';
import { TOPICS } from '../data/topics';
import { INITIAL_LESSONS } from '../data/lessonsData';

export interface RecommendationEngineOutput {
  topicPerformances: Record<TopicId, TopicPerformance>;
  recommendations: Recommendation[];
  primaryRecommendation: Recommendation | null;
  overallAccuracy: number | null;
  totalQuizzesAttempted: number;
}

export class DeterministicRecommendationEngine {
  private static readonly TOPIC_ORDER: TopicId[] = ['data-structures', 'algorithms', 'python', 'dbms'];

  /**
   * Classify mastery level according to SDG specification
   */
  public static classifyMastery(accuracy: number | null): MasteryLevel {
    if (accuracy === null) return 'Not assessed';
    if (accuracy < 50) return 'Needs focused revision';
    if (accuracy < 75) return 'Developing';
    return 'Strong';
  }

  /**
   * Calculates topic-wise statistics from all completed quiz attempts
   */
  public static analyzePerformance(attempts: QuizAttempt[]): Record<TopicId, TopicPerformance> {
    const performances: Record<TopicId, TopicPerformance> = {
      python: this.createEmptyPerformance('python'),
      'data-structures': this.createEmptyPerformance('data-structures'),
      algorithms: this.createEmptyPerformance('algorithms'),
      dbms: this.createEmptyPerformance('dbms'),
    };

    // Aggregate attempts by topic
    for (const attempt of attempts) {
      const topicPerf = performances[attempt.topicId];
      if (!topicPerf) continue;

      topicPerf.attemptsCount += 1;
      topicPerf.totalAttempted += attempt.totalQuestions;
      topicPerf.totalCorrect += attempt.score;
      topicPerf.totalIncorrect += attempt.totalQuestions - attempt.score;
      topicPerf.latestScorePercentage = attempt.percentage;

      if (!topicPerf.lastAttemptTimestamp || new Date(attempt.timestamp) > new Date(topicPerf.lastAttemptTimestamp)) {
        topicPerf.lastAttemptTimestamp = attempt.timestamp;
      }
    }

    // Compute accuracy percentages and classifications
    for (const key of Object.keys(performances) as TopicId[]) {
      const perf = performances[key];
      if (perf.totalAttempted > 0) {
        perf.accuracy = Math.round((perf.totalCorrect / perf.totalAttempted) * 100);
        perf.classification = this.classifyMastery(perf.accuracy);
      } else {
        perf.accuracy = null;
        perf.classification = 'Not assessed';
      }
    }

    return performances;
  }

  /**
   * Generates prioritized personalized learning recommendations based on quiz accuracy
   */
  public static generateRecommendations(attempts: QuizAttempt[]): RecommendationEngineOutput {
    const performances = this.analyzePerformance(attempts);
    const perfList = Object.values(performances);

    // Rule-based deterministic sorting:
    // 1. Assessed topics come first, sorted by lowest accuracy
    // 2. If equal score, prioritize topic with MORE incorrect answers
    // 3. If still tied, use consistent static priority order (Data Structures -> Algorithms -> Python -> DBMS)
    // 4. 'Not assessed' topics follow, inviting the student to take a diagnostic
    const sorted = [...perfList].sort((a, b) => {
      // Both assessed
      if (a.accuracy !== null && b.accuracy !== null) {
        if (a.accuracy !== b.accuracy) {
          return a.accuracy - b.accuracy; // Lowest accuracy first
        }
        // Tie-breaker 1: More incorrect answers gets higher urgency
        if (a.totalIncorrect !== b.totalIncorrect) {
          return b.totalIncorrect - a.totalIncorrect;
        }
        // Tie-breaker 2: Static priority index
        return this.TOPIC_ORDER.indexOf(a.topicId) - this.TOPIC_ORDER.indexOf(b.topicId);
      }

      // One is assessed, one is not assessed
      if (a.accuracy !== null && b.accuracy === null) {
        // If a is weak (< 75%), prioritize assessed weak topic over unassessed
        if (a.accuracy < 75) return -1;
        // If a is strong (>= 75%), encourage assessing the unknown topic first
        return 1;
      }
      if (a.accuracy === null && b.accuracy !== null) {
        if (b.accuracy < 75) return 1;
        return -1;
      }

      // Both not assessed
      return this.TOPIC_ORDER.indexOf(a.topicId) - this.TOPIC_ORDER.indexOf(b.topicId);
    });

    const recommendations: Recommendation[] = sorted.map((perf, index) => {
      const topicInfo = TOPICS[perf.topicId];
      const lesson = INITIAL_LESSONS.find((l) => l.topicId === perf.topicId) || INITIAL_LESSONS[0];

      let reason = '';
      let suggestedPractice = '';

      if (perf.accuracy === null) {
        reason = `No diagnostic quiz completed yet. Take an assessment in ${topicInfo.name} to benchmark your baseline understanding.`;
        suggestedPractice = `Start with a 5-question diagnostic quiz in ${topicInfo.name}.`;
      } else if (perf.accuracy < 50) {
        reason = `Urgent Learning Priority: Demonstrated accuracy is ${perf.accuracy}% (${perf.totalCorrect}/${perf.totalAttempted} correct). Foundational knowledge gaps detected. Targeted review is recommended immediately to prevent recurring errors.`;
        suggestedPractice = `Complete the core interactive lesson on ${lesson.title}, then retake a 5-question focused quiz.`;
      } else if (perf.accuracy < 75) {
        reason = `Developing Mastery: Demonstrated accuracy is ${perf.accuracy}% (${perf.totalCorrect}/${perf.totalAttempted} correct). Core concepts are understood, but edge cases and tricky scenarios require practice to reach strong proficiency.`;
        suggestedPractice = `Review advanced nuances in ${topicInfo.name} and test yourself on medium and hard difficulty questions.`;
      } else {
        reason = `Strong Mastery: Outstanding accuracy of ${perf.accuracy}% (${perf.totalCorrect}/${perf.totalAttempted} correct). You have solid grasp of ${topicInfo.name} fundamentals.`;
        suggestedPractice = `Maintain retention with periodic spaced repetition or explore competitive challenge questions.`;
      }

      return {
        topicId: perf.topicId,
        topicName: topicInfo.name,
        accuracy: perf.accuracy,
        classification: perf.classification,
        priorityOrder: index + 1,
        reason,
        suggestedLessonId: lesson.id,
        suggestedLessonTitle: lesson.title,
        suggestedPractice,
        estimatedTime: `${lesson.estimatedMinutes} mins`,
      };
    });

    // Compute overall accuracy
    let totalAllCorrect = 0;
    let totalAllAttempted = 0;
    for (const perf of perfList) {
      totalAllCorrect += perf.totalCorrect;
      totalAllAttempted += perf.totalAttempted;
    }

    const overallAccuracy =
      totalAllAttempted > 0 ? Math.round((totalAllCorrect / totalAllAttempted) * 100) : null;

    return {
      topicPerformances: performances,
      recommendations,
      primaryRecommendation: recommendations[0] || null,
      overallAccuracy,
      totalQuizzesAttempted: attempts.length,
    };
  }

  private static createEmptyPerformance(topicId: TopicId): TopicPerformance {
    return {
      topicId,
      topicName: TOPICS[topicId].name,
      totalAttempted: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      accuracy: null,
      classification: 'Not assessed',
      attemptsCount: 0,
      latestScorePercentage: null,
    };
  }
}
