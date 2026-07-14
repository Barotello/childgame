import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import WordRound from '@/components/WordRound';
import Celebration from '@/components/Celebration';
import GameHeader from '@/components/GameHeader';
import categories from '@/constants/library';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';
import { playCelebrateSound } from '@/lib/sounds';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

const COINS_PER_LEVEL = 15;

export default function PlayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const {
    currentLevel,
    totalLevels,
    muted,
    hintTokens,
    selectedCategory,
    toggleMute,
    consumeHintToken,
    completeLevel,
    setCurrentLevel,
    setSelectedCategory,
  } = useGameState();

  const { locale } = useI18n();
  const [celebrating, setCelebrating] = useState(false);
  const [hintRequest, setHintRequest] = useState(0);

  const currentWord = words[currentLevel];

  const categoryWords = words.filter((w) => w.category === selectedCategory);
  const currentCategoryIndex = categoryWords.findIndex((w) => w.id === currentWord?.id);
  const hasCategoryWords = categoryWords.length > 0;

  const handleComplete = () => {
    completeLevel(currentLevel);
    setCelebrating(true);
    playCelebrateSound();
    setTimeout(() => {
      setCelebrating(false);
      if (hasCategoryWords) {
        const nextInCategory = categoryWords[currentCategoryIndex + 1];
        if (nextInCategory) {
          const nextIndex = words.findIndex((w) => w.id === nextInCategory.id);
          setCurrentLevel(nextIndex);
        }
      }
    }, 1500);
  };

  const handleHintPress = () => {
    if (hintTokens <= 0) return;
    const consumed = consumeHintToken();
    if (consumed) {
      setHintRequest((n) => n + 1);
    }
  };

  const roundKey = hasCategoryWords && currentWord?.category === selectedCategory
    ? `${currentWord.id}-${currentLevel}-${locale}-${hintRequest}`
    : 'empty';

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 76 }]}
    >
      <GameHeader />

      <View style={styles.levelRow}>
        <Switch
          value={!muted}
          onValueChange={toggleMute}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor="#FFFFFF"
        />
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: hasCategoryWords
                  ? `${((currentCategoryIndex + 1) / categoryWords.length) * 100}%`
                  : `${((currentLevel + 1) / totalLevels) * 100}%`,
              },
            ]}
          />
          <Text style={[styles.progressLabel, { color: colors.foreground }]}>
            {hasCategoryWords
              ? t('level', { current: currentCategoryIndex + 1, total: categoryWords.length })
              : t('level', { current: currentLevel + 1, total: totalLevels })}
          </Text>
        </View>
      </View>

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

      {hasCategoryWords && currentWord?.category === selectedCategory ? (
        <WordRound
          key={roundKey}
          word={currentWord}
          hintRequest={hintRequest}
          onHintApplied={() => {}}
          onComplete={handleComplete}
        />
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="book-open" size={40} color={colors.secondary} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            {t('category' + selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) as any)}
          </Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            Bu kategoride kelime bulmacası yok.{'\n'}Kitaplıkta bu kategoriyi keşfet!
          </Text>
        </View>
      )}

      <Pressable
        onPress={handleHintPress}
        disabled={hintTokens <= 0}
        style={[styles.hintButton, { opacity: hintTokens <= 0 ? 0.4 : 1 }]}
      >
        <Feather name="help-circle" size={18} color={colors.secondary} />
        <Text style={[styles.hintText, { color: colors.secondary }]}>
          {t('hint')} ({hintTokens})
        </Text>
      </Pressable>

      {celebrating ? <Celebration word={currentWord} coinsEarned={COINS_PER_LEVEL} /> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  progressTrack: {
    flex: 1,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 13,
  },
  progressLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
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
  emptyCard: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  hintButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hintText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
