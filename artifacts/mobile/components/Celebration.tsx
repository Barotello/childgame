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
import { useGameState } from '@/lib/gameState';
import Feather from '@expo/vector-icons/Feather';
import { gameTheme } from '@/constants/gameTheme';
import { speakTextAndWait } from '@/lib/speech';
const PARTICLE_COLORS = ['#FF6F59', '#3AB0FF', '#FFC93C', '#B57BFF', '#38C6B0', '#FF8FB1'];
const PARTICLE_COUNT = 22;

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
  onNarrationComplete?: () => void;
};

export default function Celebration({ word, coinsEarned, onNarrationComplete }: CelebrationProps) {
  const { locale, t } = useI18n();
  const { profile } = useGameState();
  const praiseList = translations[locale].praise;
  const praise = useMemo(() => {
    const raw = praiseList[Math.floor(Math.random() * praiseList.length)];
    return profile.name ? `${raw} ${profile.name}!` : raw;
  }, [praiseList, profile.name]);
  const particles = useMemo(buildParticles, []);
  const scale = useSharedValue(0.6);
  const wordLabel = word.spellings[locale].toLocaleUpperCase(locale);
  const factKey = {
    animals: 'factAnimals',
    fruits: 'factFruits',
    numbers: 'factNumbers',
    colors: 'factColors',
    flags: 'factFlags',
    body: 'factBody',
  }[word.category] as
    | 'factAnimals'
    | 'factFruits'
    | 'factNumbers'
    | 'factColors'
    | 'factFlags'
    | 'factBody';
  const fact = t(factKey, { word: word.spellings[locale] });

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      speakTextAndWait(fact, locale).then(() => {
        if (active) onNarrationComplete?.();
      });
    }, 450);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fact, locale, onNarrationComplete]);

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
        <View style={styles.successBadge}>
          <Text style={{ fontSize: 24 }}>{profile.avatarEmoji || '⭐'}</Text>
        </View>
        {word.image ? (
          <Image source={word.image} style={styles.image} contentFit="contain" />
        ) : word.category === 'flags' || word.id.startsWith('flag_') ? (
          <View style={styles.celebrationFlagContainer}>
            <View style={styles.celebrationFlagInnerCard}>
              <Image
                source={{ uri: `https://flagcdn.com/w320/${word.id.replace('flag_', '').toLowerCase()}.png` }}
                style={styles.celebrationFlagImage}
                contentFit="contain"
              />
            </View>
          </View>
        ) : word.swatch ? (
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: word.swatch,
              borderWidth: 6,
              borderColor: word.swatch === '#FFFFFF' ? '#D8CFE6' : '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.22,
              shadowRadius: 10,
              elevation: 6,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 14,
                left: 20,
                width: 50,
                height: 30,
                borderRadius: 99,
                backgroundColor: 'rgba(255, 255, 255, 0.45)',
                transform: [{ rotate: '-25deg' }],
              }}
            />
          </View>
        ) : (
          <Text style={{ fontSize: 90, textAlign: 'center', lineHeight: 140 }}>{word.emoji}</Text>
        )}
        <Text style={styles.word}>{wordLabel}</Text>
        <Text style={styles.praise}>{praise}</Text>
        <View style={styles.factPill}>
          <Feather name="volume-2" size={16} color={gameTheme.colors.sky} />
          <Text style={styles.fact}>{fact}</Text>
        </View>
        {coinsEarned ? (
          <View style={styles.coinBadge}>
            <Text style={styles.coinIcon}>⭐</Text>
            <Text style={styles.coins}>{t('coinEarned', { n: coinsEarned })}</Text>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(61,49,91,0.42)',
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
    borderRadius: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    width: 300,
    minHeight: 370,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
    gap: 8,
    borderWidth: 5,
    borderColor: '#FFF1C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 22,
    elevation: 10,
  },
  image: {
    width: 140,
    height: 140,
  },
  word: {
    fontSize: 30,
    fontWeight: '900',
    color: gameTheme.colors.ink,
    letterSpacing: 2,
  },
  praise: {
    fontSize: 21,
    fontWeight: '900',
    color: gameTheme.colors.coral,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7D6',
    borderWidth: 2,
    borderColor: '#FFE58F',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    marginTop: 4,
  },
  coinIcon: {
    fontSize: 18,
  },
  coins: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8C6800',
  },
  factPill: {
    maxWidth: '96%',
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: gameTheme.colors.skySoft,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fact: {
    flexShrink: 1,
    color: gameTheme.colors.ink,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  successBadge: {
    position: 'absolute',
    top: -26,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: gameTheme.colors.mint,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F8A55',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 8,
  },
  celebrationFlagContainer: {
    width: 184,
    height: 124,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#E2D9CD',
    backgroundColor: '#F6EFE6',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationFlagInnerCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D8CDC0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationFlagImage: {
    width: '100%',
    height: '100%',
  },
});
