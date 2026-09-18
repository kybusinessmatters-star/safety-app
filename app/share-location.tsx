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
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

import { Screen } from '@/components/Screen';
import { getSafetyContact } from '@/lib/storage';
import { useAppLanguage } from '@/lib/useAppLanguage';
import { useAppTheme } from '@/lib/theme';

export default function ShareLocation() {
  const { language, t } = useAppLanguage();
  const { theme } = useAppTheme();

  const [contact, setContact] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);

  const [status, setStatus] = useState('');
  const [locationLink, setLocationLink] = useState('');

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
      console.error('SHARE LOCATION CONTACT ERROR:', error);
      setContact(null);
    }
  }

  async function shareCurrentLocation() {
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
      setStatus(
        language === 'hy'
          ? 'Ստանում ենք ձեր գտնվելու վայրը...'
          : 'Getting your location...'
      );

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setStatus(
          language === 'hy'
            ? 'Գտնվելու վայրի թույլտվությունը մերժված է։'
            : 'Location permission was denied.'
        );

        Alert.alert(
          language === 'hy'
            ? 'Գտնվելու վայրի թույլտվություն է պետք'
            : 'Location Permission Needed',
          language === 'hy'
            ? 'RideSafe-ին անհրաժեշտ է ձեր գտնվելու վայրը՝ այն անվտանգության կոնտակտին ուղարկելու համար։'
            : 'RideSafe needs access to your location so it can share it with your safety contact.'
        );

        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const { latitude, longitude } =
        currentLocation.coords;

      const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

      setLocationLink(mapsUrl);

      const message =
        language === 'hy'
          ? `Ես կիսվում եմ իմ ընթացիկ գտնվելու վայրով RideSafe-ի միջոցով։\n\nԻմ գտնվելու վայրը՝ ${mapsUrl}`
          : `I'm sharing my current location with you through RideSafe.\n\nMy location: ${mapsUrl}`;

      // Browser preview
      if (Platform.OS === 'web') {
        setStatus(
          `✓ Location ready\n\nTo: ${contact.name}\n${contact.phone}\n\n${message}\n\nTest on your phone to open Messages.`
        );

        return;
      }

      const smsAvailable =
        await SMS.isAvailableAsync();

      if (!smsAvailable) {
        setStatus(
          language === 'hy'
            ? 'SMS-ը հասանելի չէ այս սարքում։'
            : 'SMS is not available on this device.'
        );

        return;
      }

      setStatus(
        language === 'hy'
          ? 'Բացվում է Messages-ը...'
          : 'Opening Messages...'
      );

      await SMS.sendSMSAsync(
        [contact.phone.replace(/\s+/g, '')],
        message
      );

      setStatus(
        language === 'hy'
          ? '✓ Գտնվելու վայրը պատրաստ է ուղարկելու։'
          : '✓ Location message prepared.'
      );
    } catch (error) {
      console.error(
        'SHARE LOCATION ERROR:',
        error
      );

      setStatus(
        language === 'hy'
          ? 'Չհաջողվեց ստանալ կամ կիսվել գտնվելու վայրով։'
          : 'Could not get or share your location.'
      );

      Alert.alert(
        language === 'hy'
          ? 'Սխալ'
          : 'Could Not Share Location',
        language === 'hy'
          ? 'Խնդրում ենք նորից փորձել։'
          : 'Please try again.'
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
        {t.shareLocation}
      </Text>

      <Text
        style={[
          styles.description,
          { color: theme.secondaryText },
        ]}
      >
        {language === 'hy'
          ? 'Կիսվեք ձեր ընթացիկ գտնվելու վայրով ձեր անվտանգության կոնտակտի հետ։'
          : 'Share your current location with your saved safety contact.'}
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
              styles.button,
              {
                backgroundColor: theme.accent,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            onPress={shareCurrentLocation}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.accentText },
              ]}
            >
              📍{' '}
              {language === 'hy'
                ? 'Կիսվել իմ գտնվելու վայրով'
                : 'Share My Location'}
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

          {locationLink !== '' && (
            <Text
              style={[
                styles.locationText,
                { color: theme.secondaryText },
              ]}
            >
              {language === 'hy'
                ? 'Վերջին գտնվելու վայրի հղումը պատրաստ է։'
                : 'Your latest location link is ready.'}
            </Text>
          )}
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
              ? 'Նախ ավելացրեք վստահելի անձ, ում հետ կարող եք կիսվել ձեր գտնվելու վայրով։'
              : 'Add someone you trust before sharing your location.'}
          </Text>

          <Pressable
            style={[
              styles.button,
              { backgroundColor: theme.accent },
            ]}
            onPress={() =>
              router.push('/safety-contact')
            }
          >
            <Text
              style={[
                styles.buttonText,
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

      <Text
        style={[
          styles.helper,
          { color: theme.secondaryText },
        ]}
      >
        {Platform.OS === 'web'
          ? 'Web preview mode — test on your phone for GPS and Messages.'
          : language === 'hy'
          ? 'RideSafe-ը կբացի պատրաստ հաղորդագրություն՝ ձեր գտնվելու վայրի հղումով։'
          : 'RideSafe will open a ready-to-send message containing your location link.'}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '800',
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 28,
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
    marginBottom: 20,
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

  button: {
    padding: 17,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
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

  locationText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 12,
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

  helper: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 20,
  },
});