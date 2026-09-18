import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/lib/theme';

export function Screen({ children }: { children: ReactNode }) {
  const { theme } = useAppTheme();
  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, flexGrow: 1 }}>{children}</ScrollView></SafeAreaView>;
}
export function StaticScreen({ children }: { children: ReactNode }) {
  const { theme } = useAppTheme();
  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}><View style={{ padding: 20, flexGrow: 1 }}>{children}</View></SafeAreaView>;
}
