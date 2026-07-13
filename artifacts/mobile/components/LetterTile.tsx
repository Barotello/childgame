import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
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

export const TILE_SIZE = 56;

export type DropResult = { correct: boolean; dx: number; dy: number };

type LetterTileProps = {
  letter: string;
  color: string;
  locked: boolean;
  onAttemptDrop: (letter: string, centerX: number, centerY: number) => DropResult;
};

export default function LetterTile({ letter, color, locked, onAttemptDrop }: LetterTileProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const lockedSV = useSharedValue(locked);
  const viewRef = useRef<Animated.View>(null);

  useEffect(() => {
    lockedSV.value = locked;
  }, [locked, lockedSV]);

  const handleGrab = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const finishDrop = () => {
    const node = viewRef.current as unknown as {
      measure?: (
        callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void,
      ) => void;
    };

    node?.measure?.((_x, _y, width, height, pageX, pageY) => {
      const centerX = pageX + width / 2;
      const centerY = pageY + height / 2;
      const result = onAttemptDrop(letter, centerX, centerY);

      if (result.correct) {
        translateX.value = withSpring(translateX.value + result.dx, { damping: 12 });
        translateY.value = withSpring(translateY.value + result.dy, { damping: 12 });
        scale.value = withSequence(withTiming(1.3, { duration: 120 }), withSpring(1, { damping: 8 }));
        playCorrectSound();
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        playWrongSound();
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      if (lockedSV.value) return;
      scale.value = withSpring(1.12);
      runOnJS(handleGrab)();
    })
    .onChange((event) => {
      if (lockedSV.value) return;
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onEnd(() => {
      if (lockedSV.value) return;
      scale.value = withSpring(1);
      runOnJS(finishDrop)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: lockedSV.value ? 1 : 20,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        ref={viewRef}
        style={[styles.tile, { backgroundColor: locked ? '#4CD787' : color }, animatedStyle]}
        pointerEvents={locked ? 'none' : 'auto'}
      >
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: TILE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  letter: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
