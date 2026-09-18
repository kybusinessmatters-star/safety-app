import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Screen } from '@/components/Screen';
import { callPhone, openSms } from '@/lib/messages';
import { getSafetyContact } from '@/lib/storage';
import { useAppLanguage } from '@/lib/useAppLanguage';
import { useAppTheme } from '@/lib/theme';

export default function Emergency() {
  const { language, t } = useAppLanguage();
  const { theme } = useAppTheme();

  const [contact, setContact] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadContact();
    }, [])
  );

  async function loadContact() {
    try {
      const savedContact = await getSafetyContact();
      setContact(savedContact);
    } catch (error) {
      console.error('EMERGENCY CONTACT ERROR:', error);
      setContact(null);
    }
  }

  async function call112() {
    try {
      await callPhone('112');
    } catch (error) {
      console.error('112 CALL ERROR:', error);

      Alert.alert(
        'Could not start call',
        'RideSafe could not open the phone app.'
      );
    }
  }

  async function alertContact() {
    if (!contact) {
      Alert.alert(
        language === 'hy'
          ? 'Անվտանգության կոնտակտ չկա'
          : 'No Safety Contact',
        language === 'hy'
          ? 'Նախ ավելացրեք անվտանգության կոնտակտ։'
          : 'Please add a safety contact first.',
        [
          {
            text: language === 'hy' ? 'Չեղարկել' : 'Cancel',
            style: 'cancel',
          },
          {
            text:
              language === 'hy'
                ? 'Ավելացնել'
                : 'Add Contact',
            onPress: () => router.push('/safety-contact'),
          },
        ]
      );

      return;
    }

    const message =
      language === 'hy'
        ? 'ԱՐՏԱԿԱՐԳ ԻՐԱՎԻՃԱԿ։ Ինձ օգնություն է պետք։ Խնդրում եմ անմիջապես զանգիր ինձ։ — Ուղարկված է RideSafe-ից'
        : 'EMERGENCY: I need help. Please call me immediately. — Sent from RideSafe';

    try {
      await openSms(contact, message);
    } catch (error) {
      console.error('EMERGENCY SMS ERROR:', error);

      Alert.alert(
        'Could not open Messages',
        'RideSafe could not prepare the emergency message.'
      );
    }
  }

  async function callSafetyContact() {
    if (!contact) {
      Alert.alert(
        language === 'hy'
          ? 'Անվտանգության կոնտակտ չկա'
          : 'No Safety Contact',
        language === 'hy'
          ? 'Նախ ավելացրեք անվտանգության կոնտակտ։'
          : 'Please add a safety contact first.',
        [
          {
            text: language === 'hy' ? 'Չեղարկել' : 'Cancel',
            style: 'cancel',
          },
          {
            text:
              language === 'hy'
                ? 'Ավելացնել'
                : 'Add Contact',
            onPress: () => router.push('/safety-contact'),
          },
        ]
      );

      return;
    }

    try {
      await callPhone(contact.phone);
    } catch (error) {
      console.error('SAFETY CONTACT CALL ERROR:', error);

      Alert.alert(
        'Could not start call',
        'RideSafe could not open the phone app.'
      );
    }
  }

  return (
    <Screen>
      <Text
        style={[
          styles.h1,
          { color: theme.text },
        ]}
      >
        🆘 {t.emergency}
      </Text>

      <Text
        style={[
          styles.note,
          { color: theme.secondaryText },
        ]}
      >
        {language === 'hy'
          ? 'Եթե դուք անմիջական վտանգի մեջ եք, զանգահարեք 112։ Կարող եք նաև տեղեկացնել կամ զանգահարել ձեր անվտանգության կոնտակտին։'
          : 'If you are in immediate danger, call 112. You can also alert or call your safety contact.'}
      </Text>

      {/* Call 112 */}

      <Pressable
        style={styles.call112}
        onPress={call112}
      >
        <Text style={styles.whiteText}>
          📞 {t.call112}
        </Text>
      </Pressable>

      {/* Alert Safety Contact */}

      <Pressable
        style={[
          styles.alertContact,
          { backgroundColor: theme.accent },
        ]}
        onPress={alertContact}
      >
        <Text
          style={[
            styles.buttonText,
            { color: theme.accentText },
          ]}
        >
          📍 {t.alertContact}
        </Text>
      </Pressable>

      {/* Call Safety Contact */}

      <Pressable
        style={[
          styles.callContact,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
        onPress={callSafetyContact}
      >
        <Text
          style={[
            styles.callContactTitle,
            { color: theme.text },
          ]}
        >
          📞{' '}
          {language === 'hy'
            ? 'Զանգահարել անվտանգության կոնտակտին'
            : 'Call Safety Contact'}
        </Text>
      </Pressable>

      <Text
        style={[
          styles.helper,
          { color: theme.secondaryText },
        ]}
      >
        {language === 'hy'
          ? 'RideSafe-ը բացում է համապատասխան զանգի կամ հաղորդագրության գործառույթը։'
          : 'RideSafe opens the appropriate phone or messaging action.'}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    fontWeight: '900',
  },

  note: {
    marginVertical: 18,
    lineHeight: 21,
  },

  call112: {
    backgroundColor: '#B00000',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },

  alertContact: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 12,
  },

  callContact: {
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 12,
  },

  whiteText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
  },

  buttonText: {
    fontWeight: '900',
    fontSize: 17,
  },

  callContactTitle: {
    fontWeight: '900',
    fontSize: 17,
  },

  helper: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },
});