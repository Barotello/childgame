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
import Feather from '@expo/vector-icons/Feather';
import { useI18n } from '@/lib/i18n';
import { speakWord } from '@/lib/speech';

const { width: SCREEN_W } = Dimensions.get('window');

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
        withTiming(-90, { duration: 700, easing: Easing.inOut(Easing.ease) }),
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
  container: { alignItems: 'center', marginVertical: 12 },
  slotRow: { flexDirection: 'row', gap: 12, marginBottom: 50 },
  slot: {
    width: 56,
    height: 56,
    borderRadius: 14,
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
  slotLetter: { fontSize: 26, fontWeight: '900', color: '#fff' },
  slotPlaceholder: { fontSize: 22, fontWeight: '700', color: '#FFD166' },
  letterRow: { alignItems: 'center' },
  letterTile: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#EF476F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  letterText: { fontSize: 28, fontWeight: '900', color: '#fff' },
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
        const dist = 55 + i * 8;
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
  wrap: { alignItems: 'center', justifyContent: 'center', height: 140, marginVertical: 8 },
  trophy: { fontSize: 64 },
  coin: { position: 'absolute', fontSize: 24 },
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
  const { t, locale } = useI18n();
  const [step, setStep] = useState(0);
  const slideX = useSharedValue(0);

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
      <LinearGradient colors={current.bg} style={styles.root}>
        {/* Skip */}
        <Pressable style={styles.skipBtn} onPress={onDone} hitSlop={12}>
          <Text style={styles.skipText}>{t('onboardingSkip')}</Text>
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
              <Text style={styles.minoLabel}>{t('minoSays')}</Text>
              <Text style={styles.title}>{t(current.titleKey)}</Text>
              <Text style={styles.body}>{t(current.bodyKey)}</Text>
              <Pressable
                onPress={() => speakWord(narration, locale)}
                style={({ pressed }) => [styles.listenButton, pressed && styles.listenPressed]}
                accessibilityRole="button"
                accessibilityLabel={t('listenToMino')}
              >
                <Feather name="volume-2" size={16} color="#118AB2" />
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

        {/* Next / Start button */}
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
          onPress={goNext}
        >
          <View style={styles.btnInner}>
            <Text style={styles.btnText}>
              {isLast ? t('onboardingStart') : t('onboardingNext')}
            </Text>
          </View>
        </Pressable>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  skipBtn: { position: 'absolute', top: 56, right: 24 },
  skipText: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '600' },
  content: { alignItems: 'center', width: '100%', marginBottom: 24 },
  narratorRow: { width: '100%', alignItems: 'center', gap: 8 },
  mascotButton: {
    width: 224,
    height: 300,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotPressed: { transform: [{ scale: 0.97 }] },
  mascot: { width: 208, height: 284 },
  speakerBadge: {
    position: 'absolute',
    right: -4,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: { color: '#118AB2', fontSize: 18, fontWeight: '900' },
  speechCard: {
    width: '100%',
    minHeight: 154,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    justifyContent: 'center',
  },
  speechTail: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  minoLabel: { color: '#D86B3F', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  demoWrap: {
    marginTop: 10,
    borderRadius: 24,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  title: {
    fontSize: 21,
    fontWeight: '900',
    color: '#3D315B',
    marginTop: 3,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    fontWeight: '600',
    color: '#756A8D',
    lineHeight: 20,
  },
  listenButton: {
    minHeight: 34,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 17,
    backgroundColor: '#E8F6FF',
    paddingHorizontal: 11,
    marginTop: 10,
  },
  listenPressed: { transform: [{ scale: 0.97 }] },
  listenText: { color: '#118AB2', fontSize: 11, fontWeight: '900' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 36 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotActive: { backgroundColor: '#fff', width: 28 },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.4)' },
  btn: {
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  btnInner: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { fontSize: 20, fontWeight: '900', color: '#fff' },
});
