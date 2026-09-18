import { useCallback, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as SMS from 'expo-sms';

import { getSafetyContact } from '@/lib/storage';
import { useAppLanguage } from '@/lib/useAppLanguage';
import { useAppTheme } from '@/lib/theme';

export default function CallMeScreen() {
  const { language } = useAppLanguage();
  const { theme } = useAppTheme();

  const [contact, setContact] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);

  const [status, setStatus] = useState('');

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
      console.error('CALL ME CONTACT ERROR:', error);
      setContact(null);
    }
  }

  async function requestCall() {
    if (!contact) {
      setStatus('Please add a Safety Contact first.');
      return;
    }

    const message =
      language === 'hy'
        ? 'Կարո՞ղ ես հիմա զանգել ինձ։ — Ուղարկված է RideSafe-ից'
        : 'Can you call me right now? — Sent from RideSafe';

    // WEB PREVIEW
    if (Platform.OS === 'web') {
      setStatus(
        `✓ Request ready\n\nTo: ${contact.name}\n${contact.phone}\n\n"${message}"\n\nTest on your iPhone to open Messages.`
      );

      console.log('CALL ME TEST');
      console.log('To:', contact.phone);
      console.log('Message:', message);

      return;
    }

    // REAL PHONE
    try {
      setStatus('Opening Messages...');

      const available = await SMS.isAvailableAsync();

      if (!available) {
        setStatus('SMS is not available on this device.');
        return;
      }

      await SMS.sendSMSAsync(
        [contact.phone.replace(/\s+/g, '')],
        message
      );

      setStatus('✓ Message composer opened.');
    } catch (error) {
      console.error('SMS ERROR:', error);

      setStatus('Could not open Messages.');

      Alert.alert(
        'Could not open Messages',
        'RideSafe could not open your messaging app.'
      );
    }
  }

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.back,
              { color: theme.accent },
            ]}
          >
            ‹
          </Text>
        </Pressable>

        <Text
          style={[
            styles.title,
            { color: theme.text },
          ]}
        >
          {language === 'hy' ? 'Զանգիր ինձ' : 'Call Me'}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <Text
        style={[
          styles.description,
          { color: theme.secondaryText },
        ]}
      >
        {language === 'hy'
          ? 'Խնդրեք ձեր անվտանգության կոնտակտին անմիջապես զանգահարել ձեզ։'
          : 'Ask your safety contact to call you immediately.'}
      </Text>

      {contact ? (
        <>
          <Text
            style={[
              styles.sectionLabel,
              { color: theme.secondaryText },
            ]}
          >
            {language === 'hy'
              ? 'ԱՆՎՏԱՆԳՈՒԹՅԱՆ ԿՈՆՏԱԿՏ'
              : 'SAFETY CONTACT'}
          </Text>

          <View
            style={[
              styles.contactCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.selected },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  { color: theme.text },
                ]}
              >
                {contact.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View>
              <Text
                style={[
                  styles.contactName,
                  { color: theme.text },
                ]}
              >
                {contact.name}
              </Text>

              <Text
                style={[
                  styles.contactPhone,
                  { color: theme.secondaryText },
                ]}
              >
                {contact.phone}
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={requestCall}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { color: theme.accentText },
              ]}
            >
              {language === 'hy'
                ? 'Խնդրել զանգահարել'
                : 'Request a Call'}
            </Text>
          </Pressable>

          {status !== '' && (
            <View
              style={[
                styles.statusBox,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: theme.text },
                ]}
              >
                {status}
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.helper,
              { color: theme.secondaryText },
            ]}
          >
            {Platform.OS === 'web'
              ? 'Web preview mode — SMS will open when tested on your phone.'
              : language === 'hy'
              ? 'RideSafe-ը կբացի պատրաստ հաղորդագրություն։'
              : 'RideSafe will open a ready-to-send message.'}
          </Text>
        </>
      ) : (
        <View
          style={[
            styles.noContactCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.noContactTitle,
              { color: theme.text },
            ]}
          >
            {language === 'hy'
              ? 'Անվտանգության կոնտակտ չկա'
              : 'No Safety Contact'}
          </Text>

          <Text
            style={[
              styles.noContactDescription,
              { color: theme.secondaryText },
            ]}
          >
            {language === 'hy'
              ? 'Նախ ավելացրեք վստահելի անձ։'
              : 'Add someone you trust before using Call Me.'}
          </Text>

          <Pressable
            style={[
              styles.primaryButton,
              { backgroundColor: theme.accent },
            ]}
            onPress={() => router.push('/safety-contact')}
          >
            <Text
              style={[
                styles.primaryButtonText,
                { color: theme.accentText },
              ]}
            >
              {language === 'hy'
                ? 'Ավելացնել կոնտակտ'
                : 'Add Safety Contact'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  backButton: {
    width: 40,
  },

  back: {
    fontSize: 38,
    lineHeight: 40,
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
  },

  headerSpacer: {
    width: 40,
  },

  description: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 34,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },

  contactCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },

  contactName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },

  contactPhone: {
    fontSize: 14,
  },

  primaryButton: {
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 18,
    alignItems: 'center',
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },

  statusBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },

  statusText: {
    fontSize: 14,
    lineHeight: 21,
  },

  helper: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
    paddingHorizontal: 15,
  },

  noContactCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },

  noContactTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 7,
  },

  noContactDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
});