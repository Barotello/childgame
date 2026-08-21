import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '@/components/GameHeader';
import WordVisual from '@/components/WordVisual';
import { buildCategoryChapters } from '@/constants/curriculum';
import categories, { type CategoryId } from '@/constants/library';
import { gameTheme } from '@/constants/gameTheme';
import words from '@/constants/words';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { speakWord } from '@/lib/speech';

const CATEGORY_COLORS: Record<CategoryId, { main: string; pale: string; border: string }> = {
  animals: { main: '#FF9D55', pale: '#FFF5EB', border: '#E57A2D' },
  fruits: { main: '#8BCB55', pale: '#F4FAEE', border: '#5A9B2F' },
  numbers: { main: '#59B3EA', pale: '#F0F8FE', border: '#3285BA' },
  colors: { main: '#F05E7D', pale: '#FFF2F5', border: '#C63B5B' },
  flags: { main: '#9B7AE0', pale: '#F6F2FD', border: '#7252B4' },
  body: { main: '#F27DB1', pale: '#FFF2F8', border: '#C94F86' },
};

export default function CategoryChaptersScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();
  const { selectedCategory, completedLevels, playWordAt } = useGameState();
  const category = categories.find((item) => item.id === selectedCategory) ?? categories[0];
  const color = CATEGORY_COLORS[category.id];
  const chapters = buildCategoryChapters(words, completedLevels, category.id);
  const handleCardPress = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    if (!chapter?.unlocked) {
      speakWord(t('lockedChapterHint'), locale);
      return;
    }
    const entry = chapter.entries.find(({ globalIndex }) => !completedLevels.includes(globalIndex))
      ?? chapter.entries[0];
    if (entry && playWordAt(entry.globalIndex, category.id)) {
      router.push('/game');
    }
  };

  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF1DB', gameTheme.colors.peach]}
      style={[styles.root, { paddingTop: insets.top + 20 }]}
    >
      <GameHeader onBack={() => router.navigate('/journey')} />

      {/* Page Header — Clean Adventure Title */}
      <View style={styles.headingRow}>
        <View style={[styles.categoryIcon, { backgroundColor: color.main }]}>
          <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        </View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>{t(category.titleKey)}</Text>
          <Text style={styles.subtitle}>{t('chooseAdventure')}</Text>
        </View>
      </View>

      {/* Chapter Cards List */}
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {chapters.map((chapter, index) => {
          const chapterColor = chapter.theme?.colors ?? color;
          const chapterTitle = chapter.theme
            ? t(chapter.theme.titleKey)
            : t('chapterNumber', { number: chapter.number });

          return (
            <Pressable
              key={chapter.number}
              onPress={() => handleCardPress(index)}
              accessibilityRole="button"
              accessibilityLabel={
                chapter.unlocked
                  ? chapterTitle
                  : `${chapterTitle}, ${t('locked')}`
              }
              style={({ pressed }) => [
                styles.chapterCard,
                {
                  backgroundColor: chapter.unlocked ? chapterColor.pale : '#F4EFEA',
                  borderColor: chapter.unlocked ? chapterColor.border : '#DDD6CC',
                },
                !chapter.unlocked && styles.lockedCard,
                pressed && styles.pressedCard,
              ]}
            >
              {/* Card Top: Habitat Icon + Title + Progress + Play/Lock Button */}
              <View style={styles.chapterTop}>
                <View
                  style={[
                    styles.habitatBadge,
                    { backgroundColor: chapter.unlocked ? chapterColor.main : '#B0A8B8' },
                  ]}
                >
                  {chapter.complete ? (
                    <Feather name="check" size={24} color="#FFFFFF" />
                  ) : chapter.theme ? (
                    <Text style={styles.habitatEmoji}>{chapter.theme.emoji}</Text>
                  ) : chapter.unlocked ? (
                    <Text style={styles.chapterNumText}>{chapter.number}</Text>
                  ) : (
                    <Feather name="lock" size={22} color="#FFFFFF" />
                  )}
                </View>

                <View style={styles.chapterCopy}>
                  <Text style={styles.chapterTitle} numberOfLines={1}>{chapterTitle}</Text>
                  <Text style={[styles.chapterProgress, { color: chapter.complete ? '#2D6A4F' : gameTheme.colors.inkSoft }]}>
                    {t('chapterWordsProgress', {
                      done: chapter.completedCount,
                      total: chapter.entries.length,
                    })}
                  </Text>
                </View>

                <View
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: chapter.complete
                        ? '#06D6A0'
                        : chapter.unlocked
                          ? chapterColor.main
                          : '#C7BFCC',
                    },
                  ]}
                >
                  {chapter.complete ? (
                    <Feather name="check" size={20} color="#FFFFFF" />
                  ) : chapter.unlocked ? (
                    <Feather name="play" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
                  ) : (
                    <Feather name="lock" size={18} color="#FFFFFF" />
                  )}
                </View>
              </View>

              {/* Animal Preview Row */}
              <View style={styles.wordPreviewRow}>
                {chapter.entries.map(({ word, globalIndex }) => {
                  const learned = completedLevels.includes(globalIndex);
                  return (
                    <Pressable
                      key={word.id}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (playWordAt(globalIndex, category.id)) {
                          router.push('/game');
                        }
                      }}
                      style={styles.wordPreview}
                      accessibilityRole="button"
                      accessibilityLabel={word.spellings[locale]}
                    >
                      <View style={styles.visualContainer}>
                        <WordVisual word={word} style={styles.wordVisual} emojiSize={36} />
                        {learned ? (
                          <View style={styles.learnedBadge}>
                            <Feather name="check" size={10} color="#FFFFFF" />
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.wordName} numberOfLines={1}>
                        {word.spellings[locale]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 6,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryEmoji: { fontSize: 34 },
  headingCopy: { flex: 1 },
  title: { color: gameTheme.colors.ink, fontSize: 24, fontWeight: '900' },
  subtitle: { color: gameTheme.colors.inkSoft, fontSize: 13, fontWeight: '700', marginTop: 1 },
  guideWrapper: {
    marginBottom: 4,
  },
  list: { paddingHorizontal: 18, paddingTop: 10, gap: 14 },
  chapterCard: {
    borderRadius: 26,
    borderWidth: 2.5,
    borderBottomWidth: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.72,
    borderBottomWidth: 4,
  },
  pressedCard: {
    transform: [{ scale: 0.985 }, { translateY: 2 }],
  },
  chapterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitatBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  habitatEmoji: {
    fontSize: 26,
  },
  chapterNumText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  chapterCopy: {
    flex: 1,
  },
  chapterTitle: {
    color: gameTheme.colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  chapterProgress: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  wordPreviewRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  wordPreview: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  visualContainer: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordVisual: {
    width: 44,
    height: 44,
  },
  learnedBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#06D6A0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  wordName: {
    width: '100%',
    color: gameTheme.colors.inkSoft,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 3,
  },
});
