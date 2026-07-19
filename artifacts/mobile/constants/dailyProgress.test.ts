import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceDailyProgress } from './dailyProgress';

test('daily reward is earned exactly when a new completion reaches the goal', () => {
  assert.deepEqual(
    advanceDailyProgress({
      currentWords: 2,
      goal: 3,
      isNewCompletion: true,
      rewardClaimed: false,
    }),
    { words: 3, rewardEarned: true, rewardClaimed: true },
  );
});

test('daily reward cannot be earned twice', () => {
  assert.deepEqual(
    advanceDailyProgress({
      currentWords: 3,
      goal: 3,
      isNewCompletion: true,
      rewardClaimed: true,
    }),
    { words: 3, rewardEarned: false, rewardClaimed: true },
  );
});

test('replaying a completed word does not advance the daily goal', () => {
  assert.deepEqual(
    advanceDailyProgress({
      currentWords: 1,
      goal: 3,
      isNewCompletion: false,
      rewardClaimed: false,
    }),
    { words: 1, rewardEarned: false, rewardClaimed: false },
  );
});
