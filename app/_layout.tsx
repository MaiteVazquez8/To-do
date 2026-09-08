import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Toast } from '@/components/Toast';
import { strings } from '@/constants/strings';
import { useTheme } from '@/hooks/useTheme';

export default function RootLayout() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="task/new"
          options={{ title: strings.screenTitles.newTask, presentation: 'modal' }}
        />
        <Stack.Screen
          name="task/[id]"
          options={{ title: strings.screenTitles.editTask, presentation: 'modal' }}
        />
      </Stack>
      <Toast />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}