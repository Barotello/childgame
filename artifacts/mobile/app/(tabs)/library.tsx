import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '@/components/GameHeader';
import categories, { type Category, type CategoryId } from '@/constants/library';
import { practiceWordIds } from '@/constants/learning';
import words from '@/constants/words';
import { gameTheme } from '@/constants/gameTheme';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import { playCorrectSound } from '@/lib/sounds';
import { speakWord } from '@/lib/speech';

const CATEGORY_THEMES: Record<
  CategoryId,
  {
    gradient: readonly [string, string];
    pale: string;
    border: string;
    accent: string;
    badgeBg: string;
    tagBg: string;
  }
> = {
  animals: {
    gradient: ['#FFA94D', '#FF8200'],
    pale: '#FFF6EC',
    border: '#E86E00',
    accent: '#FF922B',
    badgeBg: '#FFE8D6',
    tagBg: '#FF7A00',
  },
  fruits: {
    gradient: ['#94D82D', '#6BB809'],
    pale: '#F4FCE3',
    border: '#569C04',
    accent: '#82C91E',
    badgeBg: '#E9FAC8',
    tagBg: '#5C940D',
  },
  numbers: {
    gradient: ['#4DABF7', '#1C7ED6'],
    pale: '#E7F5FF',
    border: '#1864AB',
    accent: '#339AF0',
    badgeBg: '#D0EBFF',
    tagBg: '#1971C2',
  },
  colors: {
    gradient: ['#FF6B6B', '#F03E3E'],
    pale: '#FFF5F5',
    border: '#D63333',
    accent: '#FA5252',
    badgeBg: '#FFE3E3',
    tagBg: '#E03131',
  },
  flags: {
    gradient: ['#B197FC', '#845EF7'],
    pale: '#F8F0FC',
    border: '#7048E8',
    accent: '#9775FA',
    badgeBg: '#EED9FD',
    tagBg: '#6741D9',
  },
  body: {
    gradient: ['#F783AC', '#E64980'],
    pale: '#FFF0F6',
    border: '#C2255C',
    accent: '#F06595',
    badgeBg: '#FCC2D7',
    tagBg: '#D6336C',
  },
};

