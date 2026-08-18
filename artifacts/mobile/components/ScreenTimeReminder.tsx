import React, { useEffect, useState } from 'react';
import { AppState, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

const BREAK_VIDEO = require('../assets/videos/break_time.mp4');

export default function ScreenTimeReminder() {
  const insets = useSafeAreaInsets();
  const { screenTimeMinutes } = useGameState();
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'video' | 'card'>('video');
  const [cycle, setCycle] = useState(0);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');

  const player = useVideoPlayer(BREAK_VIDEO, (videoPlayer) => {
    videoPlayer.loop = false;
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      setAppActive(state === 'active');
    });
    return () => subscription.remove();
  }, []);

  // Screen time timer (e.g. 60 min or customized by parent)
  useEffect(() => {
    if (!appActive) return;
    setVisible(false);
    setPhase('video');
    const timeout = setTimeout(() => {
      setVisible(true);
      setPhase('video');
    }, Math.max(1, screenTimeMinutes) * 60 * 1000);
    return () => clearTimeout(timeout);
  }, [appActive, cycle, screenTimeMinutes]);

  // Video playback lifecycle
  useEffect(() => {
    if (visible && phase === 'video') {
      try {
        player.replay();
      } catch {
        // Fallback to card if video cannot start
        setPhase('card');
      }
    } else {
      player.pause();
    }
  }, [visible, phase, player]);

  // When video reaches end, transition to the child-friendly break card quietly
  useEffect(() => {
    const subscription = player.addListener('playToEnd', () => {
      setPhase('card');
    });
    return () => subscription.remove();
  }, [player]);

  const handleVideoSkip = () => {
    player.pause();
    setPhase('card');
  };

  const continueAfterBreak = () => {
    setVisible(false);
    setPhase('video');
    setCycle((value) => value + 1);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {phase === 'video' ? (
        <View style={styles.videoRoot}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls={false}
            playsInline
          />
          <Pressable
            onPress={handleVideoSkip}
            style={({ pressed }) => [
              styles.skipButton,
              { top: Math.max(insets.top, 16) + 12 },
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('skip')}
          >
            <Text style={styles.skipText}>{t('skip')}</Text>
            <Feather name="skip-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.backdrop}>
          <View style={styles.card}>
            {/* Playful Glowing Break Mascot Emojis */}
            <View style={styles.emojisHeaderRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.bigSunEmoji}>☀️</Text>
              </View>
            </View>

            {/* Child-Friendly Title */}
            <Text style={styles.title}>{t('breakTimeTitle')}</Text>

            {/* Visual Rest Activities for Kids */}
            <View style={styles.activitiesPillRow}>
              <View style={styles.activityChip}>
                <Text style={styles.chipEmoji}>💧</Text>
                <Text style={styles.chipText}>{t('breakDrinkWater')}</Text>
              </View>
              <View style={styles.activityChip}>
                <Text style={styles.chipEmoji}>👀</Text>
                <Text style={styles.chipText}>{t('breakRestEyes')}</Text>
              </View>
              <View style={styles.activityChip}>
                <Text style={styles.chipEmoji}>🤸</Text>
                <Text style={styles.chipText}>{t('breakStretch')}</Text>
              </View>
            </View>

            <Text style={styles.body}>{t('breakTimeBody')}</Text>

            {/* Big Green Ready Button */}
            <Pressable
              onPress={continueAfterBreak}
              style={({ pressed }) => [styles.continueBtn, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel={t('breakTimeButton')}
            >
              <LinearGradient
                colors={['#06D6A0', '#00BFA5', '#048A64']}
                style={styles.btnGradient}
              >
                <Text style={styles.continueBtnText}>{t('breakTimeButton')}</Text>
                <Feather name="arrow-right" size={24} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  videoRoot: {
    flex: 1,
    backgroundColor: '#0F0C20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: 'rgba(23,17,43,0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(28, 18, 51, 0.78)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    borderWidth: 3,
    borderBottomWidth: 9,
    borderColor: '#FFE0A3',
    paddingHorizontal: 24,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
  emojisHeaderRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4C9',
    borderWidth: 3.5,
    borderColor: '#F8D150',
  },
  bigSunEmoji: {
    fontSize: 52,
  },
  title: {
    color: '#2B2D42',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  activitiesPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 18,
  },
  activityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F8FD',
    borderWidth: 2,
    borderColor: '#CCE4FC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  chipEmoji: {
    fontSize: 22,
  },
  chipText: {
    color: '#1D68C4',
    fontSize: 15,
    fontWeight: '900',
  },
  body: {
    color: '#6C757D',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  continueBtn: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#06D6A0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 28,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
});
