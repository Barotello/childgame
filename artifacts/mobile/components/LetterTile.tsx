import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';

export const DEFAULT_TILE_SIZE = 52;
export const MIN_TILE_SIZE = 48;

export type DropResult = { correct: boolean; dx: number; dy: number };

type LetterTileProps = {
  letter: string;
  color: string;
  locked: boolean;
  tileKey?: string;
  size?: number;
  onAttemptDrop: (letter: string, centerX: number, centerY: number, tileKey?: string) => DropResult;
  /** Tap places letter into the next matching empty slot (no drag required). */
  onTapPlace?: (letter: string, tileKey?: string) => boolean;
  onFeedback?: (result: 'correct' | 'wrong') => void;
};

export default function LetterTile({
  letter,
  color,
  locked,
  tileKey,
  size = DEFAULT_TILE_SIZE,
  onAttemptDrop,
  onTapPlace,
  onFeedback,
}: LetterTileProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const lockedSV = useSharedValue(locked);
  const viewRef = useRef<Animated.View>(null);
  const didPan = useSharedValue(false);

  useEffect(() => {
    lockedSV.value = locked;
  }, [locked, lockedSV]);

  const handleGrab = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const applyCorrect = (dx: number, dy: number) => {
    translateX.value = withSpring(translateX.value + dx, { damping: 12 });
    translateY.value = withSpring(translateY.value + dy, { damping: 12 });
    scale.value = withSequence(withTiming(1.3, { duration: 120 }), withSpring(1, { damping: 8 }));
    playCorrectSound();
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const applyWrong = () => {
    translateX.value = withSequence(
      withTiming(-8, { duration: 65 }),
      withTiming(8, { duration: 65 }),
      withTiming(-5, { duration: 65 }),
      withTiming(5, { duration: 65 }),
      withSpring(0),
    );
    translateY.value = withSpring(0);
    playWrongSound();
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const finishDrop = (absoluteX: number, absoluteY: number) => {
    const result = onAttemptDrop(letter, absoluteX, absoluteY, tileKey);

    if (result.correct) {
      applyCorrect(result.dx, result.dy);
      onFeedback?.('correct');
    } else {
      applyWrong();
      onFeedback?.('wrong');
    }
  };

  const handleTap = () => {
    if (locked || !onTapPlace) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const ok = onTapPlace(letter, tileKey);
    if (ok) {
      scale.value = withSequence(withTiming(1.25, { duration: 100 }), withSpring(1, { damping: 8 }));
      playCorrectSound();
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onFeedback?.('correct');
    } else {
      applyWrong();
      onFeedback?.('wrong');
    }
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      if (lockedSV.value) return;
      didPan.value = false;
      scale.value = withSpring(1.12);
      runOnJS(handleGrab)();
    })
    .onChange((event) => {
      if (lockedSV.value) return;
      if (Math.abs(event.changeX) + Math.abs(event.changeY) > 0.5) {
        didPan.value = true;
      }
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onEnd((event) => {
      if (lockedSV.value) return;
      scale.value = withSpring(1);
      if (didPan.value) {
        runOnJS(finishDrop)(event.absoluteX, event.absoluteY);
      } else {
        // Treat near-stationary pan end as tap fallback
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        runOnJS(handleTap)();
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    if (lockedSV.value) return;
    runOnJS(handleTap)();
  });

  const gesture = Gesture.Exclusive(pan, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: didPan.value ? 999 : (lockedSV.value ? 1 : 20),
    elevation: didPan.value ? 100 : (lockedSV.value ? 1 : 4),
    opacity: lockedSV.value ? 0.35 : 1,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={viewRef}
        style={[
          styles.tile,
          {
            backgroundColor: locked ? '#4CD787' : color,
            width: size,
            height: size,
            borderRadius: size / 2,
            minWidth: MIN_TILE_SIZE,
            minHeight: MIN_TILE_SIZE,
          },
          animatedStyle,
        ]}
        pointerEvents={locked ? 'none' : 'auto'}
        accessibilityRole="button"
        accessibilityLabel={letter}
        accessibilityState={{ disabled: locked }}
      >
        <View style={styles.glossHighlight} pointerEvents="none" />
        <Text style={[styles.letter, { fontSize: size * 0.48 }]}>{letter}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 5,
    borderTopColor: 'rgba(255, 255, 255, 0.85)',
    borderLeftColor: 'rgba(255, 255, 255, 0.45)',
    borderRightColor: 'rgba(0, 0, 0, 0.12)',
    borderBottomColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  glossHighlight: {
    position: 'absolute',
    top: 2,
    left: '18%',
    right: '18%',
    height: '28%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 999,
  },
  letter: {
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 2,
  },
});
