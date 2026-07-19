import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WordRound from '@/components/WordRound';
import PictureChoiceRound from '@/components/PictureChoiceRound';
import Celebration from '@/components/Celebration';
import GameHeader from '@/components/GameHeader';
import InstructionVideoOverlay from '@/components/InstructionVideoOverlay';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';
import { playCelebrateSound } from '@/lib/sounds';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { gameTheme } from '@/constants/gameTheme';
import { learningActivityForPosition, WORDS_PER_CHAPTER } from '@/constants/curriculum';

const COINS_PER_LEVEL = 15;
const INSTRUCTION_VIDEO_KEY = 'kelime-bulmaca:instruction-video-seen:v1';

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
  } = useGameState();

  const { locale } = useI18n();
  const currentWord = words[currentLevel];
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
  const scheduledActivity = learningActivityForPosition(Math.max(0, currentCategoryIndex));
  const activity = currentWord?.pictureReady === false ? 'spell' : scheduledActivity;
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

  const handleComplete = () => advanceToNext({ celebrate: true, award: true });
  const handleSkip = () => advanceToNext({ celebrate: false, award: false });
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
      style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: bottomPad }]}
    >
      <View style={styles.backgroundShapes} pointerEvents="none">
        <View style={[styles.bubble, styles.bubbleSky]} />
        <View style={[styles.bubble, styles.bubbleSun]} />
        <View style={[styles.bubble, styles.bubbleMint]} />
      </View>
      <GameHeader onBack={() => router.navigate('/category')} />

      <View style={styles.levelRow}>
        <View style={[styles.progressTrack, { backgroundColor: '#FFFFFFB8' }]}>
          <Animated.View
            style={[styles.progressFill, { backgroundColor: gameTheme.colors.coral }, progressStyle]}
          />
          <Text style={[styles.progressLabel, { color: colors.foreground }]}>
            {hasCategoryWords
              ? t('level', { current: currentChapterIndex + 1, total: chapterWords.length })
              : t('level', { current: currentLevel + 1, total: totalLevels })}
          </Text>
        </View>
        <View style={styles.activityPill}>
          <Feather
            name={activity === 'spell' ? 'edit-3' : activity === 'listen' ? 'headphones' : 'image'}
            size={15}
            color={gameTheme.colors.ink}
          />
          <Text style={styles.activityText}>
            {t(
              activity === 'spell'
                ? 'activitySpell'
                : activity === 'listen'
                  ? 'activityListen'
                  : 'activityPicture',
            )}
          </Text>
        </View>
      </View>

      {!instructionChecked || showInstructionVideo ? (
        <View style={styles.tutorialPlaceholder} />
      ) : chapterComplete ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="star" size={58} color={gameTheme.colors.sunshine} />
          <Text style={[styles.emptyTitle, { color: colors.foreground, textAlign: 'center', fontSize: 22 }]}>
            {t('chapterCompleteTitle')}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground, marginTop: 4, marginBottom: 20 }]}>
            {t('chapterCompleteBody')}
          </Text>
          <Pressable
            style={[styles.hintButton, { backgroundColor: gameTheme.colors.sky, width: '100%', paddingVertical: 16 }]}
            onPress={() => router.navigate('/category')}
          >
            <Feather name="map" size={22} color="#FFFFFF" />
            <Text style={[styles.hintText, { color: '#FFFFFF', fontSize: 17 }]}>{t('backToChapters')}</Text>
          </Pressable>
        </View>
      ) : categoryComplete ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="award" size={56} color="#FFC93C" />
          <Text style={[styles.emptyTitle, { color: colors.foreground, textAlign: 'center', fontSize: 22 }]}>
            {t('congrats')}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground, marginTop: 4, marginBottom: 20 }]}>
            {t('categoryCompleteBody')}
          </Text>
          <View style={{ flexDirection: 'column', gap: 12, width: '100%', paddingHorizontal: 16 }}>
            <Pressable
              style={[styles.hintButton, { backgroundColor: colors.primary, width: '100%', paddingVertical: 16 }]}
              onPress={() => {
                const first = words.findIndex((w) => w.category === selectedCategory);
                if (first >= 0) setCurrentLevel(first);
                setCategoryComplete(false);
              }}
            >
              <Feather name="rotate-ccw" size={24} color="#FFFFFF" />
              <Text style={[styles.hintText, { color: '#FFFFFF', fontSize: 18 }]}>{t('playAgain')}</Text>
            </Pressable>

            <Pressable
              style={[styles.hintButton, { backgroundColor: '#56A8DF', width: '100%', paddingVertical: 16 }]}
              onPress={() => {
                router.navigate('/category');
              }}
            >
              <Feather name="book-open" size={24} color="#FFFFFF" />
              <Text style={[styles.hintText, { color: '#FFFFFF', fontSize: 18 }]}>{t('backToChapters')}</Text>
            </Pressable>
          </View>
        </View>
      ) : hasCategoryWords && currentWord?.category === selectedCategory ? (
        activity === 'spell' ? (
          <WordRound key={roundKey} word={currentWord} onComplete={handleComplete} onSkip={handleSkip} />
        ) : (
          <PictureChoiceRound
            key={roundKey}
            word={currentWord}
            mode={activity}
            onComplete={handleComplete}
          />
        )
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
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  progressTrack: {
    flex: 1,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F2DBC0',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 13,
  },
  progressLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '900',
  },
  activityPill: {
    minHeight: 38,
    maxWidth: 142,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 19,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 2,
    borderColor: '#F2DBC0',
    paddingHorizontal: 12,
  },
  activityText: {
    color: gameTheme.colors.ink,
    fontSize: 11,
    fontWeight: '900',
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
