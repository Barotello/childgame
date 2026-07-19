import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import categories, { type CategoryId } from '@/constants/library';
import words from '@/constants/words';
import { gameTheme } from '@/constants/gameTheme';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { speakWord } from '@/lib/speech';
import GameHeader from '@/components/GameHeader';
import MascotGuide from '@/components/MascotGuide';
import ParentGate from '@/components/ParentGate';
import { chapterProgress } from '@/constants/curriculum';

const CATEGORY_COLORS: Record<CategoryId, { main: string; pale: string; border: string }> = {
  animals: { main: '#FF9D55', pale: '#FFF0E4', border: '#E57A2D' },
  fruits: { main: '#8BCB55', pale: '#EFF9E7', border: '#5A9B2F' },
  numbers: { main: '#59B3EA', pale: '#E9F6FE', border: '#3285BA' },
  colors: { main: '#F05E7D', pale: '#FFF0F4', border: '#C63B5B' },
  flags: { main: '#9B7AE0', pale: '#F2EDFC', border: '#7252B4' },
  body: { main: '#F27DB1', pale: '#FFF0F7', border: '#C94F86' },
};

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();
  const { completedLevels, dailyWords, dailyGoal, setSelectedCategory } = useGameState();
  const [showParentGate, setShowParentGate] = useState(false);
  const pathname = usePathname();
  const missionDone = dailyWords >= dailyGoal;
  const mascotMessage = missionDone ? t('missionComplete') : t('mascotWelcome');

  useEffect(() => {
    if (pathname !== '/journey') setShowParentGate(false);
  }, [pathname]);

  const playCategory = (category: CategoryId) => {
    setSelectedCategory(category);
    router.push('/category');
  };

  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF1DB', gameTheme.colors.peach]}
      style={[styles.root, { paddingTop: insets.top + 10 }]}
    >
      <GameHeader onParentPress={() => setShowParentGate(true)} />
      <MascotGuide message={mascotMessage} onPress={() => speakWord(mascotMessage, locale)} />

      <View style={styles.missionCard}>
        <View style={styles.missionTop}>
          <View style={styles.missionTitleRow}>
            <View style={styles.missionIcon}>
              <Feather name={missionDone ? 'award' : 'target'} size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.missionTitle}>{t('todayMission')}</Text>
              <Text style={styles.missionCaption}>
                {t('missionProgress', { done: dailyWords, total: dailyGoal })}
              </Text>
            </View>
          </View>
          <Text style={styles.missionReward}>+30 ★</Text>
        </View>
        <View style={styles.missionTrack}>
          <View style={[styles.missionFill, { width: `${Math.min(1, dailyWords / dailyGoal) * 100}%` }]} />
        </View>
      </View>

      <Text style={styles.heading}>{t('chooseAdventure')}</Text>
      <ScrollView
        contentContainerStyle={[styles.path, { paddingBottom: insets.bottom + 126 }]}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category, index) => {
          const color = CATEGORY_COLORS[category.id];
          const categoryWordIndexes = words
            .map((word, wordIndex) => ({ word, wordIndex }))
            .filter(({ word }) => word.category === category.id);
          const complete = categoryWordIndexes.filter(({ wordIndex }) =>
            completedLevels.includes(wordIndex),
          ).length;
          const total = categoryWordIndexes.length;
          const chapters = chapterProgress(total, complete);
          const visibleChapterCount = Math.min(5, chapters.totalChapters);
          const visibleChapterStart = Math.min(
            Math.max(0, chapters.currentChapter - 3),
            Math.max(0, chapters.totalChapters - visibleChapterCount),
          );

          return (
            <View
              key={category.id}
              style={[styles.pathStop, index % 2 === 0 ? styles.pathLeft : styles.pathRight]}
            >
              {index < categories.length - 1 ? (
                <View style={[styles.pathLine, index % 2 === 0 ? styles.lineRight : styles.lineLeft]} />
              ) : null}
              <Pressable
                onPress={() => playCategory(category.id)}
                style={({ pressed }) => [
                  styles.island,
                  { backgroundColor: color.pale, borderColor: color.border },
                  pressed && styles.islandPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={t(category.titleKey)}
              >
                <View style={[styles.emojiCircle, { backgroundColor: color.main }]}>
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                </View>
                <View style={styles.islandCopy}>
                  <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
                  <Text style={styles.categoryProgress}>
                    {t('wordsProgress', { done: complete, total })}
                  </Text>
                  <View style={styles.chapterRow}>
                    <Text style={styles.chapterLabel}>
                      {t('chapterProgress', {
                        current: chapters.currentChapter,
                        total: chapters.totalChapters,
                      })}
                    </Text>
                    <View style={styles.chapterDots}>
                      {Array.from({ length: visibleChapterCount }).map((_, offset) => {
                        const chapterIndex = visibleChapterStart + offset;
                        return (
                        <View
                          key={chapterIndex}
                          style={[
                            styles.chapterDot,
                            {
                              backgroundColor:
                                chapterIndex < chapters.currentChapter ? color.main : '#E6DDCF',
                            },
                          ]}
                        />
                        );
                      })}
                    </View>
                  </View>
                  <View style={styles.smallTrack}>
                    <View
                      style={[
                        styles.smallFill,
                        { backgroundColor: color.main, width: `${total ? (complete / total) * 100 : 0}%` },
                      ]}
                    />
                  </View>
                </View>
                <View style={[styles.playCircle, { backgroundColor: color.main }]}>
                  <Feather name="play" size={20} color="#FFFFFF" />
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <ParentGate
        visible={showParentGate}
        onClose={() => setShowParentGate(false)}
        onSuccess={() => {
          router.push('/settings');
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  missionCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: gameTheme.colors.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F2DDBA',
    padding: 15,
    shadowColor: gameTheme.colors.ink,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  missionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  missionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  missionIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: gameTheme.colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionTitle: { color: gameTheme.colors.ink, fontSize: 16, fontWeight: '900' },
  missionCaption: { color: gameTheme.colors.inkSoft, fontSize: 12, fontWeight: '700', marginTop: 2 },
  missionReward: { color: '#A67500', fontSize: 14, fontWeight: '900' },
  missionTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5ECDD',
    overflow: 'hidden',
    marginTop: 13,
  },
  missionFill: { height: '100%', borderRadius: 6, backgroundColor: gameTheme.colors.mint },
  heading: {
    color: gameTheme.colors.ink,
    fontSize: 20,
    fontWeight: '900',
    paddingHorizontal: 22,
    marginTop: 20,
    marginBottom: 8,
  },
  path: { paddingHorizontal: 20, paddingTop: 4, gap: 18 },
  pathStop: { width: '88%', zIndex: 1 },
  pathLeft: { alignSelf: 'flex-start' },
  pathRight: { alignSelf: 'flex-end' },
  pathLine: {
    position: 'absolute',
    bottom: -30,
    width: 82,
    height: 42,
    borderBottomWidth: 5,
    borderColor: '#E6CFAF',
    borderStyle: 'dashed',
    zIndex: -1,
  },
  lineRight: { right: -36, borderRightWidth: 5, borderBottomRightRadius: 34 },
  lineLeft: { left: -36, borderLeftWidth: 5, borderBottomLeftRadius: 34 },
  island: {
    minHeight: 106,
    borderRadius: 28,
    borderWidth: 3,
    borderBottomWidth: 7,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  islandPressed: { transform: [{ scale: 0.98 }, { translateY: 2 }] },
  emojiCircle: {
    width: 68,
    height: 68,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: { fontSize: 38 },
  islandCopy: { flex: 1 },
  categoryTitle: { color: gameTheme.colors.ink, fontSize: 17, fontWeight: '900' },
  categoryProgress: { color: gameTheme.colors.inkSoft, fontSize: 12, fontWeight: '700', marginTop: 3 },
  chapterRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5 },
  chapterLabel: { color: gameTheme.colors.ink, fontSize: 10, fontWeight: '900' },
  chapterDots: { flexDirection: 'row', gap: 3, flexShrink: 1 },
  chapterDot: { width: 7, height: 7, borderRadius: 4 },
  smallTrack: { height: 7, borderRadius: 4, backgroundColor: '#FFFFFF', overflow: 'hidden', marginTop: 8 },
  smallFill: { height: '100%', borderRadius: 4 },
  playCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
