import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import categories, { type Category, type CategoryId } from '@/constants/library';
import words from '@/constants/words';
import { gameTheme } from '@/constants/gameTheme';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import GameHeader from '@/components/GameHeader';
import { chapterProgress } from '@/constants/curriculum';

const CATEGORY_COLORS: Record<CategoryId, { main: string; pale: string; border: string; glow: string }> = {
  animals: { main: '#FF9D55', pale: '#FFF4E8', border: '#E57A2D', glow: '#FFE8D6' },
  fruits: { main: '#8BCB55', pale: '#F4FAEE', border: '#5A9B2F', glow: '#E3F6D5' },
  numbers: { main: '#59B3EA', pale: '#F0F8FE', border: '#3285BA', glow: '#D8EEFC' },
  colors: { main: '#F05E7D', pale: '#FFF0F4', border: '#C63B5B', glow: '#FDE0E7' },
  flags: { main: '#9B7AE0', pale: '#F6F2FD', border: '#7252B4', glow: '#E8DEF8' },
  body: { main: '#F27DB1', pale: '#FFF2F8', border: '#C94F86', glow: '#FCDAEB' },
  sports: { main: '#FF5722', pale: '#FFF3E0', border: '#E64A19', glow: '#FFE0B2' },
};

function CategoryBadgeVisual({ category }: { category: Category }) {
  if (category.id === 'animals' && category.image) {
    return <Image source={category.image} style={styles.illustrationImg} contentFit="contain" />;
  }
  if (category.id === 'fruits' && category.image) {
    return <Image source={category.image} style={styles.illustrationImg} contentFit="contain" />;
  }
  if (category.id === 'body' && category.image) {
    return <Image source={category.image} style={styles.illustrationImg} contentFit="contain" />;
  }
  if (category.id === 'numbers') {
    return (
      <View style={styles.numbersVisualWrap}>
        <View style={[styles.numBlock, { backgroundColor: '#FF5E7E' }]}>
          <Text style={styles.numBlockText}>1</Text>
        </View>
        <View style={[styles.numBlock, { backgroundColor: '#FFD166' }]}>
          <Text style={styles.numBlockText}>2</Text>
        </View>
        <View style={[styles.numBlock, { backgroundColor: '#06D6A0' }]}>
          <Text style={styles.numBlockText}>3</Text>
        </View>
      </View>
    );
  }
  if (category.id === 'colors') {
    return (
      <View style={styles.colorsVisualWrap}>
        <Text style={styles.paletteEmoji}>🎨</Text>
        <View style={styles.colorDotsRow}>
          <View style={[styles.colorDot, { backgroundColor: '#FF5E7E' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#FFD166' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#06D6A0' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#118AB2' }]} />
          <View style={[styles.colorDot, { backgroundColor: '#9D4EDD' }]} />
        </View>
      </View>
    );
  }
  if (category.id === 'flags') {
    return (
      <View style={styles.flagsVisualWrap}>
        <Text style={styles.globeEmoji}>🌍</Text>
        <View style={styles.flagMiniWrap}>
          <Text style={styles.flagMiniEmoji}>🚩</Text>
        </View>
      </View>
    );
  }
  if (category.id === 'body') {
    return (
      <View style={styles.bodyVisualWrap}>
        <Text style={styles.handEmoji}>🖐️</Text>
        <View style={styles.heartMiniWrap}>
          <Text style={styles.heartMiniEmoji}>❤️</Text>
        </View>
      </View>
    );
  }
  if (category.id === 'sports') {
    return (
      <View style={styles.sportsVisualWrap}>
        <Text style={styles.sportsEmoji}>⚽</Text>
        <View style={styles.trophyMiniWrap}>
          <Text style={styles.trophyMiniEmoji}>🏆</Text>
        </View>
      </View>
    );
  }
  return <Text style={styles.categoryEmoji}>{category.emoji}</Text>;
}

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { completedLevels, setSelectedCategory } = useGameState();

  const playCategory = (category: CategoryId) => {
    setSelectedCategory(category);
    router.push('/category');
  };

  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF1DB', gameTheme.colors.peach]}
      style={[styles.root, { paddingTop: insets.top + 20 }]}
    >
      <GameHeader />
      
      {/* Adventure Heading */}
      <View style={styles.headingRow}>
        <Text style={styles.heading}>{t('chooseAdventure')}</Text>
        <Text style={styles.sparkleIcon}>✨</Text>
      </View>

      {/* Adventure Path with Illustrator Visual Cards */}
      <ScrollView
        contentContainerStyle={[styles.path, { paddingBottom: insets.bottom + 120 }]}
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
          const isFinished = complete >= total && total > 0;

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
                {/* Specific Category Theme Visual Badge */}
                <View style={[styles.illustrationContainer, { backgroundColor: color.glow, borderColor: color.border }]}>
                  <CategoryBadgeVisual category={category} />
                </View>

                {/* Island Details & Progress */}
                <View style={styles.islandCopy}>
                  <View style={styles.categoryTitleRow}>
                    <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
                    {isFinished ? (
                      <View style={styles.trophyBadge}>
                        <Text style={styles.trophyEmoji}>🏆</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.categoryProgress}>
                    {t('wordsProgress', { done: complete, total })}
                  </Text>

                  <View style={styles.chapterRow}>
                    <View style={[styles.chapterPill, { backgroundColor: color.main }]}>
                      <Text style={styles.chapterPillText}>
                        {t('chapterProgress', {
                          current: chapters.currentChapter,
                          total: chapters.totalChapters,
                        })}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.smallTrack}>
                    <View
                      style={[
                        styles.smallFill,
                        { backgroundColor: color.main, width: `${total ? (complete / total) * 100 : 0}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* Play Button Icon */}
                <View style={[styles.playCircle, { backgroundColor: color.main }]}>
                  <Feather name={isFinished ? 'check' : 'play'} size={22} color="#FFFFFF" style={isFinished ? {} : { marginLeft: 2 }} />
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  guideWrapper: {
    marginBottom: 8,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 6,
    marginBottom: 10,
    gap: 6,
  },
  heading: {
    color: gameTheme.colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  sparkleIcon: {
    fontSize: 18,
  },
  path: {
    paddingHorizontal: 18,
    paddingTop: 6,
    gap: 20,
  },
  pathStop: {
    width: '92%',
    zIndex: 1,
  },
  pathLeft: {
    alignSelf: 'flex-start',
  },
  pathRight: {
    alignSelf: 'flex-end',
  },
  pathLine: {
    position: 'absolute',
    bottom: -32,
    width: 84,
    height: 44,
    borderBottomWidth: 5,
    borderColor: '#E8D5B8',
    borderStyle: 'dashed',
    zIndex: -1,
  },
  lineRight: {
    right: -36,
    borderRightWidth: 5,
    borderBottomRightRadius: 34,
  },
  lineLeft: {
    left: -36,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 34,
  },
  island: {
    minHeight: 114,
    borderRadius: 28,
    borderWidth: 3,
    borderBottomWidth: 7,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  islandPressed: {
    transform: [{ scale: 0.98 }, { translateY: 2 }],
  },
  illustrationContainer: {
    width: 78,
    height: 78,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  illustrationImg: {
    width: '88%',
    height: '88%',
  },
  numbersVisualWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  numBlock: {
    width: 21,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  numBlockText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  colorsVisualWrap: {
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
  flagsVisualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeEmoji: {
    fontSize: 36,
  },
  flagMiniWrap: {
    position: 'absolute',
    bottom: -2,
    right: -6,
  },
  flagMiniEmoji: {
    fontSize: 16,
  },
  bodyVisualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  handEmoji: {
    fontSize: 34,
  },
  heartMiniWrap: {
    position: 'absolute',
    bottom: -2,
    right: -4,
  },
  heartMiniEmoji: {
    fontSize: 14,
  },
  sportsVisualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportsEmoji: {
    fontSize: 34,
  },
  trophyMiniWrap: {
    position: 'absolute',
    bottom: -3,
    right: -5,
  },
  trophyMiniEmoji: {
    fontSize: 15,
  },
  categoryEmoji: {
    fontSize: 40,
  },
  islandCopy: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTitle: {
    color: gameTheme.colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  trophyBadge: {
    backgroundColor: '#FFE8A3',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  trophyEmoji: {
    fontSize: 12,
  },
  categoryProgress: {
    color: gameTheme.colors.inkSoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  chapterPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chapterPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  smallTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
    marginTop: 7,
  },
  smallFill: {
    height: '100%',
    borderRadius: 4,
  },
  playCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
