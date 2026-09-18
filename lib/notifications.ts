import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function prepareNotifications() {
  await Notifications.requestPermissionsAsync();
}

export async function scheduleSafetyTimer(minutes: number) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'RideSafe check-in',
      body: "Are you okay? Open RideSafe and check in.",
      data: { url: '/more' },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: minutes * 60 },
  });
}

export async function scheduleFakeCallNotification(seconds: number, caller: string, language: 'en' | 'hy') {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: caller,
      body: language === 'hy' ? 'Մուտքային զանգ' : 'Incoming call',
      sound: 'default',
      data: { url: `/fake-incoming?caller=${encodeURIComponent(caller)}&language=${language}` },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
  });
}
