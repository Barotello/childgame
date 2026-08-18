import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { LearningActivity } from '@/constants/curriculum';
import { buildPictureChoices } from '@/constants/curriculum';
import { gameTheme } from '@/constants/gameTheme';
import type { WordItem } from '@/constants/words';
import words from '@/constants/words';
import { useGameState } from '@/lib/gameState';
import type { Locale } from '@/constants/translations';
import { useI18n } from '@/lib/i18n';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { speakWord, speakWordAndWait } from '@/lib/speech';
import WordVisual from './WordVisual';

type PictureChoiceRoundProps = {
  word: WordItem;
  mode: Extract<LearningActivity, 'picture' | 'listen'>;
  onComplete: () => void;
};

function ChoiceCard({
  choice,
  isWrong,
  locked,
  onPress,
  locale,
}: {
  choice: WordItem;
  isWrong: boolean;
  locked: boolean;
  onPress: () => void;
  locale: Locale;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isWrong) {
      scale.value = withSequence(
        withTiming(1.04, { duration: 60 }),
        withSpring(0.82, { damping: 12, stiffness: 120 })
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [isWrong]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.choiceWrap, animatedCardStyle]}>
      <Pressable
        onPress={onPress}
        disabled={locked || isWrong}
        accessibilityRole="button"
        accessibilityLabel={choice.spellings[locale]}
        style={({ pressed }) => [
          styles.choice,
          isWrong && styles.choiceWrong,
          pressed && !locked && !isWrong && styles.choicePressed,
        ]}
      >
        <WordVisual
          word={choice}
          style={styles.visual}
          emojiSize={choice.category === 'flags' ? 98 : 82}
        />
        {isWrong ? (
          <View style={styles.statusWrongBadge}>
            <Feather name="x" size={18} color="#FFFFFF" />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

export default function PictureChoiceRound({ word, mode, onComplete }: PictureChoiceRoundProps) {
  const { locale, t } = useI18n();
  const { recordWordAttempt } = useGameState();
  const choices = useMemo(() => buildPictureChoices(words, word), [word.id]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mascotScale = useSharedValue(1);
  const heroScale = useSharedValue(0.7);
  const heroOpacity = useSharedValue(0);
  const gridOpacity = useSharedValue(1);
  const wordLabel = word.spellings[locale];

  useEffect(() => {
    const timer = setTimeout(() => speakWord(wordLabel, locale), 350);
    return () => {
      clearTimeout(timer);
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, [word.id, locale, wordLabel]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value }],
  }));

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ scale: heroScale.value }],
  }));

  const gridAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
  }));

  const choose = async (choice: WordItem) => {
    if (locked || wrongIds.includes(choice.id)) return;
    setSelectedId(choice.id);

    if (choice.id === word.id) {
      setLocked(true);
      recordWordAttempt(word.id, true);
      playCorrectSound();

      // Smooth, deliberate transition
      gridOpacity.value = withTiming(0, { duration: 280 });
      heroOpacity.value = withTiming(1, { duration: 320 });
      heroScale.value = withSpring(1, { damping: 14, stiffness: 70 });
      mascotScale.value = withSequence(withSpring(1.2), withSpring(1));

      await speakWordAndWait(wordLabel, locale);
      // Balanced 2.4s hold time after speech
      finishTimer.current = setTimeout(onComplete, 2400);
      return;
    }

    recordWordAttempt(word.id, false);
    playWrongSound();
    setWrongIds((current) => [...current, choice.id]);
    mascotScale.value = withSequence(withSpring(0.9), withSpring(1));
  };

  const isSolved = selectedId === word.id;

  return (
    <View style={styles.container}>
      {/* Prompt Card with Mino, Animal Name & Sound Button */}
      <View style={styles.promptCard}>
        <Animated.View style={[styles.mascotWrap, mascotStyle]}>
          <Image source={require('../assets/images/mino.png')} style={styles.mascot} contentFit="contain" />
        </Animated.View>

        {/* Center: Large Animal Name */}
        <View style={styles.wordNameCenterWrap}>
          <Text style={styles.wordNameCenterText}>{wordLabel}</Text>
        </View>

        {/* Bubbly Audio Speech Pill */}
        <Pressable
          onPress={() => speakWord(wordLabel, locale)}
          style={({ pressed }) => [styles.listenButtonPill, pressed && { transform: [{ scale: 0.96 }] }]}
          accessibilityRole="button"
          accessibilityLabel={t('hearWord')}
        >
          <LinearGradient
            colors={['#FF9F1C', '#FF7A00', '#F26419']}
            style={styles.listenGradient}
          >
            <Text style={styles.soundWavesEmoji}>🔊</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Grid Container */}
      <View style={styles.gridContainer}>
        {/* 4 Choices Grid (Smoothly fades when correct) */}
        <Animated.View style={[styles.grid, gridAnimatedStyle]} pointerEvents={isSolved ? 'none' : 'auto'}>
          {choices.map((choice) => {
            const isWrong = wrongIds.includes(choice.id);
            return (
              <ChoiceCard
                key={choice.id}
                choice={choice}
                isWrong={isWrong}
                locked={locked}
                onPress={() => choose(choice)}
                locale={locale}
              />
            );
          })}
        </Animated.View>

        {/* Centered Full-Width Card on Correct */}
        {isSolved ? (
          <Animated.View style={[styles.fullCenteredCard, heroAnimatedStyle]}>
            <View style={styles.heroCheckBadge}>
              <Feather name="check" size={30} color="#FFFFFF" />
            </View>

            <View style={styles.heroImageWrap}>
              <WordVisual
                word={word}
                style={styles.heroVisual}
                emojiSize={word.category === 'flags' ? 165 : 135}
              />
            </View>

            <View style={styles.heroLabelRow}>
              <Text style={styles.heroWordLabel}>{wordLabel}</Text>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 8 },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  mascotWrap: { width: 58, height: 62 },
  mascot: { width: '100%', height: '100%' },
  wordNameCenterWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  wordNameCenterText: {
    color: '#382210',
    fontSize: 34,
    fontWeight: '900',
    textTransform: 'capitalize',
    textAlign: 'center',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
  listenButtonPill: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  listenGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#FFAE4A',
  },
  soundWavesEmoji: {
    fontSize: 26,
  },
  gridContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceWrap: {
    width: '48%',
    height: '48%',
    minHeight: 145,
    maxHeight: 235,
  },
  choice: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderBottomWidth: 7,
    borderColor: '#E5D7C4',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  choicePressed: {
    transform: [{ scale: 0.96 }, { translateY: 2 }],
  },
  choiceWrong: {
    borderColor: '#FF4D6D',
    backgroundColor: '#FFF0F2',
    borderBottomWidth: 3,
    opacity: 0.55,
  },
  statusWrongBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF4D6D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visual: { width: '80%', height: '80%' },
  fullCenteredCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    width: '100%',
    height: '100%',
    backgroundColor: '#E8FAF2',
    borderWidth: 3.5,
    borderBottomWidth: 8,
    borderColor: '#06D6A0',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 16,
    shadowColor: '#06D6A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroCheckBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#06D6A0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  heroImageWrap: {
    width: '80%',
    height: '58%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroVisual: {
    width: '100%',
    height: '100%',
  },
  heroLabelRow: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#06D6A0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  heroWordLabel: {
    color: '#0B6E4F',
    fontSize: 26,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
});
