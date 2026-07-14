import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

export default function GameHeader() {
  const colors = useColors();
  const { coins } = useGameState();
  const { t } = useI18n();

  return (
    <View style={styles.row}>
      <View style={styles.identity}>
        <View style={[styles.avatar, { backgroundColor: colors.muted }]}>
          <Image source={require('../assets/images/icon.png')} style={styles.avatarImage} />
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>{t('appTitle')}</Text>
      </View>

      <View style={[styles.coinBadge, { backgroundColor: colors.accent }]}>
        <Feather name="star" size={16} color={colors.accentForeground} />
        <Text style={[styles.coinText, { color: colors.accentForeground }]}>
          {coins} {t('coins')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  coinText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
