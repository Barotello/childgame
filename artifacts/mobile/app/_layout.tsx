import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GameStateProvider } from '@/lib/gameState';
import { I18nProvider } from '@/lib/i18n';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
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
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = 'Mino: Word Adventure';
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Head>
        <title>Mino: Word Adventure</title>
        <meta name="description" content="Fun, offline & ad-free English word puzzle adventure for kids ages 4-7 with Mino." />
      </Head>
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

