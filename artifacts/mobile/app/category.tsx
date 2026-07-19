import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '@/components/GameHeader';
import MascotGuide from '@/components/MascotGuide';
import WordVisual from '@/components/WordVisual';
import { buildCategoryChapters } from '@/constants/curriculum';
import categories, { type CategoryId } from '@/constants/library';
import { gameTheme } from '@/constants/gameTheme';
import words from '@/constants/words';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { speakWord } from '@/lib/speech';

const CATEGORY_COLORS: Record<CategoryId, { main: string; pale: string; border: string }> = {
  animals: { main: '#FF9D55', pale: '#FFF0E4', border: '#E57A2D' },
  fruits: { main: '#8BCB55', pale: '#EFF9E7', border: '#5A9B2F' },
  numbers: { main: '#59B3EA', pale: '#E9F6FE', border: '#3285BA' },
  colors: { main: '#F05E7D', pale: '#FFF0F4', border: '#C63B5B' },
  flags: { main: '#9B7AE0', pale: '#F2EDFC', border: '#7252B4' },
  body: { main: '#F27DB1', pale: '#FFF0F7', border: '#C94F86' },
};

export default function CategoryChaptersScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();
  const { selectedCategory, completedLevels, playWordAt } = useGameState();
  const category = categories.find((item) => item.id === selectedCategory) ?? categories[0];
  const color = CATEGORY_COLORS[category.id];
  const chapters = buildCategoryChapters(words, completedLevels, category.id);
  const guide = t('chooseChapterBody');

  const startChapter = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    if (!chapter?.unlocked) return;
    const entry = chapter.entries.find(({ globalIndex }) => !completedLevels.includes(globalIndex))
      ?? chapter.entries[0];
    if (entry && playWordAt(entry.globalIndex, category.id)) router.push('/game');
  };

  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF1DB', gameTheme.colors.peach]}
      style={[styles.root, { paddingTop: insets.top + 8 }]}
    >
      <GameHeader onBack={() => router.navigate('/journey')} />
      <View style={styles.headingRow}>
        <View style={[styles.categoryIcon, { backgroundColor: color.main }]}>
          <Text style={styles.categoryEmoji}>{category.emoji}</Text>
        </View>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>{t('chooseChapter')}</Text>
          <Text style={styles.title}>{t(category.titleKey)}</Text>
        </View>
      </View>
      <MascotGuide message={guide} onPress={() => speakWord(guide, locale)} />

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {chapters.map((chapter) => (
          <Pressable
            key={chapter.number}
            onPress={() => startChapter(chapter.number - 1)}
            disabled={!chapter.unlocked}
            accessibilityRole="button"
            accessibilityLabel={
              chapter.unlocked
                ? t('chapterNumber', { number: chapter.number })
                : `${t('chapterNumber', { number: chapter.number })}, ${t('locked')}`
            }
            style={({ pressed }) => [
              styles.chapterCard,
              { backgroundColor: chapter.unlocked ? color.pale : '#EEE9E2', borderColor: chapter.unlocked ? color.border : '#CFC8BE' },
              !chapter.unlocked && styles.lockedCard,
              pressed && chapter.unlocked && styles.pressedCard,
            ]}
          >
            <View style={styles.chapterTop}>
              <View style={[styles.numberBadge, { backgroundColor: chapter.unlocked ? color.main : '#AAA2B0' }]}>
                {chapter.complete ? (
                  <Feather name="check" size={23} color="#FFFFFF" />
                ) : chapter.unlocked ? (
                  <Text style={styles.numberText}>{chapter.number}</Text>
                ) : (
                  <Feather name="lock" size={21} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.chapterCopy}>
                <Text style={styles.chapterTitle}>{t('chapterNumber', { number: chapter.number })}</Text>
                <Text style={styles.chapterProgress}>
                  {t('chapterWordsProgress', {
                    done: chapter.completedCount,
                    total: chapter.entries.length,
                  })}
                </Text>
              </View>
              <View style={[styles.playButton, { backgroundColor: chapter.unlocked ? color.main : '#B7AFBA' }]}>
                <Feather name={chapter.unlocked ? 'play' : 'lock'} size={19} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.wordPreviewRow}>
              {chapter.entries.map(({ word, globalIndex }) => {
                const learned = completedLevels.includes(globalIndex);
                return (
                  <View key={word.id} style={styles.wordPreview}>
                    <WordVisual word={word} style={styles.wordVisual} emojiSize={34} />
                    <View style={[styles.wordStatus, learned && { backgroundColor: gameTheme.colors.mint }]}>
                      {learned ? <Feather name="check" size={10} color="#FFFFFF" /> : null}
                    </View>
                    <Text style={styles.wordName} numberOfLines={1}>{word.spellings[locale]}</Text>
                  </View>
                );
              })}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12, marginBottom: 10 },
  categoryIcon: { width: 62, height: 62, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  categoryEmoji: { fontSize: 36 },
  headingCopy: { flex: 1 },
  eyebrow: { color: gameTheme.colors.inkSoft, fontSize: 12, fontWeight: '800' },
  title: { color: gameTheme.colors.ink, fontSize: 25, fontWeight: '900' },
  list: { padding: 20, gap: 16 },
  chapterCard: { borderRadius: 28, borderWidth: 3, borderBottomWidth: 7, padding: 14 },
  lockedCard: { opacity: 0.76 },
  pressedCard: { transform: [{ scale: 0.985 }, { translateY: 2 }] },
  chapterTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  numberBadge: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' },
  chapterCopy: { flex: 1 },
  chapterTitle: { color: gameTheme.colors.ink, fontSize: 17, fontWeight: '900' },
  chapterProgress: { color: gameTheme.colors.inkSoft, fontSize: 12, fontWeight: '700', marginTop: 2 },
  playButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  wordPreviewRow: { flexDirection: 'row', gap: 7, marginTop: 13 },
  wordPreview: { flex: 1, minWidth: 0, alignItems: 'center' },
  wordVisual: { width: 48, height: 48 },
  wordName: { width: '100%', color: gameTheme.colors.inkSoft, fontSize: 9, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  wordStatus: { position: 'absolute', right: 0, top: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#DDD4C8', alignItems: 'center', justifyContent: 'center' },
});
