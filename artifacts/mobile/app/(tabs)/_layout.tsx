import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useI18n } from '@/lib/i18n';
import ParentGate from '@/components/ParentGate';

type Route = { key: string; name: string; params?: object };

type TabDescriptor = {
  options: {
    title?: string;
    tabBarIcon?: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
    href?: string | null;
  };
  navigation: any;
};

type TabBarProps = {
  state: { index: number; routes: Route[] };
  descriptors: Record<string, TabDescriptor>;
  navigation: {
    navigate: (name: string, params?: object) => void;
    emit: (event: { type: string; target: string; canPreventDefault: boolean }) => {
      defaultPrevented: boolean;
    };
  };
};

const TAB_COLORS: Record<string, { bg: string; border: string }> = {
  journey: { bg: '#93D656', border: '#5DAE30' },
  library: { bg: '#56A8DF', border: '#327EBC' },
  store: { bg: '#FFB703', border: '#D97706' },
  settings: { bg: '#9D4EDD', border: '#7826BA' },
};

const CHILD_TABS = new Set(['journey', 'library', 'store', 'settings']);

function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const [showParentGate, setShowParentGate] = useState(false);
  const currentRoute = state.routes[state.index]?.name;
  if (currentRoute === 'game') return null;

  const visibleRoutes = state.routes.filter((route) => CHILD_TABS.has(route.name));

  return (
    <>
      <View style={[styles.container, { bottom: insets.bottom + 12 }]}>
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];
          const routeIndex = state.routes.findIndex((item) => item.key === route.key);
          const isFocused = state.index === routeIndex;
          const colorData = TAB_COLORS[route.name] || TAB_COLORS.journey;

          const icon = options.tabBarIcon
            ? options.tabBarIcon({ focused: isFocused, color: '#FFFFFF', size: 24 })
            : null;

          const onPress = () => {
            if (route.name === 'settings' && !isFocused) {
              setShowParentGate(true);
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.title}
            >
              <View
                style={[
                  styles.jellyButton,
                  {
                    backgroundColor: colorData.bg,
                    borderColor: colorData.border,
                    transform: [{ scale: isFocused ? 1.08 : 0.92 }],
                    opacity: isFocused ? 1 : 0.72,
                  },
                ]}
              >
                <View style={styles.jellyHighlight} />
                {icon}
              </View>
              {options.title ? (
                <Text
                  style={[styles.tabLabel, { opacity: isFocused ? 1 : 0.65 }]}
                  numberOfLines={1}
                >
                  {options.title}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <ParentGate
        visible={showParentGate}
        onClose={() => setShowParentGate(false)}
        onSuccess={() => {
          setShowParentGate(false);
          navigation.navigate('settings');
        }}
      />
    </>
  );
}

export default function TabsLayout() {
  const colors = useColors();
  const { t } = useI18n();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...(props as unknown as TabBarProps)} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="journey"
        options={{
          title: t('journey'),
          tabBarIcon: ({ color, size }) => <Feather name="map" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('explore'),
          tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: t('yourRewards'),
          tabBarIcon: ({ color, size }) => <Feather name="award" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('parentArea'),
          tabBarIcon: ({ color, size }) => <Feather name="shield" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="game" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFDF9',
    borderRadius: 36,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 2.5,
    borderColor: '#EFE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  jellyButton: {
    width: 52,
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  jellyHighlight: {
    position: 'absolute',
    top: 3,
    left: 6,
    right: 6,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#603E22',
  },
});
