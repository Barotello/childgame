import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GameStateProvider } from '@/lib/gameState';
import { I18nProvider } from '@/lib/i18n';
import { Stack } from 'expo-router';
import ScreenTimeReminder from '@/components/ScreenTimeReminder';

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="category" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GestureHandlerRootView>
          <I18nProvider>
            <GameStateProvider>
              <RootLayoutNav />
              <ScreenTimeReminder />
            </GameStateProvider>
          </I18nProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
