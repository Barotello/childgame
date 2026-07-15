import React, { useEffect } from 'react';
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
import { Feather } from '@expo/vector-icons';
import { useI18n } from '@/lib/i18n';

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
  const bounceValue = useSharedValue(0);

  // Animal float animations — staggered so they move independently
  const elmaFloat = useFloatAnim(0, 14, 1700);
  const filFloat  = useFloatAnim(400, 10, 2000);
  const inekFloat = useFloatAnim(200, 12, 1900);
  const ariFloat  = useFloatAnim(600, 16, 1600);
  const ariWiggle = useWiggleAnim(600, 1800);

  useEffect(() => {
    bounceValue.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));

  const elmaStyle  = useAnimatedStyle(() => ({ transform: [{ rotate: '-15deg' }, { translateY: elmaFloat.value }] }));
  const filStyle   = useAnimatedStyle(() => ({ transform: [{ rotate: '15deg'  }, { translateY: filFloat.value  }] }));
  const inekStyle  = useAnimatedStyle(() => ({ transform: [{ rotate: '-25deg' }, { translateY: inekFloat.value }] }));
  const ariStyle   = useAnimatedStyle(() => ({ transform: [{ rotate: '20deg'  }, { translateY: ariFloat.value  }, { rotateZ: `${ariWiggle.value * 12}deg` }] }));

  return (
    <LinearGradient
      colors={['#FFD166', '#FF9F1C']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <View style={styles.childImageContainer}>
            <Image
              source={require('../assets/images/child.png')}
              style={styles.childImage}
              contentFit="cover"
            />
          </View>
          <View style={{ marginTop: 12 }}>
            <PlayfulText text="Word" baseSize={52} />
            <PlayfulText text="Builder" baseSize={48} />
          </View>
          <Text style={styles.subtitle}>{t('brandKids')}</Text>
        </Animated.View>

        <View style={styles.decorations} pointerEvents="none">
          <Animated.Image
            source={require('../assets/images/word-elma.png')}
            style={[styles.decorImage, { left: 0, top: 30 }, elmaStyle]}
          />
          <Animated.Image
            source={require('../assets/images/word-fil.png')}
            style={[styles.decorImage, { right: 0, top: 70 }, filStyle]}
          />
          <Animated.Image
            source={require('../assets/images/word-inek.png')}
            style={[styles.decorImage, { left: 0, bottom: 90 }, inekStyle]}
          />
          <Animated.Image
            source={require('../assets/images/word-ari.png')}
            style={[styles.decorImage, { right: 0, bottom: 20 }, ariStyle]}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.playButton, pressed && { transform: [{ scale: 0.95 }] }]}
          onPress={() => router.replace('/(tabs)/game')}
        >
          <LinearGradient colors={['#06D6A0', '#04A77B']} style={styles.playButtonGradient}>
            <View style={styles.jellyHighlight} />
            <Feather name="play" size={32} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.playText}>{t('startGame')}</Text>
          </LinearGradient>
        </Pressable>
      </View>
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
    justifyContent: 'center',
    padding: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 10,
  },
  childImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#FFD166',
  },
  childImage: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#EF476F',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: -10,
    transform: [{ rotate: '-5deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  decorImage: {
    position: 'absolute',
    width: 120,
    height: 120,
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  playButton: {
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#B5F1E2',
    overflow: 'hidden',
  },
  jellyHighlight: {
    position: 'absolute',
    top: 4,
    left: '10%',
    right: '10%',
    height: '30%',
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    borderRadius: 20,
  },
  playText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
