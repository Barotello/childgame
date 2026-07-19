export type DailyProgressInput = {
  currentWords: number;
  goal: number;
  isNewCompletion: boolean;
  rewardClaimed: boolean;
};

export function advanceDailyProgress({
  currentWords,
  goal,
  isNewCompletion,
  rewardClaimed,
}: DailyProgressInput) {
  const words = isNewCompletion
    ? Math.min(goal, currentWords + 1)
    : currentWords;
  const rewardEarned = isNewCompletion && words >= goal && !rewardClaimed;

  return {
    words,
    rewardEarned,
    rewardClaimed: rewardClaimed || rewardEarned,
  };
}
