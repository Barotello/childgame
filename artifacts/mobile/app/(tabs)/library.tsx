import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameHeader from '@/components/GameHeader';
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
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 76 }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>{t('learnedWords')}</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((category) => {
          const selected = category.id === selectedCategory;

          return (
            <View key={category.id} style={styles.section}>
              <Pressable
                onPress={() => setSelectedCategory(category.id)}
                style={[
                  styles.sectionHeader,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selected && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <View style={styles.sectionHeaderLeft}>
                  <Feather name={category.icon as any} size={18} color={selected ? '#FFFFFF' : colors.secondary} />
                  <Text style={[styles.sectionTitle, { color: selected ? '#FFFFFF' : colors.foreground }]}>
                    {t(category.titleKey)}
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
                  const label = item.names[locale];
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
                      {!isFlags ? (
                        <Text style={[styles.word, { color: unlocked ? colors.foreground : colors.mutedForeground }]}>
                          {unlocked ? label : t('locked')}
                        </Text>
                      ) : null}
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
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  word: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
