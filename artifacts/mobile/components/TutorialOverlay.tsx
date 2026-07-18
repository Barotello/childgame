import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useI18n } from '@/lib/i18n';
import { speakWord } from '@/lib/speech';

type TutorialOverlayProps = {
  visible: boolean;
  onDismiss: (dontShowAgain: boolean) => void;
};

export default function TutorialOverlay({ visible, onDismiss }: TutorialOverlayProps) {
  const { t, locale } = useI18n();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const narration = `${t('tutorialTitle')}. ${t('tutorialBody')}`;

  useEffect(() => {
    if (!visible) return;
    setDontShowAgain(false);
    const timer = setTimeout(() => speakWord(narration, locale), 300);
    return () => clearTimeout(timer);
  }, [visible, locale, narration]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => onDismiss(false)}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable
            onPress={() => speakWord(narration, locale)}
            style={({ pressed }) => [styles.mascotWrap, pressed && styles.mascotPressed]}
            accessibilityRole="button"
            accessibilityLabel={narration}
          >
            <Image source={require('../assets/images/mino.png')} style={styles.mascot} contentFit="contain" />
            <View style={styles.soundBadge}>
              <Feather name="volume-2" size={18} color="#FFFFFF" />
            </View>
          </Pressable>
          <View style={styles.minoRow}>
            <Text style={styles.minoLabel}>{t('minoSays')}</Text>
            <Feather name="move" size={16} color="#3AB0FF" />
          </View>
          <Text style={styles.title}>{t('tutorialTitle')}</Text>
          <Text style={styles.body}>{t('tutorialBody')}</Text>
          <Pressable
            onPress={() => speakWord(narration, locale)}
            style={({ pressed }) => [styles.listenButton, pressed && styles.listenPressed]}
            accessibilityRole="button"
            accessibilityLabel={t('listenToMino')}
          >
            <Feather name="volume-2" size={18} color="#118AB2" />
            <Text style={styles.listenText}>{t('listenToMino')}</Text>
          </Pressable>
          <Pressable
            onPress={() => setDontShowAgain((current) => !current)}
            style={({ pressed }) => [styles.rememberRow, pressed && styles.rememberPressed]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: dontShowAgain }}
            accessibilityLabel={t('tutorialDontShowAgain')}
          >
            <View style={[styles.checkbox, dontShowAgain && styles.checkboxChecked]}>
              {dontShowAgain ? <Feather name="check" size={16} color="#FFFFFF" /> : null}
            </View>
            <Text style={styles.rememberText}>{t('tutorialDontShowAgain')}</Text>
          </Pressable>
          <Pressable
            onPress={() => onDismiss(dontShowAgain)}
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          >
            <Text style={styles.buttonText}>{t('tutorialGotIt')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(59,47,99,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  mascotWrap: {
    width: 132,
    height: 158,
    borderRadius: 32,
    backgroundColor: '#FFF4DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -94,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#FFD166',
  },
  mascotPressed: { transform: [{ scale: 0.97 }] },
  mascot: { width: 120, height: 150 },
  soundBadge: {
    position: 'absolute',
    right: -8,
    bottom: 8,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3AB0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  minoLabel: { color: '#D86B3F', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3B2F63',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5C5470',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  listenButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 21,
    backgroundColor: '#E8F6FF',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listenPressed: { transform: [{ scale: 0.97 }] },
  listenText: { color: '#118AB2', fontSize: 13, fontWeight: '900' },
  rememberRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  rememberPressed: { opacity: 0.72 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#B8ADC8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { borderColor: '#06A77D', backgroundColor: '#06A77D' },
  rememberText: { color: '#5C5470', fontSize: 14, fontWeight: '800' },
  button: {
    backgroundColor: '#06D6A0',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
