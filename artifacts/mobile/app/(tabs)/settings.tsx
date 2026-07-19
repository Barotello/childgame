import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '@/components/GameHeader';
import { learningSummary, practiceWordIds } from '@/constants/learning';
import { LOCALE_FLAGS, LOCALE_LABELS } from '@/constants/translations';
import words from '@/constants/words';
import { gameTheme } from '@/constants/gameTheme';
import { useGameState } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';

export default function ParentCenterScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale, setLocale, availableLocales } = useI18n();
  const {
    muted,
    toggleMute,
    completedLevels,
    totalLevels,
    dailyGoal,
    setDailyGoal,
    screenTimeMinutes,
    setScreenTimeMinutes,
    coins,
    hintTokens,
    hintCost,
    hintPackCost,
    hintPackSize,
    buyHint,
    buyHintPack,
    learningRecords,
  } = useGameState();
  const [notice, setNotice] = useState<string | null>(null);
  const learning = learningSummary(learningRecords);
  const practiceWords = practiceWordIds(learningRecords)
    .map((wordId) => words.find((word) => word.id === wordId))
    .filter((word): word is (typeof words)[number] => word !== undefined);

  const purchase = (pack: boolean) => {
    const success = pack ? buyHintPack() : buyHint();
    setNotice(
      success
        ? pack
          ? t('purchasePackSuccess', { n: hintPackSize })
          : t('purchaseHintSuccess')
        : t('purchaseHintFail'),
    );
  };

  return (
    <LinearGradient
      colors={['#F6F1FA', '#FFF9EE', '#FCE9DD']}
      style={[styles.root, { paddingTop: insets.top + 10 }]}
    >
      <GameHeader onBack={() => router.replace('/journey')} />
      <View style={styles.heading}>
        <View style={styles.headingIcon}><Feather name="shield" size={24} color="#FFFFFF" /></View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>{t('parentDashboard')}</Text>
          <Text style={styles.subtitle}>{t('parentDashboardBody')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedLevels.length}/{totalLevels}</Text>
            <Text style={styles.statLabel}>{t('wordsCompletedLabel')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{coins} ★</Text>
            <Text style={styles.statLabel}>{t('coins')}</Text>
          </View>
        </View>

        <Section icon="bar-chart-2" title={t('learningInsights')}>
          <View style={styles.insightGrid}>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>{learning.attempts > 0 ? `${learning.accuracy}%` : '—'}</Text>
              <Text style={styles.insightLabel}>{t('overallAccuracy')}</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>{learning.masteredWords}</Text>
              <Text style={styles.insightLabel}>{t('masteredWordsLabel')}</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>{learning.needsPracticeWords}</Text>
              <Text style={styles.insightLabel}>{t('wordsToPractice')}</Text>
            </View>
          </View>
          {practiceWords.length > 0 ? (
            <View style={styles.practiceWords}>
              {practiceWords.map((word) => (
                <View key={word.id} style={styles.practiceWordRow}>
                  <Text style={styles.practiceEmoji}>{word.emoji || '⭐'}</Text>
                  <Text style={styles.practiceWordLabel}>{word.spellings[locale]}</Text>
                  <View style={styles.practiceBadge}>
                    <Text style={styles.practiceBadgeText}>{t('practiceAgain')}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.sectionDescription}>{t('noLearningData')}</Text>
          )}
        </Section>

        <Section icon="target" title={t('dailyGoal')}>
          <View style={styles.choiceRow}>
            {[2, 3, 5].map((goal) => (
              <ChoiceButton key={goal} selected={dailyGoal === goal} label={`${goal}`} onPress={() => setDailyGoal(goal)} />
            ))}
          </View>
        </Section>

        <Section icon="clock" title={t('screenTime')}>
          <View style={styles.choiceRowWrap}>
            {[15, 20, 30, 45].map((minutes) => (
              <ChoiceButton
                key={minutes}
                selected={screenTimeMinutes === minutes}
                label={t('minutes', { n: minutes })}
                onPress={() => setScreenTimeMinutes(minutes)}
              />
            ))}
          </View>
        </Section>

        <Section icon="globe" title={t('language')}>
          <View style={styles.languageGrid}>
            {availableLocales.map((lang) => {
              const selected = lang === locale;
              return (
                <Pressable
                  key={lang}
                  onPress={() => setLocale(lang)}
                  style={[styles.languageButton, selected && styles.languageSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={LOCALE_LABELS[lang]}
                >
                  <Text style={styles.flag}>{LOCALE_FLAGS[lang]}</Text>
                  <Text style={styles.languageLabel}>{LOCALE_LABELS[lang]}</Text>
                  {selected ? <Feather name="check-circle" size={17} color={gameTheme.colors.mint} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section icon="volume-2" title={t('soundEffects')}>
          <View style={styles.settingRow}>
            <Text style={styles.settingValue}>{muted ? t('soundOff') : t('soundOn')}</Text>
            <Switch
              value={!muted}
              onValueChange={toggleMute}
              trackColor={{ false: gameTheme.colors.outline, true: gameTheme.colors.mint }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Section>

        <Section icon="shopping-bag" title={t('parentStore')}>
          <Text style={styles.sectionDescription}>{t('parentStoreBody', { n: hintTokens })}</Text>
          <PurchaseRow label={t('buyHint1')} price={hintCost} disabled={coins < hintCost} onPress={() => purchase(false)} />
          <PurchaseRow label={t('buyHint5', { n: hintPackSize })} price={hintPackCost} disabled={coins < hintPackCost} onPress={() => purchase(true)} />
          {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        </Section>
      </ScrollView>
    </LinearGradient>
  );
}

function Section({ icon, title, children }: { icon: keyof typeof Feather.glyphMap; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}><Feather name={icon} size={20} color={gameTheme.colors.sky} /></View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ChoiceButton({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceSelected]}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function PurchaseRow({ label, price, disabled, onPress }: { label: string; price: number; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.purchaseRow, disabled && styles.disabled]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={`${label}, ${price}`}
    >
      <Text style={styles.purchaseLabel}>{label}</Text>
      <View style={styles.priceBadge}><Feather name="star" size={13} color="#7B5A00" /><Text style={styles.price}>{price}</Text></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  heading: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  headingIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: gameTheme.colors.coral, alignItems: 'center', justifyContent: 'center' },
  headingCopy: { flex: 1 },
  title: { color: gameTheme.colors.ink, fontSize: 22, fontWeight: '900' },
  subtitle: { color: gameTheme.colors.inkSoft, fontSize: 12, lineHeight: 17, fontWeight: '700', marginTop: 2 },
  content: { paddingHorizontal: 20, gap: 14 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: gameTheme.colors.white, borderWidth: 2, borderColor: gameTheme.colors.outline, borderRadius: 22, padding: 16 },
  statValue: { color: gameTheme.colors.ink, fontSize: 22, fontWeight: '900' },
  statLabel: { color: gameTheme.colors.inkSoft, fontSize: 12, fontWeight: '700', marginTop: 3 },
  insightGrid: { flexDirection: 'row', gap: 8 },
  insightCard: { flex: 1, minHeight: 82, borderRadius: 17, backgroundColor: '#F8F5EF', padding: 10, justifyContent: 'center' },
  insightValue: { color: gameTheme.colors.ink, fontSize: 20, fontWeight: '900' },
  insightLabel: { color: gameTheme.colors.inkSoft, fontSize: 10, lineHeight: 13, fontWeight: '700', marginTop: 3 },
  practiceWords: { marginTop: 12, gap: 7 },
  practiceWordRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 9, borderTopWidth: 1, borderColor: '#F0E7DA', paddingTop: 7 },
  practiceEmoji: { fontSize: 24 },
  practiceWordLabel: { flex: 1, color: gameTheme.colors.ink, fontSize: 14, fontWeight: '900', textTransform: 'capitalize' },
  practiceBadge: { backgroundColor: '#FFF0E8', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5 },
  practiceBadgeText: { color: '#A95D37', fontSize: 10, fontWeight: '900' },
  section: { backgroundColor: gameTheme.colors.white, borderWidth: 2, borderColor: gameTheme.colors.outline, borderRadius: 24, padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 },
  sectionIcon: { width: 36, height: 36, borderRadius: 14, backgroundColor: gameTheme.colors.skySoft, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: gameTheme.colors.ink, fontSize: 16, fontWeight: '900' },
  sectionDescription: { color: gameTheme.colors.inkSoft, fontSize: 12, lineHeight: 17, fontWeight: '600', marginBottom: 8 },
  choiceRow: { flexDirection: 'row', gap: 10 },
  choiceRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  choice: { minWidth: 58, minHeight: 46, paddingHorizontal: 14, borderRadius: 16, borderWidth: 2, borderColor: gameTheme.colors.outline, alignItems: 'center', justifyContent: 'center' },
  choiceSelected: { backgroundColor: gameTheme.colors.skySoft, borderColor: gameTheme.colors.sky },
  choiceText: { color: gameTheme.colors.inkSoft, fontSize: 13, fontWeight: '800' },
  choiceTextSelected: { color: gameTheme.colors.ink },
  languageGrid: { gap: 8 },
  languageButton: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, borderWidth: 2, borderColor: '#EEE5D9', paddingHorizontal: 12 },
  languageSelected: { backgroundColor: gameTheme.colors.mintSoft, borderColor: gameTheme.colors.mint },
  flag: { fontSize: 22 },
  languageLabel: { flex: 1, color: gameTheme.colors.ink, fontSize: 14, fontWeight: '800' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingValue: { color: gameTheme.colors.ink, fontSize: 14, fontWeight: '800' },
  purchaseRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#F0E7DA' },
  disabled: { opacity: 0.45 },
  purchaseLabel: { color: gameTheme.colors.ink, fontSize: 14, fontWeight: '800' },
  priceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: gameTheme.colors.sunshine, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  price: { color: '#7B5A00', fontSize: 13, fontWeight: '900' },
  notice: { color: gameTheme.colors.coral, fontSize: 12, fontWeight: '800', marginTop: 7 },
});