function CategoryIllustrationBadge({ category }: { category: Category }) {
  if (category.image) {
    return (
      <View style={styles.badgeImageWrap}>
        <Image source={category.image} style={styles.badgeImage} contentFit="contain" />
      </View>
    );
  }

  if (category.id === 'numbers') {
    return (
      <View style={styles.numbersIllustration}>
        <View style={[styles.numTile, { backgroundColor: '#FF6B6B' }]}>
          <Text style={styles.numTileText}>1</Text>
        </View>
        <View style={[styles.numTile, { backgroundColor: '#FFD43B' }]}>
          <Text style={styles.numTileText}>2</Text>
        </View>
        <View style={[styles.numTile, { backgroundColor: '#51CF66' }]}>
          <Text style={styles.numTileText}>3</Text>
        </View>
      </View>
    );
  }

  if (category.id === 'colors') {
    return (
      <View style={styles.colorsIllustration}>
        <Text style={styles.paletteEmoji}>🎨</Text>
        <View style={styles.colorDotsRow}>
          <View style={[styles.colorDot, { backgroundColor: '#FF6B6B' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#FFD43B' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#51CF66' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#339AF0' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#CC5DE8' }]} />
        </View>
      </View>
    );
  }

  if (category.id === 'flags') {
    return (
      <View style={styles.flagsIllustration}>
        <Text style={styles.globeEmoji}>🌍</Text>
        <View style={styles.flagMiniBadge}>
          <Text style={styles.flagMiniEmoji}>🚩</Text>
        </View>
      </View>
    );
  }

  return <Text style={styles.fallbackEmoji}>{category.emoji}</Text>;
}

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

  const openWord = (wordId: string, categoryId: CategoryId, wordLabel?: string) => {
    const index = wordIndexById.get(wordId);
    if (index !== undefined && playWordAt(index, categoryId)) {
      playCorrectSound();
      if (wordLabel) speakWord(wordLabel, locale);
      router.push('/game');
    }
  };

  const handleCategoryPress = (category: Category) => {
    playCorrectSound();
    speakWord(t(category.titleKey), locale);
    setActiveCategory(category.id);
  };

  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF2DE', '#FFE5CA']}
      style={[styles.root, { paddingTop: insets.top + 10 }]}
    >
      <GameHeader />

      {selected ? (
        <>
          {/* Category Detail Header */}
          <View style={styles.titleRow}>
            <Pressable
              onPress={() => setActiveCategory(null)}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('backToCategories')}
            >
              <Feather name="arrow-left" size={24} color={gameTheme.colors.ink} />
            </Pressable>

            <View
              style={[
                styles.titleBadgeWrap,
                { backgroundColor: CATEGORY_THEMES[selected.id].badgeBg },
              ]}
            >
              <CategoryIllustrationBadge category={selected} />
            </View>

            <View style={styles.titleCopy}>
              <Text style={styles.title}>{t(selected.titleKey)}</Text>
              <Text style={styles.subtitle}>{t('categoryWords')}</Text>
            </View>
          </View>

          {/* Words Grid for Selected Category */}
          <ScrollView
            contentContainerStyle={[styles.wordGrid, { paddingBottom: insets.bottom + 120 }]}
            showsVerticalScrollIndicator={false}
          >
            {selected.items.map((item) => {
              const gameIndex = item.wordId ? wordIndexById.get(item.wordId) : undefined;
              const learned = gameIndex !== undefined && completedLevels.includes(gameIndex);
              const locked = gameIndex !== undefined && !isLevelUnlocked(gameIndex);
              const label = item.names[locale];
              const theme = CATEGORY_THEMES[selected.id];

              return (
                <Pressable
                  key={item.id}
                  onPress={() => item.wordId && !locked && openWord(item.wordId, selected.id, label)}
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
                  <View
                    style={[
                      styles.wordVisual,
                      { backgroundColor: theme.pale, borderColor: theme.badgeBg },
                    ]}
                  >
                    {item.image ? (
                      <Image source={item.image} style={styles.wordImage} contentFit="contain" />
                    ) : item.swatch ? (
                      <View style={[styles.swatch, { backgroundColor: item.swatch }]} />
                    ) : (
                      <Text style={styles.wordEmoji}>{item.emoji || '⭐'}</Text>
                    )}

                    {/* Status Badge */}
                    <View
                      style={[
                        styles.statusBadge,
                        learned
                          ? styles.learnedBadge
                          : locked
                            ? styles.lockBadge
                            : [styles.readyBadge, { backgroundColor: theme.accent }],
                      ]}
                    >
                      <Feather
                        name={learned ? 'check' : locked ? 'lock' : 'play'}
                        size={15}
                        color={learned ? '#FFFFFF' : locked ? '#8B809C' : '#FFFFFF'}
                      />
                    </View>
                  </View>

                  <Text style={styles.wordLabel} numberOfLines={1}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <>
          {/* Main Explore Header */}
          <View style={styles.pageHeading}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{t('explore')}</Text>
              <Text style={styles.headerSparkle}>✨</Text>
            </View>
            <Text style={styles.subtitle}>{t('chooseCategory')}</Text>
          </View>

          <ScrollView
            contentContainerStyle={[styles.categoryGrid, { paddingBottom: insets.bottom + 120 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* For You Practice Section with Mascot Mino */}
            {practiceWords.length > 0 ? (
              <View style={styles.practiceSection}>
                <View style={styles.practiceHeader}>
                  <View style={styles.mascotBadge}>
                    <Image
                      source={require('../../assets/images/mino.png')}
                      style={styles.mascotImage}
                      contentFit="contain"
                    />
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
                      onPress={() => openWord(word.id, word.category, word.spellings[locale])}
                      style={({ pressed }) => [styles.practiceCard, pressed && styles.cardPressed]}
                      accessibilityRole="button"
                      accessibilityLabel={`${word.spellings[locale]}, ${t('practiceAgain')}`}
                    >
                      <View style={styles.practiceVisual}>
                        {word.image ? (
                          <Image source={word.image} style={styles.practiceImg} contentFit="contain" />
                        ) : (
                          <Text style={styles.practiceEmoji}>{word.emoji || '⭐'}</Text>
                        )}
                      </View>
                      <Text style={styles.practiceWord} numberOfLines={1}>
                        {word.spellings[locale]}
                      </Text>
                      <View style={styles.practicePlay}>
                        <Feather name="play" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Illustrated Category Cards Grid */}
            {categories.map((category) => {
              const theme = CATEGORY_THEMES[category.id];
              const indexes = category.items
                .map((item) => item.wordId && wordIndexById.get(item.wordId))
                .filter((index): index is number => index !== undefined);
              const complete = indexes.filter((index) => completedLevels.includes(index)).length;
              const total = indexes.length;
              const isFinished = complete >= total && total > 0;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => handleCategoryPress(category)}
                  style={({ pressed }) => [
                    styles.categoryCardWrapper,
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={t(category.titleKey)}
                >
                  <LinearGradient
                    colors={theme.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.categoryCard, { borderColor: theme.border }]}
                  >
                    {/* Gloss highlight */}
                    <View style={styles.highlight} />

                    {/* Trophy Badge if category completed */}
                    {isFinished ? (
                      <View style={styles.trophyFloat}>
                        <Text style={styles.trophyEmoji}>🏆</Text>
                      </View>
                    ) : null}

                    {/* Illustration Container */}
                    <View style={[styles.categoryImageBubble, { backgroundColor: theme.badgeBg }]}>
                      <CategoryIllustrationBadge category={category} />
                    </View>

                    {/* Category Title */}
                    <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>

                    {/* Progress Pill */}
                    <View style={styles.progressPill}>
                      <Feather
                        name={isFinished ? 'check-circle' : 'star'}
                        size={12}
                        color="#FFFFFF"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.progressText}>
                        {t('wordsProgress', { done: complete, total })}
                      </Text>
                    </View>
                  </LinearGradient>
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
  pageHeading: { paddingHorizontal: 20, marginBottom: 14 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerSparkle: {
    fontSize: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EFE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  titleBadgeWrap: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  titleCopy: { flex: 1 },
  title: { color: gameTheme.colors.ink, fontSize: 24, fontWeight: '900' },
  subtitle: {
    color: gameTheme.colors.inkSoft,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  categoryCardWrapper: {
    width: '48.2%',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryCard: {
    minHeight: 185,
    borderRadius: 28,
    borderWidth: 3,
    borderBottomWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 4,
    left: 16,
    right: 16,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  trophyFloat: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFE066',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: '#F59F00',
  },
  trophyEmoji: {
    fontSize: 14,
  },
  categoryImageBubble: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  badgeImageWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeImage: {
    width: '84%',
    height: '84%',
  },
  numbersIllustration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  numTile: {
    width: 20,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  numTileText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  colorsIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteEmoji: {
    fontSize: 34,
  },
  colorDotsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 2,
  },
  colorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  flagsIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeEmoji: {
    fontSize: 36,
  },
  flagMiniBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
  },
  flagMiniEmoji: {
    fontSize: 16,
  },
  fallbackEmoji: {
    fontSize: 44,
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  practiceSection: {
    width: '100%',
    backgroundColor: '#FFF8E8',
    borderWidth: 2.5,
    borderColor: '#FFE0A3',
    borderRadius: 28,
    padding: 14,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  practiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  mascotBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE8A3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  mascotImage: {
    width: '90%',
    height: '90%',
  },
  practiceCopy: { flex: 1 },
  practiceTitle: { color: gameTheme.colors.ink, fontSize: 17, fontWeight: '900' },
  practiceSubtitle: {
    color: gameTheme.colors.inkSoft,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  practiceList: { gap: 8 },
  practiceCard: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#F2E3C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  practiceVisual: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#E8F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  practiceImg: {
    width: '85%',
    height: '85%',
  },
  practiceEmoji: { fontSize: 26 },
  practiceWord: {
    flex: 1,
    color: gameTheme.colors.ink,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  practicePlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#06D6A0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  wordCard: {
    width: '48.2%',
    minHeight: 155,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#EFE5D8',
    borderRadius: 26,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  lockedCard: { opacity: 0.52 },
  cardPressed: { transform: [{ scale: 0.96 }, { translateY: 2 }] },
  wordVisual: {
    width: '100%',
    height: 105,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  wordImage: {
    width: '84%',
    height: '84%',
  },
  wordEmoji: { fontSize: 58 },
  swatch: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  learnedBadge: { backgroundColor: '#06D6A0' },
  lockBadge: { backgroundColor: '#E9ECEF' },
  readyBadge: { backgroundColor: '#3AB0FF' },
  wordLabel: {
    color: gameTheme.colors.ink,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'capitalize',
    marginTop: 8,
  },
});
