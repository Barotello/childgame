import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useI18n } from '@/lib/i18n';
import { useGameState } from '@/lib/gameState';
import OnboardingOverlay from '@/components/OnboardingOverlay';
import InstructionVideoOverlay from '@/components/InstructionVideoOverlay';
import ChildProfileModal from '@/components/ChildProfileModal';

const ONBOARDING_KEY = 'kelime-bulmaca:onboarding-seen:v2';

function useFloatAnim(delay = 0, amplitude = 12, duration = 1800) {
  const val = useSharedValue(0);
  useEffect(() => {
    val.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-amplitude, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, []);
  return val;
}

function useWiggleAnim(delay = 0, duration = 2200) {
  const val = useSharedValue(0);
  useEffect(() => {
    val.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
          withTiming(-1, { duration: duration * 0.5, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: duration * 0.25, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, []);
  return val;
}

const PlayfulText = ({ text, baseSize = 48 }: { text: string; baseSize?: number }) => {
  const colors = ['#EF476F', '#118AB2', '#FFD166', '#06D6A0', '#00B4D8', '#B57BFF'];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {text.split('').map((char, i) => {
        if (char === ' ') return <View key={i} style={{ width: baseSize * 0.3 }} />;
        const color = colors[i % colors.length];
        const rotate = (i % 2 === 0 ? 1 : -1) * (8 + (i % 3) * 4) + 'deg';
        const translateY = i % 2 === 0 ? -3 : 3;
        return (
          <Text
            key={i}
            style={{
              fontSize: baseSize,
              fontWeight: '900',
              color,
              transform: [{ rotate }, { translateY }],
              textShadowColor: 'rgba(0,0,0,0.15)',
              textShadowOffset: { width: 0, height: 3 },
              textShadowRadius: 4,
            }}
          >
            {char}
          </Text>
        );
      })}
    </View>
  );
};

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { profile } = useGameState();
  const bounceValue = useSharedValue(0);
  const playPulse = useSharedValue(1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Check if onboarding has been seen — show only on first launch
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((val) => {
        if (!val) setShowOnboarding(true);
      })
      .catch(() => {
        setShowOnboarding(true);
      });
  }, []);

  const finishOnboarding = () => {
    AsyncStorage.setItem(ONBOARDING_KEY, '1').catch(() => {});
    setShowOnboarding(false);
    if (!profile.isCreated) {
      setShowProfileModal(true);
    }
  };

  const handleStartPress = () => {
    if (!profile.isCreated) {
      setShowProfileModal(true);
      return;
    }
    setShowIntroVideo(true);
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
  };

  const handleVideoComplete = () => {
    setShowIntroVideo(false);
    router.replace('/(tabs)/journey');
  };

  // Animal float animations — staggered so they move independently
  const elmaFloat = useFloatAnim(0, 10, 1900);
  const filFloat = useFloatAnim(400, 8, 2200);
  const inekFloat = useFloatAnim(200, 10, 2000);
  const ariFloat = useFloatAnim(600, 12, 1700);
  const ariWiggle = useWiggleAnim(600, 1800);

  useEffect(() => {
    bounceValue.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    playPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));

  const playAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playPulse.value }],
  }));

  const elmaStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '-12deg' }, { translateY: elmaFloat.value }],
  }));
  const filStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '12deg' }, { translateY: filFloat.value }],
  }));
  const inekStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '-16deg' }, { translateY: inekFloat.value }],
  }));
  const ariStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: '15deg' },
      { translateY: ariFloat.value },
      { rotateZ: `${ariWiggle.value * 10}deg` },
    ],
  }));

  return (
    <LinearGradient
      colors={['#FFD166', '#FF9F1C']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}
    >
      {/* Floating animal stickers with transparent background positioned away from buttons */}
      <View style={styles.decorations} pointerEvents="none">
        <Animated.Image
          source={require('../assets/images/apple.png')}
          style={[styles.decorImage, styles.decorTopLeft, elmaStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../assets/images/elephant.png')}
          style={[styles.decorImage, styles.decorTopRight, filStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../assets/images/cow.png')}
          style={[styles.decorImage, styles.decorMidLeft, inekStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require('../assets/images/bee.png')}
          style={[styles.decorImage, styles.decorMidRight, ariStyle]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        {/* Mino Avatar and Game Title */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <View style={styles.childImageContainer}>
            <Image
              source={require('../assets/images/mino.png')}
              style={styles.childImage}
              contentFit="contain"
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <PlayfulText text="Mino" baseSize={46} />
            <PlayfulText text="Words" baseSize={40} />
          </View>
          <Text style={styles.subtitle}>{t('brandKids')}</Text>

          {/* Child Profile Preview & Switch Tag */}
          <Pressable
            onPress={() => setShowProfileModal(true)}
            style={({ pressed }) => [
              styles.heroProfileCard,
              { borderColor: profile.themeColor || '#FF9F1C' },
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Hero profile"
          >
            <View style={styles.heroAvatarBadge}>
              <Text style={styles.heroAvatarEmoji}>{profile.avatarEmoji || '🦁'}</Text>
            </View>
            <View style={styles.heroCardText}>
              <Text style={styles.heroCardGreeting}>
                {profile.isCreated ? `Hero: ${profile.name}` : 'Tap to choose your Hero!'}
              </Text>
              <Text style={styles.heroCardSymbol}>{profile.symbolEmoji || '⭐'}</Text>
            </View>
            <View style={styles.heroEditPill}>
              <Feather name="edit-2" size={12} color="#8C5300" />
            </View>
          </Pressable>
        </Animated.View>

        {/* High-visibility child-friendly Start Playing button */}
        <Animated.View style={[styles.playButtonWrapper, playAnimatedStyle]}>
          <Pressable
            style={({ pressed }) => [
              styles.playButton,
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
            onPress={handleStartPress}
            accessibilityRole="button"
            accessibilityLabel={t('startGame')}
          >
            <LinearGradient
              colors={['#06D6A0', '#00BFA5', '#048A64']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.playButtonGradient}
            >
              <View style={styles.jellyHighlight} />
              <View style={styles.playIconContainer}>
                <Feather name="play" size={28} color="#048A64" style={{ marginLeft: 3 }} />
              </View>
              <Text style={styles.playText}>{t('startGame')}</Text>
              <Feather name="chevron-right" size={26} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>

      <OnboardingOverlay visible={showOnboarding} onDone={finishOnboarding} />

      <ChildProfileModal
        visible={showProfileModal}
        onClose={handleProfileModalClose}
      />

      <InstructionVideoOverlay
        visible={showIntroVideo}
        onComplete={handleVideoComplete}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  childImageContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#FFF5E0',
    overflow: 'hidden',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#FFE8A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childImage: {
    width: '90%',
    height: '90%',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    backgroundColor: '#EF476F',
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: -8,
    transform: [{ rotate: '-4deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  heroProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFEE',
    borderRadius: 26,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2.5,
    marginTop: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  heroAvatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarEmoji: {
    fontSize: 22,
  },
  heroCardText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroCardGreeting: {
    fontSize: 14,
    fontWeight: '900',
    color: '#3D315B',
  },
  heroCardSymbol: {
    fontSize: 14,
  },
  heroEditPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFE8A3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  decorImage: {
    position: 'absolute',
    width: 90,
    height: 90,
    opacity: 0.95,
  },
  decorTopLeft: {
    left: 12,
    top: 50,
  },
  decorTopRight: {
    right: 12,
    top: 75,
  },
  decorMidLeft: {
    left: 8,
    top: '42%',
  },
  decorMidRight: {
    right: 8,
    top: '46%',
  },
  playButtonWrapper: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 8,
    zIndex: 20,
  },
  playButton: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#C7F9EC',
    overflow: 'hidden',
  },
  playIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  jellyHighlight: {
    position: 'absolute',
    top: 3,
    left: '12%',
    right: '12%',
    height: '35%',
    backgroundColor: '#FFFFFF',
    opacity: 0.35,
    borderRadius: 20,
  },
  playText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
