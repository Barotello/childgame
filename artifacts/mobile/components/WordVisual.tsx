import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import type { WordItem } from '@/constants/words';

type WordVisualProps = {
  word: WordItem;
  style?: StyleProp<ViewStyle>;
  emojiSize?: number;
};

export function getFlagUrl(word: WordItem): string | null {
  if (word.category === 'flags' || word.id?.startsWith('flag_')) {
    const code = word.id.replace('flag_', '').toLowerCase();
    return `https://flagcdn.com/w320/${code}.png`;
  }
  return null;
}

export default function WordVisual({ word, style, emojiSize = 72 }: WordVisualProps) {
  const lightSwatch = word.swatch?.toLowerCase() === '#ffffff' || word.swatch?.toLowerCase() === '#fff';
  const flagUrl = getFlagUrl(word);

  return (
    <View style={[styles.root, style]}>
      {word.image ? (
        <Image source={word.image} style={styles.image} contentFit="contain" />
      ) : flagUrl ? (
        <View style={styles.flagOuter}>
          <View style={styles.flagInnerCard}>
            <Image
              source={{ uri: flagUrl }}
              style={styles.flagImage}
              contentFit="contain"
              transition={150}
            />
          </View>
        </View>
      ) : word.swatch ? (
        <View
          style={[
            styles.swatch,
            {
              backgroundColor: word.swatch,
              borderColor: lightSwatch ? '#D8CFE6' : '#FFFFFF',
            },
          ]}
        >
          <View style={styles.swatchShine} />
        </View>
      ) : (
        <Text style={[styles.emoji, { fontSize: emojiSize }]}>{word.emoji}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
  image: { width: '100%', height: '100%' },
  flagOuter: {
    width: '92%',
    height: '84%',
    maxHeight: 145,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2D9CD',
    backgroundColor: '#F6EFE6',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagInnerCard: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D8CDC0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  swatch: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchShine: {
    position: 'absolute',
    top: 6,
    left: 12,
    width: '38%',
    height: '24%',
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ rotate: '-25deg' }],
  },
  emoji: { textAlign: 'center' },
});
