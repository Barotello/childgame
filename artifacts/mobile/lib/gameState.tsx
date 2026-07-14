import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type CategoryId } from '@/constants/library';
import words from '@/constants/words';
import { setSoundsMuted } from '@/lib/sounds';

const STORAGE_KEY = 'kelime-bulmaca:game-state:v1';
const HINT_COST = 20;
const HINT_PACK_COST = 80;
const HINT_PACK_SIZE = 5;
const LEVEL_REWARD_COINS = 15;

type PersistedState = {
  coins: number;
  highestUnlocked: number;
  completedLevels: number[];
  hintTokens: number;
  muted: boolean;
  currentLevel: number;
  selectedCategory: CategoryId;
};

const DEFAULT_STATE: PersistedState = {
  coins: 20,
  highestUnlocked: 0,
  completedLevels: [],
  hintTokens: 1,
  muted: false,
  currentLevel: 0,
  selectedCategory: 'animals',
};

type GameStateContextValue = PersistedState & {
  loaded: boolean;
  totalLevels: number;
  hintCost: number;
  hintPackCost: number;
  hintPackSize: number;
  setCurrentLevel: (index: number) => void;
  setSelectedCategory: (category: CategoryId) => void;
  completeLevel: (index: number) => void;
  buyHint: () => boolean;
  buyHintPack: () => boolean;
  consumeHintToken: () => boolean;
  toggleMute: () => void;
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
          setState(merged);
          setSoundsMuted(merged.muted);
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
          const firstInCategory = words.findIndex((w) => w.category === category);
          return {
            ...prev,
            selectedCategory: category,
            currentLevel: firstInCategory >= 0 ? firstInCategory : prev.currentLevel,
          };
        });
      },
      completeLevel: (index: number) => {
        setState((prev) => {
          if (prev.completedLevels.includes(index)) return prev;
          return {
            ...prev,
            coins: prev.coins + LEVEL_REWARD_COINS,
            completedLevels: [...prev.completedLevels, index],
            highestUnlocked: Math.min(Math.max(prev.highestUnlocked, index + 1), totalLevels - 1),
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
        let success = false;
        setState((prev) => {
          if (prev.hintTokens <= 0) return prev;
          success = true;
          return { ...prev, hintTokens: prev.hintTokens - 1 };
        });
        return success;
      },
      toggleMute: () => {
        setState((prev) => {
          const nextMuted = !prev.muted;
          setSoundsMuted(nextMuted);
          return { ...prev, muted: nextMuted };
        });
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
