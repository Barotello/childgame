import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '@/components/GameHeader';
import categories from '@/constants/library';
import words from '@/constants/words';
import { gameTheme } from '@/constants/gameTheme';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

type RewardCardProps = {
  emoji: string;
  title: string;
  progress: string;
  unlocked: boolean;
  color: string;
};

function RewardCard({ emoji, title, progress, unlocked, color }: RewardCardProps) {
  return (
    <View style={[styles.rewardCard, !unlocked && styles.lockedReward]}>
      <View style={[styles.rewardIcon, { backgroundColor: `${color}24`, borderColor: color }]}>
        <Text style={styles.rewardEmoji}>{emoji}</Text>
        {unlocked ? (
          <View style={styles.checkBadge}><Feather name="check" size={13} color="#FFFFFF" /></View>
        ) : (
          <View style={styles.lockBadge}><Feather name="lock" size={13} color={gameTheme.colors.inkSoft} /></View>
        )}
      </View>
      <Text style={styles.rewardTitle}>{title}</Text>
      <Text style={styles.rewardProgress}>{progress}</Text>
    </View>
  );
}

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { completedLevels } = useGameState();
  const completeCount = completedLevels.length;

  return (
    <LinearGradient
      colors={[gameTheme.colors.cream, '#FFF1DB', gameTheme.colors.peach]}
      style={[styles.root, { paddingTop: insets.top + 10 }]}
    >
      <GameHeader />
      <View style={styles.heading}>
        <Text style={styles.title}>{t('yourRewards')}</Text>
        <Text style={styles.subtitle}>{t('rewardsBody')}</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 126 }]}
        showsVerticalScrollIndicator={false}
      >
        <RewardCard
          emoji="🌟"
          title={t('wordCollector')}
          progress={t('rewardProgress', { done: Math.min(completeCount, 5), total: 5 })}
          unlocked={completeCount >= 5}
          color={gameTheme.colors.sunshine}
        />
        <RewardCard
          emoji="🏆"
          title={t('categoryChampion')}
          progress={t('rewardProgress', {
            done: Math.min(
              categories.filter((category) => {
                const indexes = words
                  .map((word, index) => ({ word, index }))
                  .filter(({ word }) => word.category === category.id)
                  .map(({ index }) => index);
                return indexes.length > 0 && indexes.every((index) => completedLevels.includes(index));
              }).length,
              1,
            ),
            total: 1,
          })}
          unlocked={categories.some((category) => {
            const indexes = words
              .map((word, index) => ({ word, index }))
              .filter(({ word }) => word.category === category.id)
              .map(({ index }) => index);
            return indexes.length > 0 && indexes.every((index) => completedLevels.includes(index));
          })}
          color={gameTheme.colors.coral}
        />
        <RewardCard emoji="🧠" title={t('superLearner')} progress={t('rewardProgress', { done: Math.min(completeCount, 20), total: 20 })} unlocked={completeCount >= 20} color={gameTheme.colors.sky} />
        <RewardCard emoji="🚀" title={t('wordExplorer')} progress={t('rewardProgress', { done: Math.min(completeCount, 50), total: 50 })} unlocked={completeCount >= 50} color={gameTheme.colors.mint} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heading: { paddingHorizontal: 20, marginBottom: 18 },
  title: { color: gameTheme.colors.ink, fontSize: 24, fontWeight: '900' },
  subtitle: { color: gameTheme.colors.inkSoft, fontSize: 13, lineHeight: 19, fontWeight: '700', marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 14 },
  rewardCard: {
    width: '47.8%',
    minHeight: 210,
    backgroundColor: gameTheme.colors.white,
    borderWidth: 2,
    borderColor: gameTheme.colors.outline,
    borderRadius: 28,
    alignItems: 'center',
    padding: 15,
  },
  lockedReward: { opacity: 0.68 },
  rewardIcon: { width: 116, height: 116, borderRadius: 38, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  rewardEmoji: { fontSize: 62 },
  checkBadge: { position: 'absolute', top: -7, right: -7, width: 30, height: 30, borderRadius: 15, backgroundColor: gameTheme.colors.mint, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  lockBadge: { position: 'absolute', top: -7, right: -7, width: 30, height: 30, borderRadius: 15, backgroundColor: '#EEE8F2', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  rewardTitle: { color: gameTheme.colors.ink, fontSize: 15, fontWeight: '900', textAlign: 'center', marginTop: 12 },
  rewardProgress: { color: gameTheme.colors.inkSoft, fontSize: 12, fontWeight: '700', marginTop: 5 },
});
