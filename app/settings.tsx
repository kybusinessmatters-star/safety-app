import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { Screen } from '@/components/Screen';
import {
  getDiscreetMode,
  getSafetyContact,
  setDiscreetMode,
} from '@/lib/storage';
import { useAppLanguage } from '@/lib/useAppLanguage';
import { ThemePreference, useAppTheme } from '@/lib/theme';

export default function Settings() {
  const { language, setLanguage, t } = useAppLanguage();
  const { theme, preference, setPreference } = useAppTheme();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [discreet, setDiscreet] = useState(false);

  // Load discreet mode
  useEffect(() => {
    getDiscreetMode().then(setDiscreet);
  }, []);

  // Reload safety contact whenever user returns to Settings
  useFocusEffect(
    useCallback(() => {
      getSafetyContact().then((contact) => {
        if (contact) {
          setName(contact.name);
          setPhone(contact.phone);
        } else {
          setName('');
          setPhone('');
        }
      });
    }, [])
  );

  const choices: { label: string; value: ThemePreference }[] = [
    {
      label: language === 'hy' ? 'Համակարգային' : 'System',
      value: 'system',
    },
    {
      label: language === 'hy' ? 'Լուսավոր' : 'Light',
      value: 'light',
    },
    {
      label: language === 'hy' ? 'Մութ' : 'Dark',
      value: 'dark',
    },
  ];

  const pill = (active: boolean) => ({
    backgroundColor: active ? theme.selected : theme.surface,
    borderColor: active ? theme.selectedBorder : theme.border,
  });

  return (
    <Screen>
      <Text style={[styles.h1, { color: theme.text }]}>
        {t.settings}
      </Text>

      {/* Language */}
      <Text style={[styles.label, { color: theme.text }]}>
        {t.language}
      </Text>

      <View style={styles.row}>
        <Pressable
          style={[styles.pill, pill(language === 'en')]}
          onPress={() => setLanguage('en')}
        >
          <Text style={{ color: theme.text }}>English</Text>
        </Pressable>

        <Pressable
          style={[styles.pill, pill(language === 'hy')]}
          onPress={() => setLanguage('hy')}
        >
          <Text style={{ color: theme.text }}>Հայերեն</Text>
        </Pressable>
      </View>

      {/* Appearance */}
      <Text
        style={[
          styles.label,
          {
            color: theme.text,
            marginTop: 24,
          },
        ]}
      >
        {language === 'hy' ? 'Տեսք' : 'Appearance'}
      </Text>

      <View style={styles.row}>
        {choices.map((choice) => (
          <Pressable
            key={choice.value}
            style={[
              styles.pill,
              pill(preference === choice.value),
            ]}
            onPress={() => setPreference(choice.value)}
          >
            <Text style={{ color: theme.text }}>
              {choice.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text
        style={[
          styles.help,
          {
            color: theme.secondaryText,
            marginTop: 8,
          },
        ]}
      >
        {language === 'hy'
          ? '«Համակարգային»-ը հետևում է հեռախոսի լուսավոր կամ մութ ռեժիմին։'
          : 'System follows your phone’s Light/Dark appearance.'}
      </Text>

      {/* Safety Contact */}
      <Text
        style={[
          styles.label,
          {
            color: theme.text,
            marginTop: 28,
          },
        ]}
      >
        {language === 'hy'
          ? 'Անվտանգության կոնտակտ'
          : 'Safety Contact'}
      </Text>

      <Pressable
        style={[
          styles.contactCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
        onPress={() => router.push('/safety-contact')}
      >
        <View style={styles.contactInfo}>
          <View
            style={[
              styles.contactIcon,
              {
                backgroundColor: theme.selected,
              },
            ]}
          >
            <Text
              style={[
                styles.contactIconText,
                { color: theme.text },
              ]}
            >
              {name ? name.charAt(0).toUpperCase() : '+'}
            </Text>
          </View>

          <View>
            <Text
              style={[
                styles.contactTitle,
                { color: theme.text },
              ]}
            >
              {name || t.addContact}
            </Text>

            <Text
              style={[
                styles.help,
                { color: theme.secondaryText },
              ]}
            >
              {phone ||
                (language === 'hy'
                  ? 'Ավելացրեք վստահելի անձ'
                  : 'Add someone you trust')}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.chevron,
            { color: theme.secondaryText },
          ]}
        >
          ›
        </Text>
      </Pressable>

      {/* Discreet Mode */}
      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            marginTop: 28,
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.label,
              { color: theme.text },
            ]}
          >
            {t.discreet}
          </Text>

          <Text
            style={[
              styles.help,
              { color: theme.secondaryText },
            ]}
          >
            {language === 'hy'
              ? 'Ցույց է տալիս չեզոք տեսք ունեցող գլխավոր էջ։'
              : 'Shows a neutral-looking home screen.'}
          </Text>
        </View>

        <Switch
          value={discreet}
          onValueChange={async (value) => {
            setDiscreet(value);
            await setDiscreetMode(value);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  pill: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 99,
  },

  help: {
    maxWidth: 280,
    lineHeight: 19,
  },

  contactCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactIconText: {
    fontSize: 20,
    fontWeight: '700',
  },

  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },

  chevron: {
    fontSize: 30,
    fontWeight: '300',
  },
});