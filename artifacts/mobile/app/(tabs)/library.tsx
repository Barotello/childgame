import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameHeader from '@/components/GameHeader';
import categories, { type CategoryId } from '@/constants/library';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();
  const { completedLevels, selectedCategory, setSelectedCategory } = useGameState();

  const wordIndexById = useMemo(() => {
    const map = new Map<string, number>();
    words.forEach((word, index) => map.set(word.id, index));
    return map;
  }, []);

  const category = categories.find((c) => c.id === selectedCategory) ?? categories[0];

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 76 }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>{t('learnedWords')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        {categories.map((cat) => {
          const selected = cat.id === selectedCategory;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.chip,
                { backgroundColor: colors.card, borderColor: colors.border },
                selected && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <Feather name={cat.icon as any} size={15} color={selected ? '#FFFFFF' : colors.secondary} />
              <Text style={[styles.chipLabel, { color: selected ? '#FFFFFF' : colors.foreground }]}>
                {t(cat.titleKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.grid}>
        {category.items.map((item) => {
          const gameIndex = item.wordId ? wordIndexById.get(item.wordId) : undefined;
          const gated = gameIndex !== undefined;
          const unlocked = !gated || completedLevels.includes(gameIndex as number);
          const label = item.names[locale];

          return (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.imageWrap, { backgroundColor: colors.muted }]}>
                {item.image ? (
                  <Image
                    source={item.image}
                    style={styles.image}
                    contentFit="contain"
                    tintColor={unlocked ? undefined : colors.mutedForeground}
                  />
                ) : item.swatch ? (
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: item.swatch, borderColor: colors.border },
                      !unlocked && { opacity: 0.3 },
                    ]}
                  />
                ) : (
                  <Text style={[styles.emoji, !unlocked && { opacity: 0.25 }]}>{item.emoji}</Text>
                )}
                {gated && !unlocked ? (
                  <View style={styles.lockBadge}>
                    <Feather name="lock" size={14} color={colors.mutedForeground} />
                  </View>
                ) : null}
              </View>
              <Text style={[styles.word, { color: unlocked ? colors.foreground : colors.mutedForeground }]}>
                {unlocked ? label : t('locked')}
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
  chipScroll: {
    flexGrow: 0,
    marginBottom: 14,
  },
  chipRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
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
  emoji: {
    fontSize: 44,
  },
  swatch: {
    width: 60,
    height: 60,
    borderRadius: 999,
    borderWidth: 1,
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
    textAlign: 'center',
  },
});
