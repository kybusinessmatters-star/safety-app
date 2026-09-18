import { Platform } from 'react-native';
import Storage from 'expo-sqlite/kv-store';
import { SafetyContact } from './types';

const CONTACT_KEY = 'safety_contact';
const DISCREET_KEY = 'discreet_mode';
const ACTIVE_SESSION_KEY = 'active_session';
const LOW_BATTERY_SENT_KEY = 'low_battery_sent';

// ------------------------------------
// Cross-platform storage helpers
// ------------------------------------

async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(key, value);
    return;
  }

  await Storage.setItem(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(key);
  }

  return await Storage.getItem(key);
}

async function removeItem(key: string) {
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(key);
    return;
  }

  await Storage.removeItem(key);
}

// ------------------------------------
// Safety Contact
// ------------------------------------

export async function getSafetyContact(): Promise<SafetyContact | null> {
  try {
    const raw = await getItem(CONTACT_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as SafetyContact;
  } catch (error) {
    console.error('Failed to load safety contact:', error);
    return null;
  }
}

export async function saveSafetyContact(contact: SafetyContact) {
  const data = JSON.stringify(contact);

  await setItem(CONTACT_KEY, data);
}

export async function deleteSafetyContact() {
  await removeItem(CONTACT_KEY);
}

// ------------------------------------
// Discreet Mode
// ------------------------------------

export async function getDiscreetMode() {
  return (await getItem(DISCREET_KEY)) === 'true';
}

export async function setDiscreetMode(value: boolean) {
  await setItem(
    DISCREET_KEY,
    value ? 'true' : 'false'
  );
}

// ------------------------------------
// Active Safety Session
// ------------------------------------

export async function setActiveSessionId(id: string | null) {
  if (id) {
    await setItem(ACTIVE_SESSION_KEY, id);
  } else {
    await removeItem(ACTIVE_SESSION_KEY);
  }
}

export async function getActiveSessionId() {
  return await getItem(ACTIVE_SESSION_KEY);
}

// ------------------------------------
// Low Battery Alert
// ------------------------------------

export async function setLowBatterySent(value: boolean) {
  await setItem(
    LOW_BATTERY_SENT_KEY,
    value ? 'true' : 'false'
  );
}

export async function getLowBatterySent() {
  return (await getItem(LOW_BATTERY_SENT_KEY)) === 'true';
}