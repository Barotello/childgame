import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { type CategoryId } from '@/constants/library';
import {
  recordLearningEvent,
  type LearningRecords,
} from '@/constants/learning';
import words from '@/constants/words';
import { firstAvailableLevel, isWordUnlocked } from '@/constants/progression';
import { advanceDailyProgress } from '@/constants/dailyProgress';
import { setSoundsMuted } from '@/lib/sounds';
import { setSpeechMuted } from '@/lib/speech';

const STORAGE_KEY = 'kelime-bulmaca:game-state:v1';
const HINT_COST = 20;
const HINT_PACK_COST = 80;
const HINT_PACK_SIZE = 5;
const LEVEL_REWARD_COINS = 15;
const DAILY_GOAL_REWARD_COINS = 30;
const DEFAULT_DAILY_GOAL = 3;

function localDayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export type ChildProfile = {
  name: string;
  avatarId: string;
  avatarEmoji: string;
  avatarLabel: string;
  symbolId: string;
  symbolEmoji: string;
  symbolLabel: string;
  themeColor: string;
  isCreated: boolean;
};

export const DEFAULT_CHILD_PROFILE: ChildProfile = {
  name: 'Hero',
  avatarId: 'lion',
  avatarEmoji: '🦁',
  avatarLabel: 'Leo Lion',
  symbolId: 'star',
  symbolEmoji: '⭐',
  symbolLabel: 'Star',
  themeColor: '#FF9F1C',
  isCreated: false,
};

type PersistedState = {
  coins: number;
  highestUnlocked: number;
  completedLevels: number[];
  hintTokens: number;
  skipTokens: number;
  wordsProgress: number;
  muted: boolean;
  currentLevel: number;
  selectedCategory: CategoryId;
  dailyDate: string;
  dailyWords: number;
  dailyGoal: number;
  dailyRewardClaimed: boolean;
  screenTimeMinutes: number;
  learningRecords: LearningRecords;
  profile: ChildProfile;
};

const FIRST_ANIMAL_INDEX = Math.max(
  0,
  words.findIndex((w) => w.category === 'animals'),
);

const DEFAULT_STATE: PersistedState = {
  coins: 0,
  highestUnlocked: 0,
  completedLevels: [],
  hintTokens: 1,
  skipTokens: 3,
  wordsProgress: 0,
  muted: false,
  currentLevel: FIRST_ANIMAL_INDEX,
  selectedCategory: 'animals',
  dailyDate: localDayKey(),
  dailyWords: 0,
  dailyGoal: DEFAULT_DAILY_GOAL,
  dailyRewardClaimed: false,
  screenTimeMinutes: 20,
  learningRecords: {},
  profile: DEFAULT_CHILD_PROFILE,
};

type GameStateContextValue = PersistedState & {
  loaded: boolean;
  totalLevels: number;
  hintCost: number;
  hintPackCost: number;
  hintPackSize: number;
  setCurrentLevel: (index: number) => void;
  setSelectedCategory: (category: CategoryId) => void;
  /** Select category and jump to a specific word index in one state update. */
  playWordAt: (index: number, category: CategoryId) => boolean;
  isLevelUnlocked: (index: number) => boolean;
  completeLevel: (index: number) => void;
  buyHint: () => boolean;
  buyHintPack: () => boolean;
  consumeHintToken: () => boolean;
  consumeSkipToken: () => boolean;
  recordWordAttempt: (wordId: string, correct: boolean) => void;
  recordHintUse: (wordId: string) => void;
  recordSkipUse: (wordId: string) => void;
  toggleMute: () => void;
  setDailyGoal: (goal: number) => void;
  setScreenTimeMinutes: (minutes: number) => void;
  setChildProfile: (profile: Partial<ChildProfile>) => void;
  resetChildProfile: () => void;
};

