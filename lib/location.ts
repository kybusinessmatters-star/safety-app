import * as Location from 'expo-location';
import * as Crypto from 'expo-crypto';

import { LOCATION_TASK } from './backgroundLocation';
import {
  ensureAnonymousUser,
  supabase,
} from './supabase';
import {
  setActiveSessionId,
  setLowBatterySent,
} from './storage';
import { SafetySessionType } from './types';

export async function requestLocationPermissions() {
  const foreground =
    await Location.requestForegroundPermissionsAsync();

  if (!foreground.granted) {
    throw new Error(
      'Foreground location permission is required.'
    );
  }

  const background =
    await Location.requestBackgroundPermissionsAsync();

  return {
    foreground: foreground.granted,
    background: background.granted,
  };
}

export async function startLiveSession(
  type: SafetySessionType,
  destination?: string
) {
  if (!supabase) {
    throw new Error(
      'Live tracking is not configured yet. Supabase credentials are missing.'
    );
  }

  const user = await ensureAnonymousUser();

  const permissions =
    await requestLocationPermissions();

  const shareToken = Crypto.randomUUID();

  const {
    data,
    error,
  } = await supabase
    .from('safety_sessions')
    .insert({
      user_id: user.id,
      type,
      share_token: shareToken,
      destination:
        destination?.trim() || null,
      status: 'active',
    })
    .select('id, share_token')
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      'Could not create live tracking session.'
    );
  }

  await setActiveSessionId(data.id);
  await setLowBatterySent(false);

  const currentLocation =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

  const {
    error: firstLocationError,
  } = await supabase
    .from('location_points')
    .insert({
      session_id: data.id,
      latitude:
        currentLocation.coords.latitude,
      longitude:
        currentLocation.coords.longitude,
      accuracy:
        currentLocation.coords.accuracy,
      recorded_at: new Date(
        currentLocation.timestamp
      ).toISOString(),
    });

  if (firstLocationError) {
    throw firstLocationError;
  }

  // Background permission may not be available
  // in Expo Go. Foreground location still works.
  if (permissions.background) {
    const alreadyStarted =
      await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK
      );

    if (!alreadyStarted) {
      await Location.startLocationUpdatesAsync(
        LOCATION_TASK,
        {
          accuracy: Location.Accuracy.High,

          // Try to update about every 15 seconds.
          timeInterval: 15000,

          // Or after roughly 20 meters of movement.
          distanceInterval: 20,

          pausesUpdatesAutomatically: false,

          showsBackgroundLocationIndicator: true,

          foregroundService: {
            notificationTitle:
              'RideSafe location sharing',

            notificationBody:
              'Your live location is being shared.',
          },
        }
      );
    }
  }

  return {
    id: data.id as string,
    shareToken:
      data.share_token as string,
    backgroundTracking:
      permissions.background,
  };
}

export async function endLiveSession(
  sessionId: string
) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const {
    error,
  } = await supabase
    .from('safety_sessions')
    .update({
      ended_at:
        new Date().toISOString(),
      status: 'ended',
    })
    .eq('id', sessionId);

  if (error) {
    throw error;
  }

  await setActiveSessionId(null);

  const started =
    await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK
    );

  if (started) {
    await Location.stopLocationUpdatesAsync(
      LOCATION_TASK
    );
  }
}

export function viewerUrl(
  token: string
) {
  const base =
    process.env.EXPO_PUBLIC_VIEWER_URL;

  if (!base) {
    throw new Error(
      'EXPO_PUBLIC_VIEWER_URL is not configured.'
    );
  }

  return `${base}?token=${encodeURIComponent(
    token
  )}`;
}