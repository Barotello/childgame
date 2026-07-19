import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '@/components/GameHeader';
import categories, { type CategoryId } from '@/constants/library';
import { practiceWordIds } from '@/constants/learning';
import words from '@/constants/words';
import { gameTheme } from '@/constants/gameTheme';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

const CATEGORY_COLORS: Record<CategoryId, { bg: string; border: string }> = {
  fruits: { bg: '#8BCB55', border: '#5A9B2F' },
  animals: { bg: '#FF9D55', border: '#E57A2D' },
  numbers: { bg: '#59B3EA', border: '#3285BA' },
  colors: { bg: '#F05E7D', border: '#C63B5B' },
  flags: { bg: '#9B7AE0', border: '#7252B4' },
  body: { bg: '#F27DB1', border: '#C94F86' },
};

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();
  const { completedLevels, playWordAt, isLevelUnlocked, learningRecords } = useGameState();
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const wordIndexById = useMemo(() => {
    const map = new Map<string, number>();
    words.forEach((word, index) => map.set(word.id, index));
    return map;
  }, []);

  const selected = categories.find((category) => category.id === activeCategory);
  const practiceWords = practiceWordIds(learningRecords)
    .map((wordId) => {
      const index = wordIndexById.get(wordId);
      return index === undefined || !isLevelUnlocked(index) ? undefined : { word: words[index], index };
    })
    .filter((item): item is { word: (typeof words)[number]; index: number } => item !== undefined);

  const openWord = (wordId: string, categoryId: CategoryId) => {
    const index = wordIndexById.get(wordId);
    if (index !== undefined && playWordAt(index, categoryId)) router.push('/game');
  };

  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF1DB', gameTheme.colors.peach]}
      style={[styles.root, { paddingTop: insets.top + 10 }]}
    >
      <GameHeader />

      {selected ? (
        <>
          <View style={styles.titleRow}>
            <Pressable
              onPress={() => setActiveCategory(null)}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel={t('backToCategories')}
            >
              <Feather name="arrow-left" size={22} color={gameTheme.colors.ink} />
            </Pressable>
            <View style={[styles.titleEmoji, { backgroundColor: CATEGORY_COLORS[selected.id].bg }]}>
              <Text style={styles.titleEmojiText}>{selected.emoji}</Text>
            </View>
            <View style={styles.titleCopy}>
              <Text style={styles.title}>{t(selected.titleKey)}</Text>
              <Text style={styles.subtitle}>{t('categoryWords')}</Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={[styles.wordGrid, { paddingBottom: insets.bottom + 126 }]}
            showsVerticalScrollIndicator={false}
          >
            {selected.items.map((item) => {
              const gameIndex = item.wordId ? wordIndexById.get(item.wordId) : undefined;
              const learned = gameIndex !== undefined && completedLevels.includes(gameIndex);
              const locked = gameIndex !== undefined && !isLevelUnlocked(gameIndex);
              const label = item.names[locale];

              return (
                <Pressable
                  key={item.id}
                  onPress={() => item.wordId && !locked && openWord(item.wordId, selected.id)}
                  disabled={locked}
                  style={({ pressed }) => [
                    styles.wordCard,
                    locked && styles.lockedCard,
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={locked ? `${label}, ${t('locked')}` : label}
                  accessibilityState={{ disabled: locked }}
                >
                  <View style={[styles.wordVisual, { backgroundColor: `${CATEGORY_COLORS[selected.id].bg}1F` }]}>
                    {item.swatch ? (
                      <View style={[styles.swatch, { backgroundColor: item.swatch }]} />
                    ) : (
                      <Text style={styles.wordEmoji}>{item.emoji || '⭐'}</Text>
                    )}
                    <View
                      style={[
                        styles.statusBadge,
                        learned ? styles.learnedBadge : locked ? styles.lockBadge : styles.readyBadge,
                      ]}
                    >
                      <Feather
                        name={learned ? 'check' : locked ? 'lock' : 'play'}
                        size={14}
                        color={learned ? '#238A59' : locked ? '#8B809C' : '#FFFFFF'}
                      />
                    </View>
                  </View>
                  <Text style={styles.wordLabel} numberOfLines={1}>{label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.pageHeading}>
            <Text style={styles.title}>{t('explore')}</Text>
            <Text style={styles.subtitle}>{t('chooseCategory')}</Text>
          </View>
          <ScrollView
            contentContainerStyle={[styles.categoryGrid, { paddingBottom: insets.bottom + 126 }]}
            showsVerticalScrollIndicator={false}
          >
            {practiceWords.length > 0 ? (
              <View style={styles.practiceSection}>
                <View style={styles.practiceHeading}>
                  <View style={styles.practiceIcon}>
                    <Feather name="refresh-cw" size={19} color="#FFFFFF" />
                  </View>
                  <View style={styles.practiceCopy}>
                    <Text style={styles.practiceTitle}>{t('forYouPractice')}</Text>
                    <Text style={styles.practiceSubtitle}>{t('practiceSubtitle')}</Text>
                  </View>
                </View>
                <View style={styles.practiceList}>
                  {practiceWords.map(({ word }) => (
                    <Pressable
                      key={word.id}
                      onPress={() => openWord(word.id, word.category)}
                      style={({ pressed }) => [styles.practiceCard, pressed && styles.cardPressed]}
                      accessibilityRole="button"
                      accessibilityLabel={`${word.spellings[locale]}, ${t('practiceAgain')}`}
                    >
                      <View style={styles.practiceVisual}>
                        <Text style={styles.practiceEmoji}>{word.emoji || '⭐'}</Text>
                      </View>
                      <Text style={styles.practiceWord} numberOfLines={1}>{word.spellings[locale]}</Text>
                      <View style={styles.practicePlay}>
                        <Feather name="play" size={15} color="#FFFFFF" />
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
            {categories.map((category) => {
              const color = CATEGORY_COLORS[category.id];
              const indexes = category.items
                .map((item) => item.wordId && wordIndexById.get(item.wordId))
                .filter((index): index is number => index !== undefined);
              const complete = indexes.filter((index) => completedLevels.includes(index)).length;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => setActiveCategory(category.id)}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    { backgroundColor: color.bg, borderColor: color.border },
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={t(category.titleKey)}
                >
                  <View style={styles.highlight} />
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
                  <View style={styles.progressPill}>
                    <Text style={styles.progressText}>
                      {t('wordsProgress', { done: complete, total: indexes.length })}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pageHeading: { paddingHorizontal: 20, marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gameTheme.colors.white,
  },
  titleEmoji: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  titleEmojiText: { fontSize: 28 },
  titleCopy: { flex: 1 },
  title: { color: gameTheme.colors.ink, fontSize: 24, fontWeight: '900' },
  subtitle: { color: gameTheme.colors.inkSoft, fontSize: 13, lineHeight: 18, fontWeight: '700', marginTop: 3 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 14 },
  practiceSection: {
    width: '100%',
    backgroundColor: '#FFF8E8',
    borderWidth: 2,
    borderColor: '#F0D9A8',
    borderRadius: 26,
    padding: 14,
  },
  practiceHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  practiceIcon: { width: 38, height: 38, borderRadius: 14, backgroundColor: gameTheme.colors.coral, alignItems: 'center', justifyContent: 'center' },
  practiceCopy: { flex: 1 },
  practiceTitle: { color: gameTheme.colors.ink, fontSize: 17, fontWeight: '900' },
  practiceSubtitle: { color: gameTheme.colors.inkSoft, fontSize: 11, lineHeight: 15, fontWeight: '700', marginTop: 2 },
  practiceList: { gap: 8 },
  practiceCard: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 18, backgroundColor: '#FFFFFF', paddingHorizontal: 10, borderWidth: 1, borderColor: '#F2E3C7' },
  practiceVisual: { width: 42, height: 42, borderRadius: 14, backgroundColor: gameTheme.colors.skySoft, alignItems: 'center', justifyContent: 'center' },
  practiceEmoji: { fontSize: 26 },
  practiceWord: { flex: 1, color: gameTheme.colors.ink, fontSize: 15, fontWeight: '900', textTransform: 'capitalize' },
  practicePlay: { width: 34, height: 34, borderRadius: 17, backgroundColor: gameTheme.colors.sky, alignItems: 'center', justifyContent: 'center' },
  categoryCard: {
    width: '47.8%',
    minHeight: 170,
    borderRadius: 28,
    borderWidth: 3,
    borderBottomWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    overflow: 'hidden',
  },
  highlight: { position: 'absolute', top: 5, left: 20, right: 20, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF55' },
  categoryEmoji: { fontSize: 54 },
  categoryTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '900', marginTop: 8, textAlign: 'center' },
  progressPill: { backgroundColor: '#FFFFFF33', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginTop: 8 },
  progressText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
  wordCard: {
    width: '48.2%',
    minHeight: 150,
    backgroundColor: gameTheme.colors.white,
    borderWidth: 2,
    borderColor: gameTheme.colors.outline,
    borderRadius: 24,
    padding: 10,
    alignItems: 'center',
  },
  lockedCard: { opacity: 0.58 },
  cardPressed: { transform: [{ scale: 0.97 }, { translateY: 2 }] },
  wordVisual: { width: '100%', height: 104, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  wordEmoji: { fontSize: 58 },
  swatch: { width: 66, height: 66, borderRadius: 33, borderWidth: 3, borderColor: '#FFFFFF' },
  statusBadge: { position: 'absolute', top: 7, right: 7, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  learnedBadge: { backgroundColor: gameTheme.colors.mintSoft },
  lockBadge: { backgroundColor: '#F0ECF4' },
  readyBadge: { backgroundColor: gameTheme.colors.sky },
  wordLabel: { color: gameTheme.colors.ink, fontSize: 15, fontWeight: '900', textTransform: 'capitalize', marginTop: 8 },
});
