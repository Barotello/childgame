import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameHeader from '@/components/GameHeader';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';

export default function StoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { coins, hintTokens, hintCost, hintPackCost, hintPackSize, muted, toggleMute, buyHint, buyHintPack } =
    useGameState();

  const notify = (message: string) => {
    if (Platform.OS === 'web') {
      // Alert.alert has no visible UI on web; fall back silently since the
      // coin/token counters already update immediately.
      return;
    }
    Alert.alert(message);
  };

  const handleBuyHint = () => {
    const success = buyHint();
    notify(success ? '1 ipucu satın alındı!' : 'Yetersiz coin');
  };

  const handleBuyPack = () => {
    const success = buyHintPack();
    notify(success ? `${hintPackSize} ipucu satın alındı!` : 'Yetersiz coin');
  };

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>Mağaza</Text>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="help-circle" size={22} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>İpucu jetonun: {hintTokens}</Text>
          </View>
          <Text style={[styles.cardHint, { color: colors.mutedForeground }]}>
            Bir kelimede takılırsan ipucu kullanarak doğru harfi kutuya otomatik yerleştirebilirsin.
          </Text>

          <Pressable
            onPress={handleBuyHint}
            disabled={coins < hintCost}
            style={[styles.buyRow, { borderColor: colors.border, opacity: coins < hintCost ? 0.5 : 1 }]}
          >
            <Text style={[styles.buyLabel, { color: colors.foreground }]}>1 İpucu</Text>
            <View style={[styles.priceBadge, { backgroundColor: colors.accent }]}>
              <Feather name="star" size={13} color={colors.accentForeground} />
              <Text style={[styles.priceText, { color: colors.accentForeground }]}>{hintCost}</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleBuyPack}
            disabled={coins < hintPackCost}
            style={[styles.buyRow, { borderColor: colors.border, opacity: coins < hintPackCost ? 0.5 : 1 }]}
          >
            <Text style={[styles.buyLabel, { color: colors.foreground }]}>{hintPackSize} İpucu Paketi</Text>
            <View style={[styles.priceBadge, { backgroundColor: colors.accent }]}>
              <Feather name="star" size={13} color={colors.accentForeground} />
              <Text style={[styles.priceText, { color: colors.accentForeground }]}>{hintPackCost}</Text>
            </View>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="volume-2" size={22} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Ses efektleri</Text>
          </View>
          <View style={styles.soundRow}>
            <Text style={[styles.buyLabel, { color: colors.foreground }]}>{muted ? 'Kapalı' : 'Açık'}</Text>
            <Switch
              value={!muted}
              onValueChange={toggleMute}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardHint: {
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  buyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  buyLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '800',
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
