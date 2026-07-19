import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useI18n } from '@/lib/i18n';

const INSTRUCTION_VIDEO = require('../assets/videos/mino-how-to-play.mp4');

type InstructionVideoOverlayProps = {
  visible: boolean;
  onComplete: () => void;
};

export default function InstructionVideoOverlay({ visible, onComplete }: InstructionVideoOverlayProps) {
  const { t } = useI18n();
  const player = useVideoPlayer(INSTRUCTION_VIDEO, (videoPlayer) => {
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
          allowsFullscreen={false}
          playsInline
        />
        <Pressable
          onPress={onComplete}
          style={({ pressed }) => [styles.skipButton, pressed && styles.skipPressed]}
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
    top: 56,
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 23,
    backgroundColor: 'rgba(23,17,43,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  skipPressed: { opacity: 0.72, transform: [{ scale: 0.96 }] },
  skipText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
