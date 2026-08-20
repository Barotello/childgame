import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PictureChoiceRound from '@/components/PictureChoiceRound';
import Celebration from '@/components/Celebration';
import GameHeader from '@/components/GameHeader';
import InstructionVideoOverlay from '@/components/InstructionVideoOverlay';
import ChapterCompletionCard from '@/components/ChapterCompletionCard';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';
import { playCelebrateSound } from '@/lib/sounds';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { gameTheme } from '@/constants/gameTheme';
import { learningActivityForPosition, WORDS_PER_CHAPTER } from '@/constants/curriculum';

const COINS_PER_LEVEL = 15;
const INSTRUCTION_VIDEO_KEY = 'kelime-bulmaca:instruction-video-seen:v1';

const CATEGORY_STEP_ICONS: Record<string, { upcoming: string; current: string; completed: string }> = {
  animals: { completed: '⭐', current: '🌟', upcoming: '🐾' },
  fruits: { completed: '⭐', current: '🌟', upcoming: '🌱' },
  numbers: { completed: '⭐', current: '🌟', upcoming: '🎲' },
  colors: { completed: '⭐', current: '🌟', upcoming: '🎨' },
  flags: { completed: '⭐', current: '🌟', upcoming: '🚩' },
  body: { completed: '⭐', current: '🌟', upcoming: '❤️' },
};

