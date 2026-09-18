import * as SMS from 'expo-sms';
import { Alert, Linking, Platform } from 'react-native';
import { SafetyContact } from './types';

export async function openSms(
  contact: SafetyContact,
  body: string
) {
  const phone = contact.phone.replace(/\s+/g, '');

  // Browser preview
  if (Platform.OS === 'web') {
    Alert.alert(
      'Test on iPhone',
      `This will message ${contact.name}:\n\n${body}`
    );

    console.log('RideSafe SMS Preview');
    console.log('To:', phone);
    console.log('Message:', body);

    return;
  }

  // iPhone / Android
  const available = await SMS.isAvailableAsync();

  if (!available) {
    throw new Error('SMS is not available on this device.');
  }

  await SMS.sendSMSAsync([phone], body);
}

export async function callPhone(number: string) {
  const cleanNumber = number.replace(/\s+/g, '');

  if (Platform.OS === 'web') {
    Alert.alert(
      'Test on phone',
      `RideSafe would call ${cleanNumber}`
    );
    return;
  }

  await Linking.openURL(`tel:${cleanNumber}`);
}