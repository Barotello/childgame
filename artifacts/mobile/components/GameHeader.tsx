import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { gameTheme } from '@/constants/gameTheme';
import ChildProfileModal from '@/components/ChildProfileModal';

type GameHeaderProps = {
  onBack?: () => void;
};

export default function GameHeader({ onBack }: GameHeaderProps = {}) {
  const colors = useColors();
  const { coins, profile } = useGameState();
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <View style={styles.row}>
        <View style={styles.left}>
          {onBack ? (
            <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8} accessibilityRole="button">
              <Feather name="arrow-left" size={24} color={colors.primary} />
            </Pressable>
          ) : null}

          {/* Child Hero Profile Pill */}
          <Pressable
            onPress={() => setShowProfileModal(true)}
            style={({ pressed }) => [
              styles.profilePill,
              { borderColor: profile.themeColor || '#FF9F1C' },
              pressed && { transform: [{ scale: 0.95 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Profile: ${profile.name || 'Hero'}`}
          >
            <View style={[styles.avatarBadge, { backgroundColor: '#FFF4E8' }]}>
              <Text style={styles.avatarEmoji}>{profile.avatarEmoji || '🦁'}</Text>
            </View>
            <View style={styles.profileTextWrap}>
              <Text style={styles.profileName} numberOfLines={1}>
                {profile.name || 'Hero'}
              </Text>
              <Text style={styles.symbolEmoji}>{profile.symbolEmoji || '⭐'}</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <View style={[styles.coinBadge, { backgroundColor: '#FFD166' }]}>
            <Text style={styles.coinStar}>⭐</Text>
            <Text style={styles.coinText}>{coins}</Text>
          </View>
        </View>
      </View>

      <ChildProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
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
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 2,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: 180,
  },
  avatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  profileTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#3D315B',
    flexShrink: 1,
  },
  symbolEmoji: {
    fontSize: 13,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
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
