import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useI18n } from '@/lib/i18n';

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
  store: { bg: '#FFAC4A', border: '#E08520' },
};

const CHILD_TABS = new Set(['journey', 'library', 'store']);

function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index]?.name;
  if (currentRoute === 'game' || currentRoute === 'settings') return null;

  const visibleRoutes = state.routes.filter((route) => CHILD_TABS.has(route.name));

  return (
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
          title: t('rewards'),
          tabBarIcon: ({ color, size }) => <Feather name="award" size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="game" options={{ href: null }} />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#F0E6FF',
    paddingHorizontal: 22,
    shadowColor: '#3B2F63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  jellyButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  jellyHighlight: {
    position: 'absolute',
    top: 3,
    left: '15%',
    right: '15%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B2F63',
  },
});
