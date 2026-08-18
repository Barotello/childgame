import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { WordItem } from '@/constants/words';
import { useI18n } from '@/lib/i18n';
import { playCelebrateSound } from '@/lib/sounds';
import { speakWord } from '@/lib/speech';
import WordVisual from './WordVisual';

type ChapterCompletionCardProps = {
  words?: WordItem[];
  isCategoryComplete?: boolean;
  onNextChapter?: () => void;
  onBackToChapters: () => void;
  onReplay?: () => void;
};

export default function ChapterCompletionCard({
  words = [],
  isCategoryComplete = false,
  onNextChapter,
  onBackToChapters,
  onReplay,
}: ChapterCompletionCardProps) {
  const { t, locale } = useI18n();

  // Animations
  const starScale1 = useSharedValue(0);
  const starScale2 = useSharedValue(0);
  const starScale3 = useSharedValue(0);
  const pulseButton = useSharedValue(1);
  const paradeBounce = useSharedValue(0);

  const titleText = isCategoryComplete ? t('congrats') : t('chapterCompleteTitle');

  useEffect(() => {
    playCelebrateSound();

    // Stars pop in
    starScale1.value = withDelay(150, withSpring(1, { damping: 6, stiffness: 120 }));
    starScale2.value = withDelay(350, withSpring(1.25, { damping: 5, stiffness: 140 }));
    starScale3.value = withDelay(550, withSpring(1, { damping: 6, stiffness: 120 }));

    // Animals parade bounce
    paradeBounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 550, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 550, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Bouncy next button
    pulseButton.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // Speak cheerful short title
    const timer = setTimeout(() => {
      speakWord(titleText, locale);
    }, 300);

    return () => clearTimeout(timer);
  }, [titleText, locale]);

  const star1Style = useAnimatedStyle(() => ({
    transform: [{ scale: starScale1.value }],
  }));
  const star2Style = useAnimatedStyle(() => ({
    transform: [{ scale: starScale2.value }],
  }));
  const star3Style = useAnimatedStyle(() => ({
    transform: [{ scale: starScale3.value }],
  }));

  const paradeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: paradeBounce.value }],
  }));

  const pulseButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseButton.value }],
  }));

  return (
    <View style={styles.cardContainer}>
      {/* 3 Golden Celebration Stars */}
      <View style={styles.starsRow}>
        <Animated.Text style={[styles.starSide, star1Style]}>⭐</Animated.Text>
        <Animated.Text style={[styles.starCenter, star2Style]}>🌟</Animated.Text>
        <Animated.Text style={[styles.starSide, star3Style]}>⭐</Animated.Text>
      </View>

      {/* Short & Joyful Headline */}
      <Text style={styles.title}>{titleText}</Text>

      {/* Showcase of All Animals in this Chapter */}
      <Animated.View style={[styles.animalsParadeContainer, paradeStyle]}>
        <View style={styles.animalsGrid}>
          {words.slice(0, 5).map((wordItem, idx) => (
            <View key={wordItem.id || idx} style={styles.animalItemWrap}>
              <View style={styles.animalCard}>
                <WordVisual word={wordItem} style={styles.animalImg} emojiSize={44} />
                <View style={styles.checkBadge}>
                  <Feather name="check" size={12} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.animalName} numberOfLines={1}>
                {wordItem.spellings[locale]}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Rewards Row */}
      <View style={styles.rewardsRow}>
        <View style={styles.coinChip}>
          <Text style={styles.coinEmoji}>🪙</Text>
          <Text style={styles.coinText}>+50</Text>
        </View>
        <View style={styles.unlockChip}>
          <Text style={styles.unlockEmoji}>🔓</Text>
          <Text style={styles.unlockText}>{t('newChapterUnlocked')}</Text>
        </View>
      </View>

      {/* Lifted Action Buttons Area */}
      <View style={styles.actionsContainer}>
        {onNextChapter ? (
          <Animated.View style={[styles.primaryBtnWrap, pulseButtonStyle]}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
              onPress={onNextChapter}
              accessibilityRole="button"
              accessibilityLabel={t('nextChapter')}
            >
              <LinearGradient
                colors={['#06D6A0', '#00BFA5', '#048A64']}
                style={styles.btnGradient}
              >
                <View style={styles.btnIconCircle}>
                  <Feather name="play" size={24} color="#048A64" style={{ marginLeft: 2 }} />
                </View>
                <Text style={styles.primaryBtnText}>{t('nextChapter')}</Text>
                <Feather name="chevron-right" size={24} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ) : null}

        {onReplay ? (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
            onPress={onReplay}
            accessibilityRole="button"
            accessibilityLabel={t('playAgain')}
          >
            <LinearGradient
              colors={['#FF9F1C', '#E08520']}
              style={styles.secondaryBtnGradient}
            >
              <Feather name="rotate-ccw" size={20} color="#FFFFFF" />
              <Text style={styles.secondaryBtnText}>{t('playAgain')}</Text>
            </LinearGradient>
          </Pressable>
        ) : null}

        {/* Child-Friendly Adventure Map Button */}
        <Pressable
          style={({ pressed }) => [
            styles.mapBtn,
            pressed && { transform: [{ scale: 0.96 }] },
          ]}
          onPress={onBackToChapters}
          accessibilityRole="button"
          accessibilityLabel={t('chapterMap')}
        >
          <LinearGradient
            colors={['#E8F4FD', '#D6ECFC']}
            style={styles.mapBtnInner}
          >
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.mapBtnText}>{t('chapterMap')}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 2.5,
    borderBottomWidth: 7,
    borderColor: '#EBDDC9',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    height: 40,
  },
  starSide: {
    fontSize: 30,
  },
  starCenter: {
    fontSize: 42,
  },
  title: {
    color: '#0B6E4F',
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: -2,
  },
  animalsParadeContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  animalItemWrap: {
    alignItems: 'center',
    width: 62,
  },
  animalCard: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#F7F4EE',
    borderWidth: 2,
    borderColor: '#E8DCB8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  animalImg: {
    width: 42,
    height: 42,
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#06D6A0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  animalName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6C757D',
    marginTop: 4,
    textAlign: 'center',
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF4D6',
    borderWidth: 1.5,
    borderColor: '#F4C824',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  coinEmoji: {
    fontSize: 16,
  },
  coinText: {
    color: '#8C5300',
    fontSize: 14,
    fontWeight: '900',
  },
  unlockChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8FBF4',
    borderWidth: 1.5,
    borderColor: '#06D6A0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  unlockEmoji: {
    fontSize: 14,
  },
  unlockText: {
    color: '#067A5B',
    fontSize: 12,
    fontWeight: '900',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  primaryBtnWrap: {
    width: '100%',
  },
  primaryBtn: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#06D6A0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
  },
  btnIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  secondaryBtn: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  secondaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 20,
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  mapBtn: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#B0D8FA',
    shadowColor: '#3A86FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 18,
  },
  mapEmoji: {
    fontSize: 20,
  },
  mapBtnText: {
    color: '#1D68C4',
    fontSize: 16,
    fontWeight: '900',
  },
});
