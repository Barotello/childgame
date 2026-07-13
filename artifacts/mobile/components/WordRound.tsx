import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import LetterTile, { DropResult, TILE_SIZE } from './LetterTile';
import type { WordItem } from '@/constants/words';
import { useColors } from '@/hooks/useColors';

const TILE_COLORS = ['#FF6F59', '#3AB0FF', '#FFC93C', '#B57BFF', '#FF8FB1', '#38C6B0'];

type SlotMeasurement = { pageX: number; pageY: number; width: number; height: number };

type ShuffledTile = { key: string; letter: string; color: string };

function shuffleLetters(letters: string[]): ShuffledTile[] {
  const arr = letters.map((letter, index) => ({
    key: `${letter}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    letter,
    color: TILE_COLORS[index % TILE_COLORS.length],
  }));

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const isSameOrder = arr.every((tile, index) => tile.letter === letters[index]);
  if (isSameOrder && arr.length > 1) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }

  return arr;
}

type WordRoundProps = {
  word: WordItem;
  onComplete: () => void;
};

export default function WordRound({ word, onComplete }: WordRoundProps) {
  const colors = useColors();
  const letters = word.letters;
  const tiles = useMemo(() => shuffleLetters(letters), [word.id]);

  const [filled, setFilled] = useState<Array<string | null>>(() => letters.map(() => null));
  const filledRef = useRef<Array<string | null>>(filled);
  filledRef.current = filled;

  const slotRefs = useRef<Array<View | null>>([]);
  const slotMeasurements = useRef<SlotMeasurement[]>([]);
  const revealProgress = useSharedValue(0);

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
  }, [word.id]);

  const handleSlotsLayout = (_event: LayoutChangeEvent) => {
    measureSlots();
  };

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

      const next = [...filledRef.current];
      next[index] = letter;
      filledRef.current = next;
      setFilled(next);

      const total = letters.length;
      const doneCount = next.filter(Boolean).length;
      revealProgress.value = withTiming(doneCount / total, { duration: 250 });

      if (doneCount === total) {
        setTimeout(() => onComplete(), 700);
      }

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
    transform: [{ scale: 1 + revealProgress.value * 0.08 }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageWrap, imageWrapStyle]}>
        <Image source={word.image} style={styles.image} contentFit="contain" />
        <Animated.View style={[styles.silhouetteOverlay, silhouetteStyle]}>
          <Image source={word.image} style={styles.image} contentFit="contain" tintColor={colors.mutedForeground} />
        </Animated.View>
      </Animated.View>

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
                  backgroundColor: value ? '#E4FBEE' : colors.card,
                },
              ]}
            >
              {value ? <Text style={styles.slotLetter}>{value}</Text> : null}
            </View>
          );
        })}
      </View>

      <View style={styles.tray}>
        {tiles.map((tile) => (
          <View key={tile.key} style={styles.trayItem}>
            <LetterTile letter={tile.letter} color={tile.color} onAttemptDrop={attemptDrop} />
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
  imageWrap: {
    width: 200,
    height: 200,
    marginTop: 8,
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
    marginTop: 4,
  },
  slot: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLetter: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F8A55',
  },
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 24,
    gap: 10,
  },
  trayItem: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
});
