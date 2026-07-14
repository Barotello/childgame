import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameHeader from '@/components/GameHeader';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { completedLevels } = useGameState();

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 76 }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>{t('learnedWords')}</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {words.map((word, index) => {
          const unlocked = completedLevels.includes(index);
          return (
            <View
              key={word.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.imageWrap, { backgroundColor: colors.muted }]}>
                <Image
                  source={word.image}
                  style={styles.image}
                  contentFit="contain"
                  tintColor={unlocked ? undefined : colors.mutedForeground}
                />
                {!unlocked ? (
                  <View style={styles.lockBadge}>
                    <Feather name="lock" size={14} color={colors.mutedForeground} />
                  </View>
                ) : null}
              </View>
              <Text style={[styles.word, { color: unlocked ? colors.foreground : colors.mutedForeground }]}>
                {unlocked ? word.letters.join('') : t('locked')}
              </Text>
            </View>
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
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 12,
  },
  card: {
    width: '46%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  imageWrap: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  image: {
    width: '80%',
    height: '80%',
  },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 6,
  },
  word: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
