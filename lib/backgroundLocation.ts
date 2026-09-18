import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';

import { supabase } from './supabase';
import {
  getActiveSessionId,
  getLowBatterySent,
  setLowBatterySent,
} from './storage';

export const LOCATION_TASK = 'ridesafe-background-location';

TaskManager.defineTask(
  LOCATION_TASK,
  async ({ data, error }) => {
    if (error || !data) {
      return;
    }

    if (!supabase) {
      console.warn(
        'RideSafe live tracking skipped: Supabase is not configured.'
      );
      return;
    }

    const sessionId = await getActiveSessionId();

    if (!sessionId) {
      return;
    }

    const locations = (
      data as {
        locations: Location.LocationObject[];
      }
    ).locations;

    const battery =
      await Battery.getBatteryLevelAsync();

    for (const loc of locations) {
      const { error: locationError } =
        await supabase
          .from('location_points')
          .insert({
            session_id: sessionId,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
            battery_level:
              battery >= 0 ? battery : null,
            recorded_at: new Date(
              loc.timestamp
            ).toISOString(),
          });

      if (locationError) {
        console.error(
          'BACKGROUND LOCATION INSERT ERROR:',
          locationError
        );
      }
    }

    if (
      battery >= 0 &&
      battery <= 0.15 &&
      !(await getLowBatterySent())
    ) {
      const { error: batteryError } =
        await supabase
          .from('safety_events')
          .insert({
            session_id: sessionId,
            event_type: 'LOW_BATTERY',
            payload: {
              battery_level: battery,
            },
          });

      if (batteryError) {
        console.error(
          'LOW BATTERY EVENT ERROR:',
          batteryError
        );
        return;
      }

      await setLowBatterySent(true);
    }
  }
);