import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameHeader from '@/components/GameHeader';
import { LOCALE_FLAGS, LOCALE_LABELS } from '@/constants/translations';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { muted, toggleMute } = useGameState();
  const { t, locale, setLocale, availableLocales } = useI18n();

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>{t('settings')}</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="globe" size={22} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t('language')}</Text>
          </View>
          <Text style={[styles.cardHint, { color: colors.mutedForeground }]}>{t('chooseLanguage')}</Text>

          {availableLocales.map((lang) => {
            const selected = lang === locale;
            return (
              <Pressable
                key={lang}
                onPress={() => setLocale(lang)}
                style={[
                  styles.langRow,
                  { borderColor: colors.border },
                  selected && { backgroundColor: '#E4FBEE', borderColor: colors.success },
                ]}
              >
                <View style={styles.langLeft}>
                  <View style={[styles.flagBadge, selected && { borderColor: colors.success }]}>
                    <Text style={styles.flagEmoji}>{LOCALE_FLAGS[lang]}</Text>
                  </View>
                  <Text style={[styles.langLabel, { color: colors.foreground }]}>
                    {LOCALE_LABELS[lang]}
                  </Text>
                </View>
                {selected ? <Feather name="check-circle" size={18} color={colors.success} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="volume-2" size={22} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{t('soundEffects')}</Text>
          </View>
          <View style={styles.soundRow}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {muted ? t('soundOff') : t('soundOn')}
            </Text>
            <Switch
              value={!muted}
              onValueChange={toggleMute}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardHint: {
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  flagEmoji: {
    fontSize: 24,
  },
  langLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