const GameStateContext = createContext<GameStateContextValue | null>(null);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          const merged = { ...DEFAULT_STATE, ...parsed };
          merged.learningRecords = parsed.learningRecords ?? {};
          merged.profile = { ...DEFAULT_CHILD_PROFILE, ...(parsed.profile ?? {}) };

          // If the player has not completed any levels and has legacy default coins (20), reset to 0
          if (merged.completedLevels.length === 0 && (parsed.coins === 20 || parsed.coins === undefined)) {
            merged.coins = 0;
          }

          if (merged.dailyDate !== localDayKey()) {
            merged.dailyDate = localDayKey();
            merged.dailyWords = 0;
            merged.dailyRewardClaimed = false;
          }
          // Guard against stale saves where the persisted level and category
          // don't correspond to the same word (e.g. saves from before
          // categories existed) — snap to the first word of the category.
          const currentWord = words[merged.currentLevel];
          if (!currentWord || currentWord.category !== merged.selectedCategory) {
            const fallback = words.findIndex((w) => w.category === merged.selectedCategory);
            merged.currentLevel = fallback >= 0 ? fallback : FIRST_ANIMAL_INDEX;
          }
          setState(merged);
          setSoundsMuted(merged.muted);
          setSpeechMuted(merged.muted);
        }
      } catch {
        // Corrupt or unavailable storage: fall back to defaults silently.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Non-fatal: progress simply won't persist this session.
    });
  }, [state, loaded]);

  useEffect(() => {
    const refreshDay = () => {
      const today = localDayKey();
      setState((previous) =>
        previous.dailyDate === today
          ? previous
          : {
              ...previous,
              dailyDate: today,
              dailyWords: 0,
              dailyRewardClaimed: false,
            },
      );
    };
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') refreshDay();
    });
    const timer = setInterval(refreshDay, 60_000);
    return () => {
      subscription.remove();
      clearInterval(timer);
    };
  }, []);

  const value = useMemo<GameStateContextValue>(() => {
    const totalLevels = words.length;

    return {
      ...state,
      loaded,
      totalLevels,
      hintCost: HINT_COST,
      hintPackCost: HINT_PACK_COST,
      hintPackSize: HINT_PACK_SIZE,
      setCurrentLevel: (index: number) => {
        setState((prev) => ({ ...prev, currentLevel: Math.max(0, Math.min(index, totalLevels - 1)) }));
      },
      setSelectedCategory: (category: CategoryId) => {
        setState((prev) => {
          const firstAvailable = firstAvailableLevel(words, prev.completedLevels, category);
          if (firstAvailable === undefined) {
            return { ...prev, selectedCategory: category };
          }

          return {
            ...prev,
            selectedCategory: category,
            currentLevel: firstAvailable,
          };
        });
      },
      playWordAt: (index: number, category: CategoryId) => {
        const canOpen =
          words[index]?.category === category &&
          isWordUnlocked(words, state.completedLevels, index);
        if (!canOpen) return false;

        setState((prev) => ({ ...prev, selectedCategory: category, currentLevel: index }));
        return true;
      },
      isLevelUnlocked: (index: number) => isWordUnlocked(words, state.completedLevels, index),
      completeLevel: (index: number) => {
        setState((prev) => {
          const isNew = !prev.completedLevels.includes(index);
          let newSkipTokens = prev.skipTokens;
          let newWordsProgress = prev.wordsProgress;
          const isToday = prev.dailyDate === localDayKey();
          const currentDailyWords = isToday ? prev.dailyWords : 0;
          const rewardAlreadyClaimed = isToday ? prev.dailyRewardClaimed : false;
          const dailyProgress = advanceDailyProgress({
            currentWords: currentDailyWords,
            goal: prev.dailyGoal,
            isNewCompletion: isNew,
            rewardClaimed: rewardAlreadyClaimed,
          });
          
          if (isNew) {
            newWordsProgress += 1;
            if (newWordsProgress >= 15) {
              newSkipTokens += 3;
              newWordsProgress = 0;
            }
          }

          return {
            ...prev,
            coins:
              prev.coins +
              (isNew ? LEVEL_REWARD_COINS : 0) +
              (dailyProgress.rewardEarned ? DAILY_GOAL_REWARD_COINS : 0),
            completedLevels: isNew ? [...prev.completedLevels, index] : prev.completedLevels,
            highestUnlocked: Math.max(prev.highestUnlocked, index + 1),
            skipTokens: newSkipTokens,
            wordsProgress: newWordsProgress,
            dailyDate: localDayKey(),
            dailyWords: dailyProgress.words,
            dailyRewardClaimed: dailyProgress.rewardClaimed,
            learningRecords: words[index]
              ? recordLearningEvent(prev.learningRecords, words[index].id, 'complete')
              : prev.learningRecords,
          };
        });
      },
      buyHint: () => {
        let success = false;
        setState((prev) => {
          if (prev.coins < HINT_COST) return prev;
          success = true;
          return { ...prev, coins: prev.coins - HINT_COST, hintTokens: prev.hintTokens + 1 };
        });
        return success;
      },
      buyHintPack: () => {
        let success = false;
        setState((prev) => {
          if (prev.coins < HINT_PACK_COST) return prev;
          success = true;
          return { ...prev, coins: prev.coins - HINT_PACK_COST, hintTokens: prev.hintTokens + HINT_PACK_SIZE };
        });
        return success;
      },
      consumeHintToken: () => {
        let consumed = false;
        setState((prev) => {
          if (prev.hintTokens > 0) {
            consumed = true;
            return { ...prev, hintTokens: prev.hintTokens - 1 };
          }
          return prev;
        });
        return consumed;
      },
      consumeSkipToken: () => {
        let consumed = false;
        setState((prev) => {
          if (prev.skipTokens > 0) {
            consumed = true;
            return { ...prev, skipTokens: prev.skipTokens - 1 };
          }
          return prev;
        });
        return consumed;
      },
      recordWordAttempt: (wordId: string, correct: boolean) => {
        setState((prev) => ({
          ...prev,
          learningRecords: recordLearningEvent(
            prev.learningRecords,
            wordId,
            correct ? 'correct' : 'wrong',
          ),
        }));
      },
      recordHintUse: (wordId: string) => {
        setState((prev) => ({
          ...prev,
          learningRecords: recordLearningEvent(prev.learningRecords, wordId, 'hint'),
        }));
      },
      recordSkipUse: (wordId: string) => {
        setState((prev) => ({
          ...prev,
          learningRecords: recordLearningEvent(prev.learningRecords, wordId, 'skip'),
        }));
      },
      toggleMute: () => {
        setState((prev) => {
          const nextMuted = !prev.muted;
          setSoundsMuted(nextMuted);
          setSpeechMuted(nextMuted);
          return { ...prev, muted: nextMuted };
        });
      },
      setDailyGoal: (goal: number) => {
        setState((prev) => ({ ...prev, dailyGoal: Math.max(1, Math.min(5, goal)) }));
      },
      setScreenTimeMinutes: (minutes: number) => {
        const allowed = [15, 20, 30, 45];
        setState((prev) => ({
          ...prev,
          screenTimeMinutes: allowed.includes(minutes) ? minutes : 20,
        }));
      },
      setChildProfile: (profileUpdate: Partial<ChildProfile>) => {
        setState((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            ...profileUpdate,
            isCreated: true,
          },
        }));
      },
      resetChildProfile: () => {
        setState((prev) => ({
          ...prev,
          profile: DEFAULT_CHILD_PROFILE,
        }));
      },
    };
  }, [state, loaded]);

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return ctx;
}
