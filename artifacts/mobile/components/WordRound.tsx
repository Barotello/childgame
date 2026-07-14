import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import LetterTile, { DropResult, TILE_SIZE } from './LetterTile';
import type { WordItem } from '@/constants/words';
import { type Locale } from '@/constants/translations';
import { useColors } from '@/hooks/useColors';
import { playCorrectSound } from '@/lib/sounds';
import { useI18n } from '@/lib/i18n';

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
  hintRequest: number;
  onHintApplied: () => void;
  onComplete: () => void;
};

export default function WordRound({ word, hintRequest, onHintApplied, onComplete }: WordRoundProps) {
  const colors = useColors();
  const { locale } = useI18n();
  const letters = word.spellings[locale].toLocaleUpperCase(locale).split('');
  const tiles = useMemo(() => buildTray(letters, locale), [word.id, locale]);

  const [filled, setFilled] = useState<Array<string | null>>(() => letters.map(() => null));
  const filledRef = useRef<Array<string | null>>(filled);
  filledRef.current = filled;

  const usedTileKeys = useRef<Set<string>>(new Set());
  const [, forceRender] = useState(0);

  const slotRefs = useRef<Array<View | null>>([]);
  const slotMeasurements = useRef<SlotMeasurement[]>([]);
  const revealProgress = useSharedValue(0);
  const hintRequestRef = useRef(hintRequest);

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
  }, [word.id, locale]);

  const handleSlotsLayout = (_event: LayoutChangeEvent) => {
    measureSlots();
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
      setTimeout(() => onComplete(), 700);
    }
  };

  useEffect(() => {
    if (hintRequestRef.current === hintRequest) return;
    hintRequestRef.current = hintRequest;

    const emptyIndex = filledRef.current.findIndex((value) => value === null);
    if (emptyIndex === -1) return;

    const targetLetter = letters[emptyIndex];
    const matchingTile = tiles.find(
      (tile) => tile.letter === targetLetter && !usedTileKeys.current.has(tile.key),
    );

    applyLetterAtIndex(emptyIndex, targetLetter, matchingTile?.key);
    playCorrectSound();
    forceRender((n) => n + 1);
    onHintApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hintRequest]);

  const attemptDrop = (letter: string, centerX: number, centerY: number): DropResult => {
    const HIT_PADDING = 18;

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

  const silhouetteStyle = useAnimatedStyle(() => ({
    opacity: 1 - revealProgress.value,
  }));

  const imageWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + revealProgress.value * 0.06 }],
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.screenCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.screenInner, { borderColor: colors.secondary, backgroundColor: colors.muted }]}>
          <Animated.View style={[styles.imageWrap, imageWrapStyle]}>
            <Image source={word.image} style={styles.image} contentFit="contain" />
            <Animated.View style={[styles.silhouetteOverlay, silhouetteStyle]}>
              <Image
                source={word.image}
                style={styles.image}
                contentFit="contain"
                tintColor={colors.mutedForeground}
              />
            </Animated.View>
          </Animated.View>
        </View>

        <View style={styles.slotsRow} onLayout={handleSlotsLayout}>
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
                  },
                ]}
              >
                {value ? <Text style={styles.slotLetter}>{value}</Text> : null}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.tray}>
        {tiles.map((tile) => (
          <View key={tile.key} style={styles.trayItem}>
            <LetterTile
              letter={tile.letter}
              color={tile.color}
              locked={usedTileKeys.current.has(tile.key)}
              onAttemptDrop={attemptDrop}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  screenCard: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 4,
  },
  screenInner: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageWrap: {
    width: 160,
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  silhouetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
  },
  slot: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: TILE_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F8A55',
  },
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingTop: 20,
    gap: 10,
  },
  trayItem: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
});
