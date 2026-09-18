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

export default function UnsafeScreen() {
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
      console.error('UNSAFE CONTACT ERROR:', error);
      setContact(null);
    }
  }

  async function alertSafetyContact() {
    if (!contact) {
      setStatus('Please add a Safety Contact first.');
      return;
    }

    const message =
      language === 'hy'
        ? 'Ես հիմա ինձ անվտանգ չեմ զգում։ Խնդրում եմ զանգիր ինձ և ստուգիր՝ արդյոք ամեն ինչ կարգին է։ — Ուղարկված է RideSafe-ից'
        : 'I feel unsafe right now. Please call me and check on me as soon as possible. — Sent from RideSafe';

    // Web preview
    if (Platform.OS === 'web') {
      setStatus(
        `✓ Alert ready\n\nTo: ${contact.name}\n${contact.phone}\n\n"${message}"\n\nTest on your phone to open Messages.`
      );
      return;
    }

    // iPhone / Android
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

      setStatus('✓ Safety alert prepared.');
    } catch (error) {
      console.error('UNSAFE SMS ERROR:', error);

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
      {/* Header */}

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
          {language === 'hy'
            ? 'Ես ինձ անվտանգ չեմ զգում'
            : 'I Feel Unsafe'}
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
          ? 'Արագ տեղեկացրեք ձեր անվտանգության կոնտակտին, որ ձեզ անվտանգ չեք զգում։'
          : 'Quickly let your safety contact know that you feel unsafe.'}
      </Text>

      {/* Safety Contact */}

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

          {/* Warning */}

          <View
            style={[
              styles.warningBox,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={styles.warningIcon}>⚠️</Text>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.warningTitle,
                  { color: theme.text },
                ]}
              >
                {language === 'hy'
                  ? 'Անվտանգության ահազանգ'
                  : 'Safety Alert'}
              </Text>

              <Text
                style={[
                  styles.warningText,
                  { color: theme.secondaryText },
                ]}
              >
                {language === 'hy'
                  ? 'Ձեր կոնտակտին կպատրաստվի հրատապ հաղորդագրություն։'
                  : 'An urgent message will be prepared for your safety contact.'}
              </Text>
            </View>
          </View>

          {/* Alert Button */}

          <Pressable
            style={({ pressed }) => [
              styles.alertButton,
              {
                backgroundColor: theme.danger,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            onPress={alertSafetyContact}
          >
            <Text style={styles.alertButtonText}>
              {language === 'hy'
                ? 'Տեղեկացնել անվտանգության կոնտակտին'
                : 'Alert Safety Contact'}
            </Text>
          </Pressable>

          {/* Status */}

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
              ? 'Web preview mode — test on your phone to open Messages.'
              : language === 'hy'
              ? 'Դուք կկարողանաք ստուգել հաղորդագրությունը նախքան ուղարկելը։'
              : 'You can review the message before sending it.'}
          </Text>
        </>
      ) : (
        /* No Safety Contact */

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
              ? 'Այս գործառույթն օգտագործելու համար նախ ավելացրեք վստահելի անձ։'
              : 'Add someone you trust before using this safety feature.'}
          </Text>

          <Pressable
            style={[
              styles.addButton,
              { backgroundColor: theme.accent },
            ]}
            onPress={() => router.push('/safety-contact')}
          >
            <Text
              style={[
                styles.addButtonText,
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

      {/* Emergency distinction */}

      <Pressable
        style={styles.emergencyLink}
        onPress={() => router.push('/emergency')}
      >
        <Text
          style={[
            styles.emergencyText,
            { color: theme.danger },
          ]}
        >
          {language === 'hy'
            ? 'Արտակարգ իրավիճա՞կ է։ Բացել Emergency →'
            : 'Is this an emergency? Open Emergency →'}
        </Text>
      </Pressable>
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
    marginBottom: 16,
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

  warningBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  warningIcon: {
    fontSize: 22,
  },

  warningTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },

  warningText: {
    fontSize: 13,
    lineHeight: 19,
  },

  alertButton: {
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 18,
    alignItems: 'center',
  },

  alertButtonText: {
    color: '#FFFFFF',
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

  addButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },

  emergencyLink: {
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 12,
  },

  emergencyText: {
    fontSize: 14,
    fontWeight: '700',
  },
});