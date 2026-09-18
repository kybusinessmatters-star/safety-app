import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/lib/theme';

export function ActionCard({ icon, title, subtitle, onPress, danger = false }: { icon: string; title: string; subtitle?: string; onPress: () => void; danger?: boolean }) {
  const { theme } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={[styles.card,{ backgroundColor: danger ? theme.dangerSurface : theme.surface, borderColor: danger ? theme.dangerBorder : theme.border }]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title,{ color: danger ? theme.danger : theme.text }]}>{title}</Text>
        {!!subtitle && <Text style={[styles.subtitle,{ color: theme.secondaryText }]}>{subtitle}</Text>}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  icon: { fontSize: 28 },
  title: { fontSize: 17, fontWeight: '700' },
  subtitle: { marginTop: 3, fontSize: 13, lineHeight: 18 },
});
