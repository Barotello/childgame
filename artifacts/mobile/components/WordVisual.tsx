import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import type { WordItem } from '@/constants/words';

type WordVisualProps = {
  word: WordItem;
  style?: StyleProp<ViewStyle>;
  emojiSize?: number;
};

export default function WordVisual({ word, style, emojiSize = 72 }: WordVisualProps) {
  const lightSwatch = word.swatch?.toLowerCase() === '#ffffff' || word.swatch?.toLowerCase() === '#fff';

  return (
    <View style={[styles.root, style]}>
      {word.image ? (
        <Image source={word.image} style={styles.image} contentFit="contain" />
      ) : word.swatch ? (
        <View
          style={[
            styles.swatch,
            {
              backgroundColor: word.swatch,
              borderColor: lightSwatch ? '#CFC3DC' : '#FFFFFF',
            },
          ]}
        />
      ) : (
        <Text style={[styles.emoji, { fontSize: emojiSize }]}>{word.emoji}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  swatch: {
    width: '72%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 4,
  },
  emoji: { textAlign: 'center' },
});
