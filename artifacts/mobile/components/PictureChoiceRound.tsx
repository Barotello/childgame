import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import type { LearningActivity } from '@/constants/curriculum';
import { buildPictureChoices } from '@/constants/curriculum';
import { gameTheme } from '@/constants/gameTheme';
import type { WordItem } from '@/constants/words';
import words from '@/constants/words';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { speakWord, speakWordAndWait } from '@/lib/speech';
import WordVisual from './WordVisual';

type PictureChoiceRoundProps = {
  word: WordItem;
  mode: Extract<LearningActivity, 'picture' | 'listen'>;
  onComplete: () => void;
};

export default function PictureChoiceRound({ word, mode, onComplete }: PictureChoiceRoundProps) {
  const { locale, t } = useI18n();
  const { recordWordAttempt } = useGameState();
  const choices = useMemo(() => buildPictureChoices(words, word), [word.id]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mascotScale = useSharedValue(1);
  const wordLabel = word.spellings[locale];

  useEffect(() => {
    const timer = setTimeout(() => speakWord(wordLabel, locale), 450);
    return () => {
      clearTimeout(timer);
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, [word.id, locale, wordLabel]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value }],
  }));

  const choose = async (choice: WordItem) => {
    if (locked || wrongIds.includes(choice.id)) return;
    setSelectedId(choice.id);

    if (choice.id === word.id) {
      setLocked(true);
      recordWordAttempt(word.id, true);
      playCorrectSound();
      mascotScale.value = withSequence(withSpring(1.12), withSpring(1));
      await speakWordAndWait(wordLabel, locale);
      finishTimer.current = setTimeout(onComplete, 250);
      return;
    }

    recordWordAttempt(word.id, false);
    playWrongSound();
    setWrongIds((current) => [...current, choice.id]);
    mascotScale.value = withSequence(withSpring(0.92), withSpring(1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptCard}>
        <Animated.View style={[styles.mascotWrap, mascotStyle]}>
          <Image source={require('../assets/images/mino.png')} style={styles.mascot} contentFit="contain" />
        </Animated.View>
        <View style={styles.promptCopy}>
          <Text style={styles.minoName}>{t('minoSays')}</Text>
          <Text style={styles.prompt}>{t(mode === 'picture' ? 'findThePicture' : 'listenAndChoose')}</Text>
          {mode === 'picture' ? <Text style={styles.targetWord}>{wordLabel}</Text> : null}
        </View>
        <Pressable
          onPress={() => speakWord(wordLabel, locale)}
          style={styles.listenButton}
          accessibilityRole="button"
          accessibilityLabel={t('hearWord')}
        >
          <Feather name="volume-2" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {choices.map((choice) => {
          const isCorrect = selectedId === choice.id && choice.id === word.id;
          const isWrong = wrongIds.includes(choice.id);
          return (
            <Pressable
              key={choice.id}
              onPress={() => choose(choice)}
              disabled={locked || isWrong}
              accessibilityRole="button"
              accessibilityLabel={choice.spellings[locale]}
              style={({ pressed }) => [
                styles.choice,
                isCorrect && styles.choiceCorrect,
                isWrong && styles.choiceWrong,
                pressed && !locked && styles.choicePressed,
              ]}
            >
              <WordVisual word={choice} style={styles.visual} emojiSize={68} />
              <View style={[styles.statusDot, isCorrect && styles.statusCorrect, isWrong && styles.statusWrong]}>
                {isCorrect || isWrong ? (
                  <Feather name={isCorrect ? 'check' : 'refresh-cw'} size={17} color="#FFFFFF" />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.feedbackRow}>
        <Text style={[styles.feedback, wrongIds.length > 0 && styles.feedbackRetry]}>
          {selectedId === word.id
            ? t('pictureCorrect')
            : wrongIds.length > 0
              ? t('pictureTryAgain')
              : t('tapThePicture')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 8 },
  promptCard: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: gameTheme.colors.white,
    borderWidth: 2,
    borderColor: '#F0D9B6',
    borderRadius: 24,
    padding: 10,
    gap: 10,
  },
  mascotWrap: { width: 66, height: 72 },
  mascot: { width: '100%', height: '100%' },
  promptCopy: { flex: 1 },
  minoName: { color: '#D86B3F', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  prompt: { color: gameTheme.colors.ink, fontSize: 15, fontWeight: '800', marginTop: 2 },
  targetWord: { color: gameTheme.colors.coral, fontSize: 24, fontWeight: '900', marginTop: 2 },
  listenButton: {
    width: gameTheme.touchTarget,
    height: gameTheme.touchTarget,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gameTheme.colors.sky,
  },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 12 },
  choice: {
    width: '48%',
    flexGrow: 1,
    height: '45%',
    minHeight: 145,
    maxHeight: 230,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderBottomWidth: 7,
    borderColor: '#E5D7C4',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  choicePressed: { transform: [{ scale: 0.97 }, { translateY: 2 }] },
  choiceCorrect: { borderColor: gameTheme.colors.mint, backgroundColor: gameTheme.colors.mintSoft },
  choiceWrong: { borderColor: gameTheme.colors.retry, backgroundColor: gameTheme.colors.retrySoft, opacity: 0.72 },
  visual: { width: '82%', height: '82%' },
  statusDot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCorrect: { backgroundColor: gameTheme.colors.mint },
  statusWrong: { backgroundColor: gameTheme.colors.retry },
  feedbackRow: { minHeight: 38, alignItems: 'center', justifyContent: 'center' },
  feedback: { color: gameTheme.colors.inkSoft, fontSize: 13, fontWeight: '800', textAlign: 'center' },
  feedbackRetry: { color: '#A95D37' },
});
