import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import Storage from 'expo-sqlite/kv-store';

export type ThemePreference = 'system' | 'light' | 'dark';

export const lightTheme = {
  mode: 'light' as const,
  background: '#F6F7F9',
  surface: '#FFFFFF',
  text: '#111114',
  secondaryText: '#666A73',
  border: '#E7E8EC',
  accent: '#111114',
  accentText: '#FFFFFF',
  selected: '#DFE9FF',
  selectedBorder: '#7890B8',
  danger: '#A40000',
  dangerSurface: '#FFF7F7',
  dangerBorder: '#E7AAAA',
};

export const darkTheme = {
  mode: 'dark' as const,
  background: '#0D0D0F',
  surface: '#1A1A1D',
  text: '#F5F5F7',
  secondaryText: '#A1A1AA',
  border: '#2A2A2E',
  accent: '#F5F5F7',
  accentText: '#111114',
  selected: '#27344D',
  selectedBorder: '#6F8CC5',
  danger: '#FF6868',
  dangerSurface: '#2A1718',
  dangerBorder: '#63383B',
};

const THEME_KEY = 'theme_preference';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => Promise<void>;
  theme: typeof lightTheme | typeof darkTheme;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    Storage.getItem(THEME_KEY).then((value) => {
      if (value === 'light' || value === 'dark' || value === 'system') setPreferenceState(value);
    });
  }, []);

  async function setPreference(value: ThemePreference) {
    setPreferenceState(value);
    await Storage.setItem(THEME_KEY, value);
  }

  const isDark = preference === 'dark' || (preference === 'system' && system === 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  const value = useMemo(() => ({ preference, setPreference, theme, isDark }), [preference, theme, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useAppTheme must be used inside AppThemeProvider');
  return value;
}