export default function PlayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const {
    currentLevel,
    totalLevels,
    selectedCategory,
    completedLevels,
    completeLevel,
    setCurrentLevel,
    coins,
  } = useGameState();

  const { locale } = useI18n();
  const currentWord = words[currentLevel];
  const activeCategory = selectedCategory || currentWord?.category || 'animals';
  const stepIcons = CATEGORY_STEP_ICONS[activeCategory] || CATEGORY_STEP_ICONS.animals;
  const [celebrating, setCelebrating] = useState(false);
  const [categoryComplete, setCategoryComplete] = useState(false);
  const [chapterComplete, setChapterComplete] = useState(false);
  const [instructionChecked, setInstructionChecked] = useState(false);
  const [showInstructionVideo, setShowInstructionVideo] = useState(false);

  useEffect(() => {
    setCategoryComplete(false);
    setChapterComplete(false);
  }, [selectedCategory]);

  useEffect(() => {
    AsyncStorage.getItem(INSTRUCTION_VIDEO_KEY)
      .then((seen) => setShowInstructionVideo(!seen))
      .catch(() => setShowInstructionVideo(true))
      .finally(() => setInstructionChecked(true));
  }, []);

  const categoryWords = words.filter((w) => w.category === selectedCategory);
  const currentCategoryIndex = categoryWords.findIndex((w) => w.id === currentWord?.id);
  const hasCategoryWords = categoryWords.length > 0;
  const activity = learningActivityForPosition(Math.max(0, currentCategoryIndex));
  const chapterStart = Math.floor(Math.max(0, currentCategoryIndex) / WORDS_PER_CHAPTER) * WORDS_PER_CHAPTER;
  const chapterWords = categoryWords.slice(chapterStart, chapterStart + WORDS_PER_CHAPTER);
  const currentChapterIndex = Math.max(0, currentCategoryIndex - chapterStart);

  const progressValue = useSharedValue(0);

  useEffect(() => {
    const target = hasCategoryWords
      ? (currentChapterIndex + 1) / chapterWords.length
      : (currentLevel + 1) / totalLevels;
    progressValue.value = withSpring(target, { damping: 14, stiffness: 90 });
  }, [currentChapterIndex, currentLevel, hasCategoryWords, chapterWords.length, totalLevels]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const latestRef = useRef({ currentLevel, selectedCategory });
  latestRef.current = { currentLevel, selectedCategory };
  const completingRef = useRef(false);
  const pendingAdvanceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    completingRef.current = false;
  }, [currentWord?.id, selectedCategory]);

  const handleNextChapter = () => {
    const { currentLevel: level, selectedCategory: category } = latestRef.current;
    const wordsInCategory = words.filter((w) => w.category === category);
    const indexInCategory = wordsInCategory.findIndex((w) => w.id === words[level]?.id);
    const nextInCategory = indexInCategory >= 0 ? wordsInCategory[indexInCategory + 1] : undefined;
    if (nextInCategory) {
      const nextIndex = words.findIndex((w) => w.id === nextInCategory.id);
      setCurrentLevel(nextIndex);
      setChapterComplete(false);
    } else {
      router.navigate('/category');
    }
  };

  const advanceToNext = (opts?: { celebrate?: boolean; award?: boolean }) => {
    if (completingRef.current) return;
    completingRef.current = true;

    if (opts?.award !== false) {
      completeLevel(latestRef.current.currentLevel);
    }

    const goNext = () => {
      setCelebrating(false);
      const { currentLevel: level, selectedCategory: category } = latestRef.current;
      const wordsInCategory = words.filter((w) => w.category === category);
      const indexInCategory = wordsInCategory.findIndex((w) => w.id === words[level]?.id);
      const nextInCategory = indexInCategory >= 0 ? wordsInCategory[indexInCategory + 1] : undefined;
      const reachesChapterBoundary =
        Boolean(nextInCategory) && (indexInCategory + 1) % WORDS_PER_CHAPTER === 0;

      if (reachesChapterBoundary) {
        const chapterEntries = wordsInCategory.slice(
          Math.floor(indexInCategory / WORDS_PER_CHAPTER) * WORDS_PER_CHAPTER,
          Math.floor(indexInCategory / WORDS_PER_CHAPTER) * WORDS_PER_CHAPTER + WORDS_PER_CHAPTER,
        );
        const chapterFinished = chapterEntries.every((word) => {
          const globalIndex = words.findIndex((candidate) => candidate.id === word.id);
          return completedLevels.includes(globalIndex) || (opts?.award !== false && globalIndex === level);
        });
        if (chapterFinished) setChapterComplete(true);
        else router.navigate('/category');
      } else if (nextInCategory) {
        const nextIndex = words.findIndex((w) => w.id === nextInCategory.id);
        setCurrentLevel(nextIndex);
      } else {
        const categoryFinished = wordsInCategory.every((word) => {
          const globalIndex = words.findIndex((candidate) => candidate.id === word.id);
          return completedLevels.includes(globalIndex) || (opts?.award !== false && globalIndex === level);
        });
        if (categoryFinished) setCategoryComplete(true);
        else router.navigate('/category');
      }
      completingRef.current = false;
    };

    if (opts?.celebrate !== false) {
      setCelebrating(true);
      playCelebrateSound();
      pendingAdvanceRef.current = goNext;
    } else {
      goNext();
    }
  };

  const handleComplete = () => advanceToNext({ celebrate: false, award: true });
  const handleCelebrationComplete = () => {
    const advance = pendingAdvanceRef.current;
    pendingAdvanceRef.current = null;
    advance?.();
  };

  const roundKey =
    hasCategoryWords && currentWord?.category === selectedCategory
      ? `${currentWord.id}-${currentLevel}-${locale}-${activity}`
      : 'empty';

  const bottomPad = Math.max(insets.bottom, 12) + 16;
  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF1DB', gameTheme.colors.peach]}
      style={[styles.root, { paddingTop: insets.top + 22, paddingBottom: bottomPad }]}
    >
      <View style={styles.backgroundShapes} pointerEvents="none">
        <View style={[styles.bubble, styles.bubbleSky]} />
        <View style={[styles.bubble, styles.bubbleSun]} />
        <View style={[styles.bubble, styles.bubbleMint]} />
      </View>
      {/* Unified Child-Friendly Header Bar */}
      <View style={styles.gameTopBar}>
        {/* Left: Back Button */}
        <Pressable
          onPress={() => router.navigate('/category')}
          style={styles.backBtn}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('backToChapters')}
        >
          <Feather name="arrow-left" size={24} color={gameTheme.colors.ink} />
        </Pressable>

        {/* Center: Large Glowing 5-Star Step Progression */}
        <View style={styles.starsCenterRow}>
          {Array.from({ length: chapterWords.length || 5 }).map((_, stepIdx) => {
            const isCompleted = stepIdx < currentChapterIndex;
            const isCurrent = stepIdx === currentChapterIndex;
            return (
              <View
                key={stepIdx}
                style={[
                  styles.stepBadge,
                  isCompleted && styles.stepCompleted,
                  isCurrent && styles.stepCurrent,
                ]}
              >
                <Text style={[styles.stepEmoji, isCurrent && styles.stepEmojiCurrent]}>
                  {isCompleted ? stepIcons.completed : isCurrent ? stepIcons.current : stepIcons.upcoming}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Right: Shiny Coin Counter */}
        <View style={styles.coinBadge}>
          <Text style={styles.coinStar}>⭐</Text>
          <Text style={styles.coinText}>{coins}</Text>
        </View>
      </View>

      {!instructionChecked || showInstructionVideo ? (
        <View style={styles.tutorialPlaceholder} />
      ) : chapterComplete ? (
        <ChapterCompletionCard
          words={chapterWords}
          onNextChapter={handleNextChapter}
          onBackToChapters={() => router.navigate('/category')}
        />
      ) : categoryComplete ? (
        <ChapterCompletionCard
          words={categoryWords}
          isCategoryComplete
          onReplay={() => {
            const first = words.findIndex((w) => w.category === selectedCategory);
            if (first >= 0) setCurrentLevel(first);
            setCategoryComplete(false);
          }}
          onBackToChapters={() => router.navigate('/category')}
        />
      ) : hasCategoryWords && currentWord?.category === selectedCategory ? (
        <PictureChoiceRound
          key={roundKey}
          word={currentWord}
          mode={activity}
          onComplete={handleComplete}
        />
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="book-open" size={40} color={colors.secondary} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            {t(
              `category${selectedCategory.charAt(0).toUpperCase()}${selectedCategory.slice(1)}` as
                | 'categoryAnimals'
                | 'categoryFruits'
                | 'categoryNumbers'
                | 'categoryColors'
                | 'categoryFlags'
                | 'categoryBody',
            )}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>{t('emptyCategoryBody')}</Text>
        </View>
      )}

      {celebrating && currentWord ? (
        <Celebration
          word={currentWord}
          coinsEarned={COINS_PER_LEVEL}
          onNarrationComplete={handleCelebrationComplete}
        />
      ) : null}

      {instructionChecked && showInstructionVideo ? (
        <InstructionVideoOverlay
          visible
          source={require('../../assets/videos/chapter-1.mp4')}
          onComplete={() => {
            AsyncStorage.setItem(INSTRUCTION_VIDEO_KEY, '1').catch(() => {});
            setShowInstructionVideo(false);
          }}
        />
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'visible',
  },
  tutorialPlaceholder: { flex: 1 },
  backgroundShapes: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.22,
  },
  bubbleSky: {
    width: 180,
    height: 180,
    backgroundColor: gameTheme.colors.sky,
    top: 80,
    right: -105,
  },
  bubbleSun: {
    width: 130,
    height: 130,
    backgroundColor: gameTheme.colors.sunshine,
    bottom: 180,
    left: -82,
  },
  bubbleMint: {
    width: 90,
    height: 90,
    backgroundColor: gameTheme.colors.mint,
    bottom: 60,
    right: -55,
  },
  gameTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EFE3D3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  starsCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stepBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFFCC',
    borderWidth: 1.5,
    borderColor: '#EFE5D8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  stepCompleted: {
    backgroundColor: '#FFEFA7',
    borderColor: '#F4C824',
    borderWidth: 2,
  },
  stepCurrent: {
    backgroundColor: '#FFF7E6',
    borderColor: '#FF9D55',
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  stepEmoji: {
    fontSize: 16,
  },
  stepEmojiCurrent: {
    fontSize: 20,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#FFD166',
    borderWidth: 1.5,
    borderColor: '#EAA812',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  coinStar: {
    fontSize: 14,
  },
  coinText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8C5300',
  },
  emptyCard: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  hintButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hintText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
