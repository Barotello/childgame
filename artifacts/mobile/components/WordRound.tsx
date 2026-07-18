import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LetterTile, { DropResult, MIN_TILE_SIZE } from './LetterTile';
import type { WordItem } from '@/constants/words';
import { type Locale } from '@/constants/translations';
import { useColors } from '@/hooks/useColors';
import { playCorrectSound } from '@/lib/sounds';
import { speakWord, speakWordAndWait } from '@/lib/speech';
import { useI18n } from '@/lib/i18n';
import { useGameState } from '@/lib/gameState';
import { Feather } from '@expo/vector-icons';
import { gameTheme } from '@/constants/gameTheme';

const TILE_COLORS = ['#FF6F59', '#3AB0FF', '#FFC93C', '#B57BFF', '#FF8FB1', '#38C6B0'];

const DISTRACTOR_POOLS: Record<Locale, string[]> = {
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  tr: 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split(''),
  fr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÂÇÉÈÊËÎÏÔÖÙÛÜ'.split(''),
  es: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑÜ'.split(''),
  it: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÉÌÒÙ'.split(''),
  de: 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split(''),
};

const DISTRACTOR_COUNT = 2;

type SlotMeasurement = { pageX: number; pageY: number; width: number; height: number };

type ShuffledTile = { key: string; letter: string; color: string };

function pickDistractors(letters: string[], locale: Locale): string[] {
  const used = new Set(letters);
  const pool = DISTRACTOR_POOLS[locale].filter((letter) => !used.has(letter));
  const picked: string[] = [];
  const poolCopy = [...pool];
  while (picked.length < DISTRACTOR_COUNT && poolCopy.length > 0) {
    const index = Math.floor(Math.random() * poolCopy.length);
    picked.push(poolCopy.splice(index, 1)[0]);
  }
  return picked;
}

