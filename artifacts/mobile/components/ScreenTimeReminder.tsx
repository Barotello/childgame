import React, { useEffect, useState } from 'react';
import { AppState, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { gameTheme } from '@/constants/gameTheme';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

export default function ScreenTimeReminder() {
  const { screenTimeMinutes } = useGameState();
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      setAppActive(state === 'active');
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!appActive) return;
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), screenTimeMinutes * 60 * 1000);
    return () => clearTimeout(timeout);
  }, [appActive, cycle, screenTimeMinutes]);

  const continueAfterBreak = () => {
    setVisible(false);
    setCycle((value) => value + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.icon}><Feather name="sun" size={36} color="#A67500" /></View>
          <Text style={styles.title}>{t('breakTimeTitle')}</Text>
          <Text style={styles.body}>{t('breakTimeBody')}</Text>
          <Pressable
            onPress={continueAfterBreak}
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel={t('breakTimeButton')}
          >
            <Text style={styles.buttonText}>{t('breakTimeButton')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(61,49,91,0.48)' },
  card: { width: '100%', maxWidth: 350, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 30, padding: 26 },
  icon: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF4C9', marginBottom: 13 },
  title: { color: gameTheme.colors.ink, fontSize: 23, fontWeight: '900' },
  body: { color: gameTheme.colors.inkSoft, fontSize: 14, lineHeight: 21, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  button: { minHeight: 52, minWidth: 180, alignItems: 'center', justifyContent: 'center', borderRadius: 999, backgroundColor: gameTheme.colors.mint, marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
