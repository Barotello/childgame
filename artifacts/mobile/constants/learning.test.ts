import assert from 'node:assert/strict';
import test from 'node:test';
import {
  learningSummary,
  masteryLevel,
  practiceWordIds,
  recordLearningEvent,
  wordAccuracy,
  type LearningRecords,
} from './learning';

test('learning events update only the selected word', () => {
  let records: LearningRecords = {};
  records = recordLearningEvent(records, 'cat', 'correct', 10);
  records = recordLearningEvent(records, 'cat', 'wrong', 20);

  assert.deepEqual(records.cat, {
    correct: 1,
    wrong: 1,
    completions: 0,
    hints: 0,
    skips: 0,
    lastPlayedAt: 20,
  });
  assert.equal(wordAccuracy(records.cat), 50);
});

test('mastery distinguishes practice needs from mastered words', () => {
  assert.equal(masteryLevel(), 'new');
  assert.equal(masteryLevel({ correct: 1, wrong: 0, completions: 1, hints: 0, skips: 0, lastPlayedAt: 1 }), 'developing');
  assert.equal(masteryLevel({ correct: 2, wrong: 2, completions: 1, hints: 0, skips: 0, lastPlayedAt: 1 }), 'needsPractice');
  assert.equal(masteryLevel({ correct: 5, wrong: 0, completions: 2, hints: 0, skips: 0, lastPlayedAt: 1 }), 'mastered');
});

test('practice list prioritizes words with more support needs', () => {
  const records: LearningRecords = {
    cat: { correct: 2, wrong: 2, completions: 1, hints: 0, skips: 0, lastPlayedAt: Date.now() },
    dog: { correct: 1, wrong: 2, completions: 0, hints: 0, skips: 1, lastPlayedAt: Date.now() },
    bee: { correct: 5, wrong: 0, completions: 2, hints: 0, skips: 0, lastPlayedAt: Date.now() },
  };

  assert.deepEqual(practiceWordIds(records), ['dog', 'cat']);
  assert.deepEqual(learningSummary(records), {
    accuracy: 67,
    attempts: 12,
    practicedWords: 3,
    masteredWords: 1,
    needsPracticeWords: 2,
  });
});
