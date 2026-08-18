import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useI18n } from '@/lib/i18n';
import { speakWord } from '@/lib/speech';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Animated drag demo shown on step 2 ──────────────────────────────────────
function DragDemo() {
  const letterX = useSharedValue(0);
  const letterY = useSharedValue(0);
  const slotScale = useSharedValue(1);
  const letterScale = useSharedValue(1);

  useEffect(() => {
    const loop = () => {
      // Reset
      letterX.value = 0;
      letterY.value = 0;
      slotScale.value = 1;
      letterScale.value = 1;

      // Pick up letter
      letterScale.value = withDelay(400, withTiming(1.2, { duration: 200 }));
      // Move to slot
      letterX.value = withDelay(
        600,
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      );
      letterY.value = withDelay(
        600,
        withTiming(-75, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      );
      // Land in slot
      letterScale.value = withDelay(1300, withSpring(1, { damping: 8, stiffness: 120 }));
      slotScale.value = withDelay(1300, withSequence(
        withTiming(1.25, { duration: 150 }),
        withSpring(1, { damping: 6, stiffness: 200 }),
      ));
    };

    loop();
    const interval = setInterval(loop, 2400);
    return () => clearInterval(interval);
  }, []);

  const letterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: letterX.value },
      { translateY: letterY.value },
      { scale: letterScale.value },
    ],
  }));
  const slotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: slotScale.value }],
  }));

  return (
    <View style={demoStyles.container}>
      {/* Slot row */}
      <View style={demoStyles.slotRow}>
        {['A', '_', 'I'].map((ch, i) =>
          ch === '_' ? (
            <Animated.View key={i} style={[demoStyles.slot, demoStyles.slotEmpty, slotStyle]}>
              <Text style={demoStyles.slotPlaceholder}>?</Text>
            </Animated.View>
          ) : (
            <View key={i} style={[demoStyles.slot, demoStyles.slotFilled]}>
              <Text style={demoStyles.slotLetter}>{ch}</Text>
            </View>
          ),
        )}
      </View>

      {/* Draggable letter */}
      <View style={demoStyles.letterRow}>
        <Animated.View style={[demoStyles.letterTile, letterStyle]}>
          <Text style={demoStyles.letterText}>R</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const demoStyles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  slotRow: { flexDirection: 'row', gap: 10, marginBottom: 36 },
  slot: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: { backgroundColor: '#06D6A0' },
  slotEmpty: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#FFD166',
    borderStyle: 'dashed',
  },
  slotLetter: { fontSize: 22, fontWeight: '900', color: '#fff' },
  slotPlaceholder: { fontSize: 18, fontWeight: '700', color: '#FFD166' },
  letterRow: { alignItems: 'center' },
  letterTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EF476F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  letterText: { fontSize: 24, fontWeight: '900', color: '#fff' },
});

// ─── Coin burst shown on step 3 ───────────────────────────────────────────────
function CoinBurst() {
  const coins = [0, 1, 2, 3, 4, 5];
  const vals = coins.map(() => ({
    y: useSharedValue(0),
    x: useSharedValue(0),
    op: useSharedValue(0),
  }));

  useEffect(() => {
    const angles = [270, 310, 340, 20, 50, 90];
    const loop = () => {
      vals.forEach((v, i) => {
        v.y.value = 0;
        v.x.value = 0;
        v.op.value = 0;
        const rad = (angles[i] * Math.PI) / 180;
        const dist = 50 + i * 7;
        v.op.value = withDelay(i * 60, withTiming(1, { duration: 150 }));
        v.x.value = withDelay(i * 60, withTiming(Math.cos(rad) * dist, { duration: 600, easing: Easing.out(Easing.quad) }));
        v.y.value = withDelay(i * 60, withTiming(Math.sin(rad) * dist, { duration: 600, easing: Easing.out(Easing.quad) }));
        v.op.value = withDelay(i * 60 + 500, withTiming(0, { duration: 300 }));
      });
    };
    loop();
    const t = setInterval(loop, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={burstStyles.wrap}>
      <Text style={burstStyles.trophy}>🏆</Text>
      {vals.map((v, i) => {
        const s = useAnimatedStyle(() => ({
          opacity: v.op.value,
          transform: [{ translateX: v.x.value }, { translateY: v.y.value }],
        }));
        return (
          <Animated.Text key={i} style={[burstStyles.coin, s]}>
            🪙
          </Animated.Text>
        );
      })}
    </View>
  );
}

const burstStyles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', height: 110, marginVertical: 4 },
  trophy: { fontSize: 52 },
  coin: { position: 'absolute', fontSize: 20 },
});

// ─── Step content definitions ─────────────────────────────────────────────────
type StepKey = 'onboarding1Title' | 'onboarding2Title' | 'onboarding3Title';
type StepBodyKey = 'onboarding1Body' | 'onboarding2Body' | 'onboarding3Body';

const STEPS: Array<{
  emoji?: string;
  titleKey: StepKey;
  bodyKey: StepBodyKey;
  bg: readonly [string, string];
  custom?: React.ReactNode;
}> = [
  {
    emoji: '👋',
    titleKey: 'onboarding1Title',
    bodyKey: 'onboarding1Body',
    bg: ['#FFD166', '#FF9F1C'] as const,
  },
  {
    titleKey: 'onboarding2Title',
    bodyKey: 'onboarding2Body',
    bg: ['#3AB0FF', '#118AB2'] as const,
    custom: <DragDemo />,
  },
  {
    titleKey: 'onboarding3Title',
    bodyKey: 'onboarding3Body',
    bg: ['#06D6A0', '#04A77B'] as const,
    custom: <CoinBurst />,
  },
];

