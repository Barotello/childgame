import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameHeader from '@/components/GameHeader';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { highestUnlocked, completedLevels, currentLevel, setCurrentLevel } = useGameState();

  const handlePress = (index: number, locked: boolean) => {
    if (locked) return;
    setCurrentLevel(index);
    router.push('/');
  };

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>Seviye Haritası</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {words.map((word, index) => {
          const locked = index > highestUnlocked;
          const completed = completedLevels.includes(index);
          const isCurrent = index === currentLevel;

          const bg = completed ? colors.success : locked ? colors.muted : colors.primary;
          const textColor = locked ? colors.mutedForeground : '#FFFFFF';

          return (
            <Pressable
              key={word.id}
              onPress={() => handlePress(index, locked)}
              style={[
                styles.node,
                { backgroundColor: bg, borderColor: isCurrent ? colors.accent : 'transparent' },
              ]}
            >
              {locked ? (
                <Feather name="lock" size={20} color={textColor} />
              ) : completed ? (
                <Feather name="check" size={22} color={textColor} />
              ) : (
                <Text style={[styles.nodeLabel, { color: textColor }]}>{index + 1}</Text>
              )}
            </Pressable>
          );
        })}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  node: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  nodeLabel: {
    fontSize: 20,
    fontWeight: '800',
  },
});
