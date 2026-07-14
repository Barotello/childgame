import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import WordRound from '@/components/WordRound';
import Celebration from '@/components/Celebration';
import GameHeader from '@/components/GameHeader';
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
    toggleMute,
    consumeHintToken,
    completeLevel,
    setCurrentLevel,
  } = useGameState();

  const [celebrating, setCelebrating] = useState(false);
  const [hintRequest, setHintRequest] = useState(0);

  const currentWord = words[currentLevel];
  const roundKey = `${currentWord.id}-${currentLevel}`;

  const handleComplete = () => {
    completeLevel(currentLevel);
    setCelebrating(true);
    playCelebrateSound();
    setTimeout(() => {
      setCelebrating(false);
      if (currentLevel < totalLevels - 1) {
        setCurrentLevel(currentLevel + 1);
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
                width: `${((currentLevel + 1) / totalLevels) * 100}%`,
              },
            ]}
          />
          <Text style={[styles.progressLabel, { color: colors.foreground }]}>
            {t('level', { current: currentLevel + 1, total: totalLevels })}
          </Text>
        </View>
      </View>

      <WordRound
        key={roundKey}
        word={currentWord}
        hintRequest={hintRequest}
        onHintApplied={() => {}}
        onComplete={handleComplete}
      />

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
