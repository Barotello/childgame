import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Feather from '@expo/vector-icons/Feather';
import { gameTheme } from '@/constants/gameTheme';

type MascotGuideProps = {
  message: string;
  onPress?: () => void;
};

export default function MascotGuide({ message, onPress }: MascotGuideProps) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Image source={require('../assets/images/mino.png')} style={styles.image} contentFit="contain" />
      </View>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [styles.bubble, pressed && styles.pressed]}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={message}
      >
        <View style={styles.tail} />
        <Text style={styles.message}>{message}</Text>
        {onPress ? <Feather name="volume-2" size={18} color={gameTheme.colors.sky} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF4DF',
    borderWidth: 3,
    borderColor: gameTheme.colors.sunshine,
    overflow: 'hidden',
    shadowColor: gameTheme.colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: gameTheme.colors.white,
    borderWidth: 2,
    borderColor: '#E8DCF8',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  tail: {
    position: 'absolute',
    left: -8,
    width: 16,
    height: 16,
    backgroundColor: gameTheme.colors.white,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#E8DCF8',
    transform: [{ rotate: '45deg' }],
  },
  message: {
    flex: 1,
    color: gameTheme.colors.ink,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },
});
