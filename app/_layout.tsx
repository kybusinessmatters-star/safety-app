import '@/lib/backgroundLocation';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { prepareNotifications } from '@/lib/notifications';
import { AppThemeProvider, useAppTheme } from '@/lib/theme';

function Navigation() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  useEffect(() => {
    prepareNotifications().catch(() => {});
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url;
      if (typeof url === 'string') router.push(url as any);
    });
    return () => sub.remove();
  }, [router]);

  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background },
        statusBarStyle: isDark ? 'light' : 'dark',
      }}
    />
  );
}

export default function RootLayout() {
  return <AppThemeProvider><Navigation /></AppThemeProvider>;
}
