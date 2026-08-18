import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/lib/i18n';

const DEFAULT_VIDEO = require('../assets/videos/intro.mp4');

type InstructionVideoOverlayProps = {
  visible: boolean;
  source?: any;
  onComplete: () => void;
};

export default function InstructionVideoOverlay({
  visible,
  source = DEFAULT_VIDEO,
  onComplete,
}: InstructionVideoOverlayProps) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = false;
  });

  useEffect(() => {
    const subscription = player.addListener('playToEnd', onComplete);
    return () => subscription.remove();
  }, [onComplete, player]);

  useEffect(() => {
    if (visible) {
      player.replay();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [player, visible]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onComplete}>
      <View style={styles.root}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
          playsInline
        />
        <Pressable
          onPress={onComplete}
          style={({ pressed }) => [
            styles.skipButton,
            { top: Math.max(insets.top, 16) + 12 },
            pressed && styles.skipPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('skip')}
        >
          <Text style={styles.skipText}>{t('skip')}</Text>
          <Feather name="skip-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#17112B', justifyContent: 'center' },
  video: { width: '100%', height: '100%' },
  skipButton: {
    position: 'absolute',
    right: 20,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(23,17,43,0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  skipPressed: { opacity: 0.72, transform: [{ scale: 0.96 }] },
  skipText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});

