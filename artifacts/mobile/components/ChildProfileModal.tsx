import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useGameState, type ChildProfile } from '@/lib/gameState';
import { useI18n } from '@/lib/i18n';
import {
  CHILD_AVATARS,
  CHILD_SYMBOLS,
  CHILD_COLORS,
  PRESET_NICKNAMES,
  type ChildAvatarItem,
  type ChildSymbolItem,
  type ChildThemeColor,
} from '@/constants/childProfile';
import { playCorrectSound, playCelebrateSound } from '@/lib/sounds';
import { speakWord } from '@/lib/speech';

const { width: SCREEN_W } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
};

export default function ChildProfileModal({ visible, onClose, title }: Props) {
  const insets = useSafeAreaInsets();
  const { t, locale } = useI18n();
  const { profile, setChildProfile } = useGameState();

  const [selectedAvatar, setSelectedAvatar] = useState<ChildAvatarItem>(
    CHILD_AVATARS.find((a) => a.id === profile.avatarId) || CHILD_AVATARS[0],
  );
  const [selectedSymbol, setSelectedSymbol] = useState<ChildSymbolItem>(
    CHILD_SYMBOLS.find((s) => s.id === profile.symbolId) || CHILD_SYMBOLS[0],
  );
  const [selectedColor, setSelectedColor] = useState<ChildThemeColor>(
    CHILD_COLORS.find((c) => c.primary === profile.themeColor) || CHILD_COLORS[0],
  );
  const [name, setName] = useState(profile.name || 'Hero');
  const [activeTab, setActiveTab] = useState<'avatar' | 'symbol' | 'name'>('avatar');

  // Animation values for preview card
  const previewScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      const curAvatar = CHILD_AVATARS.find((a) => a.id === profile.avatarId) || CHILD_AVATARS[0];
      const curSymbol = CHILD_SYMBOLS.find((s) => s.id === profile.symbolId) || CHILD_SYMBOLS[0];
      const curColor = CHILD_COLORS.find((c) => c.primary === profile.themeColor) || CHILD_COLORS[0];
      setSelectedAvatar(curAvatar);
      setSelectedSymbol(curSymbol);
      setSelectedColor(curColor);
      setName(profile.name || 'Hero');
      setActiveTab('avatar');
    }
  }, [visible, profile]);

  const triggerPreviewBump = () => {
    previewScale.value = withSequence(
      withTiming(1.08, { duration: 120 }),
      withSpring(1, { damping: 8, stiffness: 200 }),
    );
  };

  const handleSelectAvatar = (avatar: ChildAvatarItem) => {
    setSelectedAvatar(avatar);
    playCorrectSound();
    speakWord(avatar.name, locale);
    triggerPreviewBump();
  };

  const handleSelectSymbol = (symbol: ChildSymbolItem) => {
    setSelectedSymbol(symbol);
    playCorrectSound();
    speakWord(symbol.name, locale);
    triggerPreviewBump();
  };

  const handleSelectColor = (color: ChildThemeColor) => {
    setSelectedColor(color);
    playCorrectSound();
    triggerPreviewBump();
  };

  const handleSelectNickname = (nick: string) => {
    setName(nick);
    playCorrectSound();
    speakWord(nick, locale);
    triggerPreviewBump();
  };

  const handleSave = () => {
    const finalName = name.trim() || 'Hero';
    setChildProfile({
      name: finalName,
      avatarId: selectedAvatar.id,
      avatarEmoji: selectedAvatar.emoji,
      avatarLabel: selectedAvatar.name,
      symbolId: selectedSymbol.id,
      symbolEmoji: selectedSymbol.emoji,
      symbolLabel: selectedSymbol.name,
      themeColor: selectedColor.primary,
    });
    playCelebrateSound();
    speakWord(`${t('childPraise', { name: finalName })}!`, locale);
    onClose();
  };

  const previewAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: previewScale.value }],
  }));

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            {
              paddingTop: insets.top > 0 ? insets.top + 8 : 16,
              paddingBottom: Math.max(insets.bottom, 16) + 12,
            },
          ]}
        >
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.modalTitle}>{title || t('childProfileTitle')}</Text>
              <Text style={styles.modalSubtitle}>{t('childProfileSubtitle')}</Text>
            </View>
            {profile.isCreated ? (
              <Pressable
                onPress={onClose}
                style={styles.closeBtn}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Feather name="x" size={22} color="#6B5B4D" />
              </Pressable>
            ) : null}
          </View>

          {/* Interactive Live Hero Preview Card */}
          <Animated.View
            style={[
              styles.previewCard,
              {
                backgroundColor: selectedColor.light,
                borderColor: selectedColor.border,
              },
              previewAnimatedStyle,
            ]}
          >
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: selectedAvatar.bg, borderColor: selectedColor.primary },
              ]}
            >
              <Text style={styles.avatarEmoji}>{selectedAvatar.emoji}</Text>
              <View
                style={[
                  styles.symbolBadge,
                  { backgroundColor: selectedColor.primary },
                ]}
              >
                <Text style={styles.symbolBadgeEmoji}>{selectedSymbol.emoji}</Text>
              </View>
            </View>

            <View style={styles.previewInfo}>
              <View style={styles.nameTagRow}>
                <Text style={[styles.previewName, { color: selectedColor.primary }]}>
                  {name.trim() || 'Hero'}
                </Text>
                <Text style={styles.previewSparkle}>✨</Text>
              </View>
              <Text style={styles.previewBadgeLabel}>
                {selectedAvatar.name} • {selectedSymbol.name}
              </Text>
            </View>
          </Animated.View>

          {/* Step Selector Tabs */}
          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setActiveTab('avatar')}
              style={[
                styles.tabBtn,
                activeTab === 'avatar' && {
                  backgroundColor: selectedColor.primary,
                  borderColor: selectedColor.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'avatar' && styles.tabTextActive,
                ]}
              >
                {t('chooseAvatarTab')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('symbol')}
              style={[
                styles.tabBtn,
                activeTab === 'symbol' && {
                  backgroundColor: selectedColor.primary,
                  borderColor: selectedColor.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'symbol' && styles.tabTextActive,
                ]}
              >
                {t('chooseSymbolTab')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('name')}
              style={[
                styles.tabBtn,
                activeTab === 'name' && {
                  backgroundColor: selectedColor.primary,
                  borderColor: selectedColor.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'name' && styles.tabTextActive,
                ]}
              >
                {t('chooseNameTab')}
              </Text>
            </Pressable>
          </View>

          {/* Tab Content */}
          <ScrollView
            contentContainerStyle={styles.tabContentScroll}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'avatar' && (
              <View style={styles.avatarGrid}>
                {CHILD_AVATARS.map((avatar) => {
                  const isSelected = avatar.id === selectedAvatar.id;
                  return (
                    <Pressable
                      key={avatar.id}
                      onPress={() => handleSelectAvatar(avatar)}
                      style={[
                        styles.avatarTile,
                        { backgroundColor: avatar.bg },
                        isSelected && {
                          borderColor: selectedColor.primary,
                          borderWidth: 3.5,
                          transform: [{ scale: 1.06 }],
                          shadowColor: selectedColor.primary,
                          shadowOpacity: 0.35,
                          shadowRadius: 8,
                          elevation: 6,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={avatar.name}
                    >
                      <Text style={styles.avatarTileEmoji}>{avatar.emoji}</Text>
                      <Text style={styles.avatarTileLabel} numberOfLines={1}>
                        {avatar.name}
                      </Text>
                      {isSelected ? (
                        <View
                          style={[
                            styles.checkBadge,
                            { backgroundColor: selectedColor.primary },
                          ]}
                        >
                          <Feather name="check" size={14} color="#FFFFFF" />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {activeTab === 'symbol' && (
              <View style={styles.symbolGrid}>
                {CHILD_SYMBOLS.map((symbol) => {
                  const isSelected = symbol.id === selectedSymbol.id;
                  return (
                    <Pressable
                      key={symbol.id}
                      onPress={() => handleSelectSymbol(symbol)}
                      style={[
                        styles.symbolTile,
                        isSelected && {
                          borderColor: selectedColor.primary,
                          borderWidth: 3.5,
                          transform: [{ scale: 1.08 }],
                          backgroundColor: selectedColor.secondary,
                          shadowColor: selectedColor.primary,
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 6,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={symbol.name}
                    >
                      <Text style={styles.symbolTileEmoji}>{symbol.emoji}</Text>
                      <Text style={styles.symbolTileLabel} numberOfLines={1}>
                        {symbol.name}
                      </Text>
                      {isSelected ? (
                        <View
                          style={[
                            styles.checkBadge,
                            { backgroundColor: selectedColor.primary },
                          ]}
                        >
                          <Feather name="check" size={14} color="#FFFFFF" />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {activeTab === 'name' && (
              <View style={styles.nameSection}>
                {/* Custom Name Input */}
                <View style={styles.inputWrapper}>
                  <Feather name="edit-3" size={20} color={selectedColor.primary} style={{ marginRight: 8 }} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder={t('heroNamePlaceholder')}
                    placeholderTextColor="#A89F91"
                    maxLength={16}
                    style={styles.nameInput}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                  {name.length > 0 ? (
                    <Pressable onPress={() => setName('')} hitSlop={8}>
                      <Feather name="x-circle" size={18} color="#A89F91" />
                    </Pressable>
                  ) : null}
                </View>

                {/* Quick Nickname Pills */}
                <Text style={styles.subSectionTitle}>{t('presetNamesLabel')}</Text>
                <View style={styles.nicknameGrid}>
                  {PRESET_NICKNAMES.map((nick) => {
                    const isSelected = name.toLowerCase() === nick.toLowerCase();
                    return (
                      <Pressable
                        key={nick}
                        onPress={() => handleSelectNickname(nick)}
                        style={[
                          styles.nickPill,
                          isSelected && {
                            backgroundColor: selectedColor.primary,
                            borderColor: selectedColor.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.nickPillText,
                            isSelected && { color: '#FFFFFF' },
                          ]}
                        >
                          {nick}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Favorite Color Picker */}
                <Text style={[styles.subSectionTitle, { marginTop: 16 }]}>
                  Favorite Magic Color:
                </Text>
                <View style={styles.colorsGrid}>
                  {CHILD_COLORS.map((color) => {
                    const isSelected = color.id === selectedColor.id;
                    return (
                      <Pressable
                        key={color.id}
                        onPress={() => handleSelectColor(color)}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color.primary },
                          isSelected && {
                            borderColor: '#FFFFFF',
                            borderWidth: 4,
                            transform: [{ scale: 1.15 }],
                            shadowColor: color.primary,
                            shadowOpacity: 0.5,
                            shadowRadius: 8,
                            elevation: 6,
                          },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={color.name}
                      >
                        {isSelected ? <Feather name="check" size={20} color="#FFFFFF" /> : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Save Button */}
          <View style={styles.footerWrap}>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('saveProfileButton')}
            >
              <LinearGradient
                colors={[selectedColor.primary, selectedColor.border]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.saveBtnGradient}
              >
                <Text style={styles.saveBtnIcon}>🚀</Text>
                <Text style={styles.saveBtnText}>{t('saveProfileButton')}</Text>
                <Feather name="chevron-right" size={24} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(40, 28, 60, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFDF9',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    maxHeight: '92%',
    paddingHorizontal: 20,
    borderTopWidth: 4,
    borderColor: '#FFECC8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3D315B',
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A7E72',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3EFEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    borderWidth: 2.5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 34,
  },
  symbolBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  symbolBadgeEmoji: {
    fontSize: 13,
  },
  previewInfo: {
    flex: 1,
    marginLeft: 14,
  },
  nameTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  previewSparkle: {
    fontSize: 16,
  },
  previewBadgeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7A6E63',
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F3EDE2',
    borderRadius: 18,
    padding: 4,
    gap: 4,
    marginBottom: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#7D7063',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContentScroll: {
    paddingVertical: 4,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  avatarTile: {
    width: (SCREEN_W - 60) / 2,
    minHeight: 74,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#EFE5D8',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  avatarTileEmoji: {
    fontSize: 32,
  },
  avatarTileLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    color: '#3D315B',
  },
  symbolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  symbolTile: {
    width: (SCREEN_W - 60) / 2,
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#EFE5D8',
    backgroundColor: '#FFFFFF',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  symbolTileEmoji: {
    fontSize: 28,
  },
  symbolTileLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    color: '#3D315B',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    paddingVertical: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#EFE5D8',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    color: '#3D315B',
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#7D7063',
    marginBottom: 8,
  },
  nicknameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nickPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EFE5D8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  nickPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3D315B',
  },
  colorsGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  footerWrap: {
    marginTop: 10,
    zIndex: 10,
  },
  saveBtn: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  saveBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#FFFFFF80',
    gap: 8,
  },
  saveBtnIcon: {
    fontSize: 20,
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
