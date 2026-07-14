import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GameHeader from '@/components/GameHeader';
import { useColors } from '@/hooks/useColors';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

export default function StoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { coins, hintTokens, skipTokens, hintCost, hintPackCost, hintPackSize, buyHint, buyHintPack } =
    useGameState();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  const handleBuyHint = () => {
    const success = buyHint();
    notify(success ? t('purchaseHintSuccess') : t('purchaseHintFail'));
  };

  const handleBuyPack = () => {
    const success = buyHintPack();
    notify(success ? t('purchasePackSuccess', { n: hintPackSize }) : t('purchaseHintFail'));
  };

  return (
    <LinearGradient
      colors={['#FFF8EC', '#FFE8CF']}
      style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}
    >
      <GameHeader />
      <Text style={[styles.subtitle, { color: colors.foreground }]}>{t('store')}</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="help-circle" size={22} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {t('hintTokens', { n: hintTokens })}
            </Text>
          </View>
          <Text style={[styles.cardHint, { color: colors.mutedForeground }]}>{t('hintDesc')}</Text>

          <Pressable
            onPress={handleBuyHint}
            disabled={coins < hintCost}
            style={[styles.buyRow, { borderColor: colors.border, opacity: coins < hintCost ? 0.5 : 1 }]}
          >
            <Text style={[styles.buyLabel, { color: colors.foreground }]}>{t('buyHint1')}</Text>
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
            <Text style={[styles.buyLabel, { color: colors.foreground }]}>
              {t('buyHint5', { n: hintPackSize })}
            </Text>
            <View style={[styles.priceBadge, { backgroundColor: colors.accent }]}>
              <Feather name="star" size={13} color={colors.accentForeground} />
              <Text style={[styles.priceText, { color: colors.accentForeground }]}>{hintPackCost}</Text>
            </View>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="skip-forward" size={22} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {t('skipTokens', { n: skipTokens })}
            </Text>
          </View>
          <Text style={[styles.cardHint, { color: colors.mutedForeground }]}>{t('skipDesc')}</Text>
        </View>
      </ScrollView>

      {toastMessage ? (
        <View style={[styles.toast, { bottom: insets.bottom + 100, backgroundColor: colors.foreground }]}>
          <Feather name="info" size={18} color={colors.background} />
          <Text style={[styles.toastText, { color: colors.background }]}>{toastMessage}</Text>
        </View>
      ) : null}
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
    paddingBottom: 20,
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
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
