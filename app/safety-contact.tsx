import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Crypto from 'expo-crypto';

import {
  deleteSafetyContact,
  getSafetyContact,
  saveSafetyContact,
} from '@/lib/storage';

export default function SafetyContactScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasContact, setHasContact] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadContact();
  }, []);

  async function loadContact() {
    try {
      const contact = await getSafetyContact();

      if (contact) {
        setName(contact.name);
        setPhone(contact.phone);
        setContactId(contact.id);
        setHasContact(true);
      }
    } catch (error) {
      console.error('LOAD CONTACT ERROR:', error);
    }
  }

  async function handleSave() {
    console.log('SAVE BUTTON PRESSED');

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanPhone) {
      setMessage('Please enter a name and phone number.');

      Alert.alert(
        'Missing information',
        'Please enter a name and phone number.'
      );

      return;
    }

    try {
      setSaving(true);
      setMessage('Saving...');

      const id = contactId || Crypto.randomUUID();

      const contact = {
        id,
        name: cleanName,
        phone: cleanPhone,
      };

      console.log('SAVING CONTACT:', contact);

      await saveSafetyContact(contact);

      console.log('CONTACT SAVED');

      const savedContact = await getSafetyContact();

      console.log('CONTACT READ BACK:', savedContact);

      if (!savedContact) {
        throw new Error('Contact could not be read back from storage.');
      }

      setContactId(savedContact.id);
      setName(savedContact.name);
      setPhone(savedContact.phone);
      setHasContact(true);

      setMessage('✓ Safety contact saved');

      Alert.alert(
        'Safety contact saved',
        `${savedContact.name} is now your safety contact.`
      );
    } catch (error) {
      console.error('SAVE CONTACT ERROR:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown storage error';

      setMessage(`Could not save: ${errorMessage}`);

      Alert.alert(
        'Could not save contact',
        errorMessage
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteSafetyContact();

      setName('');
      setPhone('');
      setContactId(null);
      setHasContact(false);
      setMessage('Contact removed.');

      Alert.alert('Contact removed');
    } catch (error) {
      console.error('DELETE CONTACT ERROR:', error);

      setMessage('Could not remove contact.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          {hasContact ? 'Safety Contact' : 'Add Safety Contact'}
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.description}>
        This person can be contacted quickly when you use RideSafe safety
        features.
      </Text>

      <Text style={styles.label}>Name</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Mom"
        placeholderTextColor="#7D8799"
        style={styles.input}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Phone Number</Text>

      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="+374 99 000 000"
        placeholderTextColor="#7D8799"
        style={styles.input}
        keyboardType="phone-pad"
        autoComplete="tel"
      />

      <Pressable
        style={[
          styles.saveButton,
          saving && styles.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>
          {saving
            ? 'Saving...'
            : hasContact
            ? 'Save Changes'
            : 'Save Contact'}
        </Text>
      </Pressable>

      {!!message && (
        <Text
          style={[
            styles.status,
            {
              color: message.startsWith('✓')
                ? '#34C759'
                : '#9BA6B8',
            },
          ]}
        >
          {message}
        </Text>
      )}

      {hasContact && (
        <Pressable
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteText}>
            Remove Safety Contact
          </Text>
        </Pressable>
      )}

      <Text style={styles.privacy}>
        Contact information is stored locally on this device.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B0D11',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  back: {
    color: '#2F7CFF',
    fontSize: 38,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  description: {
    color: '#9BA6B8',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 30,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#17191E',
    borderColor: '#292D35',
    borderWidth: 1,
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 22,
  },

  saveButton: {
    backgroundColor: '#1769FF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  status: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
  },

  deleteButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  deleteText: {
    color: '#FF5A5F',
    fontSize: 15,
    fontWeight: '600',
  },

  privacy: {
    color: '#6F7888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});