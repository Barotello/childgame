import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import WordRound from '@/components/WordRound';
import Celebration from '@/components/Celebration';
import words from '@/constants/words';
import { useColors } from '@/hooks/useColors';

function shuffleWords() {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GameScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const playlist = useMemo(shuffleWords, []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const currentWord = playlist[roundIndex % playlist.length];
  const roundKey = `${currentWord.id}-${roundIndex}`;
  const progressPosition = roundIndex % playlist.length;

  const handleComplete = () => {
    setScore((s) => s + 1);
    setCelebrating(true);
    setTimeout(() => {
      setCelebrating(false);
      setRoundIndex((i) => i + 1);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
    >
      <View style={styles.header}>
        <View style={styles.progressRow}>
          {playlist.map((item, index) => {
            const isDone = index < progressPosition;
            const isCurrent = index === progressPosition;
            return (
              <View
                key={item.id}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isDone || isCurrent ? colors.primary : colors.border,
                    width: isCurrent ? 12 : 8,
                    height: isCurrent ? 12 : 8,
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.scoreBadge}>
          <Feather name="star" size={16} color={colors.accent} />
          <Text style={[styles.scoreText, { color: colors.foreground }]}>{score}</Text>
        </View>
      </View>

      <WordRound key={roundKey} word={currentWord} onComplete={handleComplete} />

      {celebrating ? <Celebration word={currentWord} /> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 6,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