function buildTray(letters: string[], locale: Locale): ShuffledTile[] {
  const distractors = pickDistractors(letters, locale);
  const allLetters = [...letters, ...distractors];

  const arr = allLetters.map((letter, index) => ({
    key: `${letter}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    letter,
    color: TILE_COLORS[index % TILE_COLORS.length],
  }));

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

type WordRoundProps = {
  word: WordItem;
  onComplete: () => void;
  /** Skip advances without awarding coins / completion credit. */
  onSkip?: () => void;
};

export default function WordRound({ word, onComplete, onSkip }: WordRoundProps) {
  const {
    hintTokens,
    consumeHintToken,
    skipTokens,
    consumeSkipToken,
    recordWordAttempt,
    recordHintUse,
    recordSkipUse,
  } = useGameState();
  const colors = useColors();
  const { locale, t } = useI18n();
  const { width: windowWidth } = useWindowDimensions();
  const rawLetters = word.spellings[locale].toLocaleUpperCase(locale).split('');
  // Never create slots for spaces or hyphens (defensive for any residual multi-word data)
  const letters = rawLetters.filter((ch) => ch.trim().length > 0 && ch !== '-');
  const tiles = useMemo(() => buildTray(letters, locale), [word.id, locale]);

  const maxGap = 8;
  const availableWidth = Math.min(windowWidth, 560);
  const padding = 48;
  const rawSize = Math.floor((availableWidth - padding - maxGap * Math.max(0, letters.length - 1)) / Math.max(1, letters.length));
  // Keep every letter comfortably tappable; long words wrap instead of shrinking.
  const dynamicTileSize = Math.min(56, Math.max(MIN_TILE_SIZE, rawSize));
  const dynamicGap = Math.min(
    10,
    Math.max(6, Math.floor((availableWidth - padding - letters.length * dynamicTileSize) / Math.max(1, letters.length - 1))),
  );

  const [filled, setFilled] = useState<Array<string | null>>(() => letters.map(() => null));
  const filledRef = useRef<Array<string | null>>(filled);
  filledRef.current = filled;

  const usedTileKeys = useRef<Set<string>>(new Set());
  const [, forceRender] = useState(0);

  const slotRefs = useRef<Array<View | null>>([]);
  const slotMeasurements = useRef<SlotMeasurement[]>([]);
  const revealProgress = useSharedValue(0);
  const completionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const feedbackProgress = useSharedValue(0);

  useEffect(() => {
    return () => {
      if (completionTimeout.current) clearTimeout(completionTimeout.current);
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    };
  }, []);

  // Auto-speak the word when the round starts (helps 4–7 age group)
  useEffect(() => {
    const label = word.spellings[locale];
    const timer = setTimeout(() => speakWord(label, locale), 400);
    return () => clearTimeout(timer);
  }, [word.id, locale]);

  const measureSlots = () => {
    letters.forEach((_, index) => {
      const node = slotRefs.current[index] as unknown as {
        measure?: (
          callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void,
        ) => void;
      };
      node?.measure?.((_x, _y, width, height, pageX, pageY) => {
        slotMeasurements.current[index] = { pageX, pageY, width, height };
      });
    });
  };

  useEffect(() => {
    const timeout = setTimeout(measureSlots, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.id, locale, dynamicTileSize]);

  const handleSlotsLayout = (_event: LayoutChangeEvent) => {
    measureSlots();
  };

  const showFeedback = (result: 'correct' | 'wrong') => {
    setFeedback(result);
    feedbackProgress.value = 0;
    feedbackProgress.value = withSequence(
      withSpring(1, { damping: 12, stiffness: 170 }),
      withTiming(1, { duration: 700 }),
      withTiming(0, { duration: 180 }),
    );
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setFeedback(null), 1100);
  };

  const handleLearningFeedback = (result: 'correct' | 'wrong') => {
    showFeedback(result);
    recordWordAttempt(word.id, result === 'correct');
  };

  const applyLetterAtIndex = (index: number, letter: string, tileKey?: string) => {
    const next = [...filledRef.current];
    next[index] = letter;
    filledRef.current = next;
    setFilled(next);
    if (tileKey) usedTileKeys.current.add(tileKey);

    const total = letters.length;
    const doneCount = next.filter(Boolean).length;
    revealProgress.value = withTiming(doneCount / total, { duration: 250 });

    if (doneCount === total) {
      if (completionTimeout.current) clearTimeout(completionTimeout.current);
      speakWordAndWait(word.spellings[locale], locale).then(() => {
        completionTimeout.current = setTimeout(onComplete, 250);
      });
    }
  };

  const handleHintPress = () => {
    if (hintTokens <= 0) return;
    const emptyIndex = filledRef.current.findIndex((value) => value === null);
    if (emptyIndex === -1) return;

    const consumed = consumeHintToken();
    if (!consumed) return;
    recordHintUse(word.id);

    const targetLetter = letters[emptyIndex];
    const matchingTile = tiles.find(
      (tile) => tile.letter === targetLetter && !usedTileKeys.current.has(tile.key),
    );

    applyLetterAtIndex(emptyIndex, targetLetter, matchingTile?.key);
    playCorrectSound();
    showFeedback('correct');
    forceRender((n) => n + 1);
  };

  const handleSkipPress = () => {
    if (skipTokens <= 0) return;
    const consumed = consumeSkipToken();
    if (!consumed) return;
    recordSkipUse(word.id);

    if (completionTimeout.current) clearTimeout(completionTimeout.current);
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const attemptDrop = (letter: string, centerX: number, centerY: number): DropResult => {
    const HIT_PADDING = 22;

    for (let index = 0; index < letters.length; index++) {
      if (filledRef.current[index]) continue;
      const box = slotMeasurements.current[index];
      if (!box) continue;

      const withinX = centerX >= box.pageX - HIT_PADDING && centerX <= box.pageX + box.width + HIT_PADDING;
      const withinY = centerY >= box.pageY - HIT_PADDING && centerY <= box.pageY + box.height + HIT_PADDING;
      if (!withinX || !withinY) continue;

      if (letters[index] !== letter) {
        return { correct: false, dx: 0, dy: 0 };
      }

      applyLetterAtIndex(index, letter);

      const slotCenterX = box.pageX + box.width / 2;
      const slotCenterY = box.pageY + box.height / 2;
      return { correct: true, dx: slotCenterX - centerX, dy: slotCenterY - centerY };
    }

    return { correct: false, dx: 0, dy: 0 };
  };

  /** Tap: place letter into the first empty slot that needs this letter. */
  const handleTapPlace = (letter: string): boolean => {
    const emptyIndex = filledRef.current.findIndex((value, index) => value === null && letters[index] === letter);
    if (emptyIndex === -1) return false;

    const matchingTile = tiles.find(
      (tile) => tile.letter === letter && !usedTileKeys.current.has(tile.key),
    );
    applyLetterAtIndex(emptyIndex, letter, matchingTile?.key);
    forceRender((n) => n + 1);
    return true;
  };

  const imageWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + revealProgress.value * 0.06 }],
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    opacity: 0.7 + 0.3 * revealProgress.value,
  }));

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackProgress.value,
    transform: [
      { translateY: (1 - feedbackProgress.value) * 8 },
      { scale: 0.94 + feedbackProgress.value * 0.06 },
    ],
  }));

  const wordLabel = word.spellings[locale];

  return (
    <View style={styles.container}>
      <View style={[styles.screenCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.guideRow}>
          <View style={styles.guideIcon}>
            <Feather name="headphones" size={20} color={gameTheme.colors.sky} />
          </View>
          <Text style={styles.guideText}>{t('listenAndFind')}</Text>
          <Pressable
            style={styles.hearButton}
            onPress={() => speakWord(wordLabel, locale)}
            accessibilityLabel={t('hearWord')}
            accessibilityRole="button"
            hitSlop={6}
          >
            <Feather name="volume-2" size={23} color="#FFFFFF" />
          </Pressable>
        </View>

        <View
          style={[
            styles.screenInner,
            { borderColor: gameTheme.colors.sky, backgroundColor: gameTheme.colors.skySoft },
          ]}
        >
          <Animated.View style={[styles.imageWrap, imageWrapStyle]}>
            {word.emoji ? (
              <Animated.Text style={[{ fontSize: 84, textAlign: 'center', lineHeight: 140 }, emojiStyle]}>
                {word.emoji}
              </Animated.Text>
            ) : word.swatch ? (
              <Animated.View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: word.swatch,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              />
            ) : (
              <Image source={word.image} style={styles.image} contentFit="contain" />
            )}
          </Animated.View>
        </View>

        <View style={[styles.slotsRow, { gap: dynamicGap }]} onLayout={handleSlotsLayout}>
          {letters.map((letter, index) => {
            const value = filled[index];
            return (
              <View
                key={`slot-${index}`}
                ref={(node) => {
                  slotRefs.current[index] = node;
                }}
                style={[
                  styles.slot,
                  {
                    borderColor: value ? colors.success : colors.border,
                    backgroundColor: value ? '#E4FBEE' : colors.background,
                    width: dynamicTileSize,
                    height: dynamicTileSize,
                    borderRadius: dynamicTileSize / 2,
                    minWidth: MIN_TILE_SIZE,
                    minHeight: MIN_TILE_SIZE,
                  },
                ]}
              >
                {value ? <Text style={[styles.slotLetter, { fontSize: dynamicTileSize * 0.42 }]}>{value}</Text> : null}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.playZone}>
        <View style={styles.feedbackSlot} pointerEvents="none">
          {feedback ? (
            <Animated.View
              style={[
                styles.feedbackPill,
                feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong,
                feedbackStyle,
              ]}
            >
              <Feather
                name={feedback === 'correct' ? 'check-circle' : 'refresh-cw'}
                size={20}
                color={feedback === 'correct' ? gameTheme.colors.mint : gameTheme.colors.retry}
              />
              <Text
                style={[
                  styles.feedbackText,
                  { color: feedback === 'correct' ? '#238A59' : '#A95D37' },
                ]}
              >
                {t(feedback === 'correct' ? 'correctLetter' : 'tryAnotherLetter')}
              </Text>
            </Animated.View>
          ) : null}
        </View>

        <Text style={styles.dragHint}>{t('dragHint')}</Text>

        <View style={[styles.tray, { gap: dynamicGap }]}>
          {tiles.map((tile) => (
            <View
              key={tile.key}
              style={[styles.trayItem, { width: dynamicTileSize, height: dynamicTileSize }]}
            >
              <LetterTile
                letter={tile.letter}
                color={tile.color}
                locked={usedTileKeys.current.has(tile.key)}
                size={dynamicTileSize}
                onAttemptDrop={attemptDrop}
                onTapPlace={handleTapPlace}
                onFeedback={handleLearningFeedback}
              />
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleHintPress}
            disabled={hintTokens <= 0}
            style={[
              styles.actionButton,
              {
                backgroundColor: gameTheme.colors.sky,
                opacity: hintTokens <= 0 ? 0.4 : 1,
              },
            ]}
            accessibilityLabel={`${t('hint')} ${hintTokens}`}
          >
            <Feather name="help-circle" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>
              {t('hint')} ({hintTokens})
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSkipPress}
            disabled={skipTokens <= 0}
            style={[
              styles.actionButton,
              styles.skipButton,
              { opacity: skipTokens <= 0 ? 0.4 : 1 },
            ]}
            accessibilityLabel={`${t('skip')} ${skipTokens}`}
          >
            <Feather name="skip-forward" size={18} color={gameTheme.colors.ink} />
            <Text style={[styles.actionText, { color: gameTheme.colors.ink }]}>
              {t('skip')} ({skipTokens})
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    overflow: 'visible',
  },
  screenCard: {
    width: '100%',
    borderRadius: gameTheme.radius.card,
    borderWidth: 2,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    marginTop: 4,
  },
  guideRow: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    gap: 9,
  },
  guideIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: gameTheme.colors.skySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    flex: 1,
    color: gameTheme.colors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 19,
  },
  screenInner: {
    width: '100%',
    height: 148,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  hearButton: {
    width: gameTheme.touchTarget,
    height: gameTheme.touchTarget,
    borderRadius: 24,
    backgroundColor: gameTheme.colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  imageWrap: {
    width: 140,
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dragHint: {
    color: gameTheme.colors.inkSoft,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: gameTheme.touchTarget,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: gameTheme.radius.pill,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  slot: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F8A55',
  },
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 4,
    width: '100%',
    overflow: 'visible',
  },
  trayItem: {
    overflow: 'visible',
  },
  playZone: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 2,
  },
  feedbackSlot: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  feedbackPill: {
    minHeight: 36,
    maxWidth: '96%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: gameTheme.radius.pill,
    borderWidth: 2,
    paddingHorizontal: 14,
  },
  feedbackCorrect: {
    backgroundColor: gameTheme.colors.mintSoft,
    borderColor: '#B7EBCF',
  },
  feedbackWrong: {
    backgroundColor: gameTheme.colors.retrySoft,
    borderColor: '#F6C8AA',
  },
  feedbackText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: gameTheme.colors.sunshine,
  },
});
