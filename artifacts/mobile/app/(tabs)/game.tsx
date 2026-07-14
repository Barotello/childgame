import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WordRound from '@/components/WordRound';
import Celebration from '@/components/Celebration';
import GameHeader from '@/components/GameHeader';
import TutorialOverlay from '@/components/TutorialOverlay';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';
import { playCelebrateSound } from '@/lib/sounds';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

const COINS_PER_LEVEL = 15;
const TUTORIAL_KEY = 'kelime-bulmaca:tutorial-seen:v1';

export default function PlayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const {
    currentLevel,
    totalLevels,
    selectedCategory,
    completeLevel,
    setCurrentLevel,
  } = useGameState();

  const { locale } = useI18n();
  const [celebrating, setCelebrating] = useState(false);
  const [categoryComplete, setCategoryComplete] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    setCategoryComplete(false);
  }, [selectedCategory]);

  useEffect(() => {
    // Show tutorial every time the play screen is mounted
    setShowTutorial(true);
  }, []);

  const dismissTutorial = () => {
    setShowTutorial(false);
  };

  const currentWord = words[currentLevel];

  const categoryWords = words.filter((w) => w.category === selectedCategory);
  const currentCategoryIndex = categoryWords.findIndex((w) => w.id === currentWord?.id);
  const hasCategoryWords = categoryWords.length > 0;

  const progressValue = useSharedValue(0);

  useEffect(() => {
    const target = hasCategoryWords
      ? (currentCategoryIndex + 1) / categoryWords.length
      : (currentLevel + 1) / totalLevels;
    progressValue.value = withSpring(target, { damping: 14, stiffness: 90 });
  }, [currentCategoryIndex, currentLevel, hasCategoryWords, categoryWords.length, totalLevels]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const latestRef = useRef({ currentLevel, selectedCategory });
  latestRef.current = { currentLevel, selectedCategory };
  const completingRef = useRef(false);

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
      if (nextInCategory) {
        const nextIndex = words.findIndex((w) => w.id === nextInCategory.id);
        setCurrentLevel(nextIndex);
      } else {
        setCategoryComplete(true);
      }
      completingRef.current = false;
    };

    if (opts?.celebrate !== false) {
      setCelebrating(true);
      playCelebrateSound();
      setTimeout(goNext, 1100);
    } else {
      goNext();
    }
  };

  const handleComplete = () => advanceToNext({ celebrate: true, award: true });
  const handleSkip = () => advanceToNext({ celebrate: false, award: false });

  const roundKey =
    hasCategoryWords && currentWord?.category === selectedCategory
      ? `${currentWord.id}-${currentLevel}-${locale}`
      : 'empty';

  // Bottom padding to clear the tab bar (88 height + 16 gap)
  const bottomPad = Math.max(insets.bottom, 12) + 104;

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: bottomPad }]}
    >
      <GameHeader onBack={() => router.navigate('/library')} />

      <View style={styles.levelRow}>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <Animated.View
            style={[styles.progressFill, { backgroundColor: colors.primary }, progressStyle]}
          />
          <Text style={[styles.progressLabel, { color: colors.foreground }]}>
            {hasCategoryWords
              ? t('level', { current: currentCategoryIndex + 1, total: categoryWords.length })
              : t('level', { current: currentLevel + 1, total: totalLevels })}
          </Text>
        </View>
      </View>

      {categoryComplete ? (
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
                router.navigate('/library');
              }}
            >
              <Feather name="book-open" size={24} color="#FFFFFF" />
              <Text style={[styles.hintText, { color: '#FFFFFF', fontSize: 18 }]}>{t('library')}</Text>
            </Pressable>
          </View>
        </View>
      ) : hasCategoryWords && currentWord?.category === selectedCategory ? (
        <WordRound key={roundKey} word={currentWord} onComplete={handleComplete} onSkip={handleSkip} />
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
                | 'categoryFlags',
            )}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>{t('emptyCategoryBody')}</Text>
        </View>
      )}

      {celebrating && currentWord ? (
        <Celebration word={currentWord} coinsEarned={COINS_PER_LEVEL} />
      ) : null}

      <TutorialOverlay visible={showTutorial} onDismiss={dismissTutorial} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'visible',
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
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    justifyContent: 'center',
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
    fontWeight: '700',
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
