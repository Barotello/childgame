import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { gameTheme } from '@/constants/gameTheme';

type GameHeaderProps = {
  onBack?: () => void;
  onParentPress?: () => void;
};

export default function GameHeader({ onBack, onParentPress }: GameHeaderProps = {}) {
  const colors = useColors();
  const { coins } = useGameState();
  const { t } = useI18n();

  return (
    <View style={styles.row}>
      <View style={styles.identity}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8} accessibilityRole="button">
            <Feather name="arrow-left" size={24} color={colors.primary} />
          </Pressable>
        )}
        <Pressable
          onPress={() => router.replace('/(tabs)/journey')}
          style={({ pressed }) => [
            styles.avatar,
            { backgroundColor: colors.muted },
            pressed && styles.avatarPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('backToHome')}
          hitSlop={8}
        >
          <Image source={require('../assets/images/icon.png')} style={styles.avatarImage} />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <View style={[styles.coinBadge, { backgroundColor: colors.accent }]}>
          <Feather name="star" size={16} color={colors.accentForeground} />
          <Text style={[styles.coinText, { color: colors.accentForeground }]}>
            {coins} {t('coins')}
          </Text>
        </View>
        {onParentPress ? (
          <Pressable
            onPress={onParentPress}
            style={styles.parentButton}
            accessibilityRole="button"
            accessibilityLabel={t('parentArea')}
          >
            <Feather name="shield" size={21} color={gameTheme.colors.coral} />
          </Pressable>
        ) : null}
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  avatarPressed: { opacity: 0.78, transform: [{ scale: 0.94 }] },
  backBtn: {
    width: gameTheme.touchTarget,
    height: gameTheme.touchTarget,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    minHeight: gameTheme.touchTarget,
    paddingVertical: 10,
    borderRadius: 999,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parentButton: {
    width: gameTheme.touchTarget,
    height: gameTheme.touchTarget,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2D8D1',
  },
  coinText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
