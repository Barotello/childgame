import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { WordItem } from '@/constants/words';
import { translations } from '@/constants/translations';
import { useI18n } from '@/lib/i18n';
const PARTICLE_COLORS = ['#FF6F59', '#3AB0FF', '#FFC93C', '#B57BFF', '#38C6B0', '#FF8FB1'];
const PARTICLE_COUNT = 14;

type Particle = { angle: number; distance: number; color: string; delay: number };

function buildParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    angle: (Math.PI * 2 * index) / PARTICLE_COUNT + Math.random() * 0.3,
    distance: 90 + Math.random() * 50,
    color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
    delay: Math.random() * 120,
  }));
}

function ConfettiParticle({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(particle.delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(particle.angle) * particle.distance * progress.value },
      { translateY: Math.sin(particle.angle) * particle.distance * progress.value },
      { scale: 1 - progress.value * 0.4 },
    ],
  }));

  return <Animated.View style={[styles.particle, { backgroundColor: particle.color }, style]} />;
}

type CelebrationProps = {
  word: WordItem;
  coinsEarned?: number;
};

export default function Celebration({ word, coinsEarned }: CelebrationProps) {
  const { locale, t } = useI18n();
  const praiseList = translations[locale].praise;
  const praise = useMemo(() => praiseList[Math.floor(Math.random() * praiseList.length)], [praiseList]);
  const particles = useMemo(buildParticles, []);
  const scale = useSharedValue(0.6);
  const wordLabel = word.spellings[locale].toLocaleUpperCase(locale);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.particleField}>
        {particles.map((particle, index) => (
          <ConfettiParticle key={index} particle={particle} />
        ))}
      </View>
      <Animated.View style={[styles.card, cardStyle]}>
        {word.emoji ? (
          <Text style={{ fontSize: 90, textAlign: 'center', lineHeight: 140 }}>{word.emoji}</Text>
        ) : word.swatch ? (
          <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: word.swatch, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }} />
        ) : (
          <Image source={word.image} style={styles.image} contentFit="contain" />
        )}
        <Text style={styles.word}>{wordLabel}</Text>
        <Text style={styles.praise}>{praise}</Text>
        {coinsEarned ? <Text style={styles.coins}>{t('coinEarned', { n: coinsEarned })}</Text> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,47,99,0.35)',
  },
  particleField: {
    position: 'absolute',
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    width: 280,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  image: {
    width: 140,
    height: 140,
  },
  word: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3B2F63',
    letterSpacing: 2,
  },
  praise: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6F59',
  },
  coins: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B98A00',
    marginTop: 2,
  },
});
