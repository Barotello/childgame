import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import GameHeader from '@/components/GameHeader';

const CATEGORY_COLORS: Record<string, { bg: string; border: string }> = {
  fruits: { bg: '#93D656', border: '#5DAE30' },
  animals: { bg: '#FFAC4A', border: '#E08520' },
  numbers: { bg: '#56A8DF', border: '#327EBC' },
  colors: { bg: '#F14A6F', border: '#C6244A' },
  flags: { bg: '#9B72CF', border: '#7B58A6' },
};
import categories from '@/constants/library';
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

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120 }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>{t('learnedWords')}</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((category) => {
          const selected = category.id === selectedCategory;
          const colorData = CATEGORY_COLORS[category.id] || { bg: '#56A8DF', border: '#327EBC' };

          return (
            <View key={category.id} style={styles.section}>
              <Pressable
                onPress={() => {
                  setSelectedCategory(category.id);
                  router.navigate('/game');
                }}
                style={[
                  styles.sectionHeader,
                  { 
                    backgroundColor: colorData.bg, 
                    borderColor: colorData.border,
                    transform: [{ scale: selected ? 1.03 : 1 }],
                    opacity: selected ? 1 : 0.85
                  },
                ]}
              >
                <View style={styles.jellyHighlight} />
                <View style={styles.sectionHeaderLeft}>
                  <Text style={{ fontSize: 24 }}>{category.emoji}</Text>
                  <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>
                    {t(category.titleKey)}
                    {(() => {
                      const playableItems = category.items.filter((item) => item.wordId);
                      const totalPlayable = playableItems.length;
                      if (totalPlayable === 0) return null;
                      const completedCount = playableItems.filter((item) => {
                        const gameIndex = wordIndexById.get(item.wordId!);
                        return gameIndex !== undefined && completedLevels.includes(gameIndex);
                      }).length;
                      return ` (${completedCount}/${totalPlayable})`;
                    })()}
                  </Text>
                </View>
                {selected ? <Feather name="check-circle" size={18} color="#FFFFFF" /> : null}
              </Pressable>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
              >
                {category.items.map((item) => {
                  const gameIndex = item.wordId ? wordIndexById.get(item.wordId) : undefined;
                  const gated = gameIndex !== undefined;
                  const unlocked = !gated || completedLevels.includes(gameIndex as number);
                  const isFlags = category.id === 'flags';

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
                            ]}
                          />
                        ) : (
                          <Text style={[styles.emoji, !unlocked && { opacity: 0.25 }]}>{item.emoji}</Text>
                        )}
                        {gated && !unlocked ? (
                          <View style={styles.lockBadge}>
                            <Feather name="lock" size={14} color={colors.mutedForeground} />
                          </View>
                        ) : unlocked ? (
                          <View style={[styles.lockBadge, { backgroundColor: '#E8F5E9' }]}>
                            <Feather name="check" size={14} color="#2E7D32" />
                          </View>
                        ) : null}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 6,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  jellyHighlight: {
    position: 'absolute',
    top: 4,
    left: '10%',
    right: '10%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 5,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  row: {
    gap: 10,
    paddingRight: 20,
  },
  card: {
    width: 110,
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  imageWrap: {
    width: '100%',
    height: 90,
    borderRadius: 12,
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
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
  },
  lockBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 5,
  },
});
