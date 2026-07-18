export type LearningEvent = 'correct' | 'wrong' | 'complete' | 'hint' | 'skip';

export type WordLearningRecord = {
  correct: number;
  wrong: number;
  completions: number;
  hints: number;
  skips: number;
  lastPlayedAt: number;
};

export type LearningRecords = Record<string, WordLearningRecord>;
export type MasteryLevel = 'new' | 'developing' | 'needsPractice' | 'mastered';

const EMPTY_RECORD: WordLearningRecord = {
  correct: 0,
  wrong: 0,
  completions: 0,
  hints: 0,
  skips: 0,
  lastPlayedAt: 0,
};

export function recordLearningEvent(
  records: LearningRecords,
  wordId: string,
  event: LearningEvent,
  timestamp = Date.now(),
): LearningRecords {
  const current = records[wordId] ?? EMPTY_RECORD;
  const next = { ...current, lastPlayedAt: timestamp };

  if (event === 'correct') next.correct += 1;
  if (event === 'wrong') next.wrong += 1;
  if (event === 'complete') next.completions += 1;
  if (event === 'hint') next.hints += 1;
  if (event === 'skip') next.skips += 1;

  return { ...records, [wordId]: next };
}

export function wordAccuracy(record?: WordLearningRecord): number {
  if (!record) return 0;
  const attempts = record.correct + record.wrong;
  return attempts === 0 ? 0 : Math.round((record.correct / attempts) * 100);
}

export function masteryLevel(record?: WordLearningRecord): MasteryLevel {
  if (!record) return 'new';
  const attempts = record.correct + record.wrong;
  const accuracy = wordAccuracy(record);

  if (record.completions >= 2 && attempts >= 2 && accuracy >= 80 && record.skips === 0) {
    return 'mastered';
  }
  if (
    record.skips > 0 ||
    record.hints >= 2 ||
    record.wrong >= 2 ||
    (attempts >= 3 && accuracy < 70)
  ) {
    return 'needsPractice';
  }
  return 'developing';
}

function practiceScore(record: WordLearningRecord): number {
  const ageBonus = Math.max(0, Math.min(3, (Date.now() - record.lastPlayedAt) / 86_400_000));
  return record.wrong * 3 + record.skips * 5 + record.hints * 2 - record.correct + ageBonus;
}

export function practiceWordIds(records: LearningRecords, limit = 3): string[] {
  return Object.entries(records)
    .filter(([, record]) => masteryLevel(record) === 'needsPractice')
    .sort(([, left], [, right]) => practiceScore(right) - practiceScore(left))
    .slice(0, limit)
    .map(([wordId]) => wordId);
}

export function learningSummary(records: LearningRecords) {
  const values = Object.values(records);
  const correct = values.reduce((sum, record) => sum + record.correct, 0);
  const wrong = values.reduce((sum, record) => sum + record.wrong, 0);
  const attempts = correct + wrong;

  return {
    accuracy: attempts === 0 ? 0 : Math.round((correct / attempts) * 100),
    attempts,
    practicedWords: values.length,
    masteredWords: values.filter((record) => masteryLevel(record) === 'mastered').length,
    needsPracticeWords: values.filter((record) => masteryLevel(record) === 'needsPractice').length,
  };
}