// ─── Main overlay ─────────────────────────────────────────────────────────────
type Props = {
  visible: boolean;
  onDone: () => void;
};

export default function OnboardingOverlay({ visible, onDone }: Props) {
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();
  const [step, setStep] = useState(0);
  const slideX = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const goNext = () => {
    if (step < STEPS.length - 1) {
      const nextStep = STEPS[step + 1];
      speakWord(`${t(nextStep.titleKey)}. ${t(nextStep.bodyKey)}`, locale);
      // Slide out left, advance, slide in from right
      slideX.value = withSequence(
        withTiming(-SCREEN_W, { duration: 220, easing: Easing.in(Easing.ease) }),
        withTiming(SCREEN_W, { duration: 0 }),
        withTiming(0, { duration: 220, easing: Easing.out(Easing.ease) }),
      );
      setTimeout(() => setStep((s) => s + 1), 220);
    } else {
      onDone();
    }
  };

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const narration = `${t(current.titleKey)}. ${t(current.bodyKey)}`;

  useEffect(() => {
    if (!visible || step !== 0) return;
    const timer = setTimeout(() => speakWord(narration, locale), 350);
    return () => clearTimeout(timer);
  }, [visible, step, locale, narration]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <LinearGradient
        colors={current.bg}
        style={[
          styles.root,
          {
            paddingTop: insets.top + 16,
            paddingBottom: Math.max(insets.bottom, 20) + 8,
          },
        ]}
      >
        {/* Skip Button - positioned safely below status bar / Dynamic Island */}
        <Pressable
          style={[styles.skipBtn, { top: insets.top + 8 }]}
          onPress={onDone}
          hitSlop={12}
        >
          <Text style={styles.skipText}>{t('onboardingSkip')}</Text>
          <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.9)" />
        </Pressable>

        {/* Content */}
        <Animated.View style={[styles.content, slideStyle]}>
          <View style={styles.narratorRow}>
            <Pressable
              onPress={() => speakWord(narration, locale)}
              accessibilityRole="button"
              accessibilityLabel={narration}
              style={({ pressed }) => [styles.mascotButton, pressed && styles.mascotPressed]}
            >
              <Image
                source={require('../assets/images/mino.png')}
                style={styles.mascot}
                contentFit="contain"
              />
              <View style={styles.speakerBadge}>
                <Text style={styles.speakerIcon}>♪</Text>
              </View>
            </Pressable>

            <View style={styles.speechCard}>
              <View style={styles.speechTail} />
              <View style={styles.minoHeader}>
                <Text style={styles.minoLabel}>{t('minoSays')}</Text>
                <Text style={styles.stepBadge}>{step + 1}/{STEPS.length}</Text>
              </View>
              <Text style={styles.title}>{t(current.titleKey)}</Text>
              <Text style={styles.body}>{t(current.bodyKey)}</Text>
              <Pressable
                onPress={() => speakWord(narration, locale)}
                style={({ pressed }) => [styles.listenButton, pressed && styles.listenPressed]}
                accessibilityRole="button"
                accessibilityLabel={t('listenToMino')}
              >
                <Feather name="volume-2" size={15} color="#118AB2" />
                <Text style={styles.listenText}>{t('listenToMino')}</Text>
              </Pressable>
            </View>
          </View>

          {current.custom ? <View style={styles.demoWrap}>{current.custom}</View> : null}
        </Animated.View>

        {/* Dots */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        {/* Next / Start button for kids */}
        <Animated.View style={[styles.btnWrap, pulseStyle]}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
            ]}
            onPress={goNext}
          >
            <LinearGradient
              colors={isLast ? ['#06D6A0', '#04A77B'] : ['#FFFFFF', '#F0F9FF']}
              style={styles.btnGradient}
            >
              <View style={styles.btnIconCircle}>
                <Feather
                  name={isLast ? 'play' : 'arrow-right'}
                  size={24}
                  color={isLast ? '#06D6A0' : '#118AB2'}
                />
              </View>
              <Text
                style={[
                  styles.btnText,
                  { color: isLast ? '#FFFFFF' : '#118AB2' },
                ]}
              >
                {isLast ? t('onboardingStart') : t('onboardingNext')}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  skipBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  narratorRow: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  mascotButton: {
    width: 175,
    height: 220,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  mascotPressed: { transform: [{ scale: 0.96 }] },
  mascot: { width: 160, height: 200 },
  speakerBadge: {
    position: 'absolute',
    right: -4,
    bottom: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  speakerIcon: { color: '#118AB2', fontSize: 18, fontWeight: '900' },
  speechCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  speechTail: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  minoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  minoLabel: { color: '#D86B3F', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  stepBadge: {
    color: '#8A817C',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#F4F1EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  demoWrap: {
    marginTop: 10,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#3D315B',
    marginTop: 2,
    marginBottom: 4,
  },
  body: {
    fontSize: 13,
    fontWeight: '600',
    color: '#756A8D',
    lineHeight: 18,
  },
  listenButton: {
    minHeight: 32,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    backgroundColor: '#E8F6FF',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  listenPressed: { transform: [{ scale: 0.96 }] },
  listenText: { color: '#118AB2', fontSize: 11, fontWeight: '900' },
  dots: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotActive: { backgroundColor: '#fff', width: 26 },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.45)' },
  btnWrap: {
    width: '100%',
    maxWidth: 320,
  },
  btn: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  btnIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  btnText: { fontSize: 20, fontWeight: '900' },
});

