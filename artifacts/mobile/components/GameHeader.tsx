import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { gameTheme } from '@/constants/gameTheme';

type GameHeaderProps = {
  onBack?: () => void;
};

export default function GameHeader({ onBack }: GameHeaderProps = {}) {
  const colors = useColors();
  const { coins } = useGameState();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8} accessibilityRole="button">
            <Feather name="arrow-left" size={24} color={colors.primary} />
          </Pressable>
        ) : <View style={styles.placeholder} />}
      </View>

      <View style={styles.actions}>
        <View style={[styles.coinBadge, { backgroundColor: '#FFD166' }]}>
          <Text style={styles.coinStar}>⭐</Text>
          <Text style={styles.coinText}>{coins}</Text>
        </View>
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
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  backBtn: {
    width: gameTheme.touchTarget,
    height: gameTheme.touchTarget,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EFE3D3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EAA812',
  },
  coinStar: {
    fontSize: 14,
  },
  coinText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8C5300',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
