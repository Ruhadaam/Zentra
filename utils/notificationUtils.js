import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Bildirim izni verilmedi!');
  }
}

export async function saveUpcomingAppointments(appointments) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  const filtered = appointments.filter(app => {
    if (!app.date) return false;
    const appDate = new Date(app.date);
    appDate.setHours(0, 0, 0, 0);
    return appDate >= today && appDate <= threeDaysLater;
  });

  await AsyncStorage.setItem('upcomingAppointments', JSON.stringify(filtered));
}

export async function getTodayAppointmentsMessage() {
  const data = await AsyncStorage.getItem('upcomingAppointments');
  if (!data) return 'Bugün için randevu yok.';
  const appointments = JSON.parse(data);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    appDate.setHours(0, 0, 0, 0);
    return appDate.getTime() === today.getTime();
  });
  if (todaysAppointments.length === 0) return 'Bugün için randevu yok.';
  return `Bugün ${todaysAppointments.length} adet müşteri senin için gelecek, iyi çalışmalar!`;
}

export async function scheduleDailyNotification(hour = 7, minute = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bugünkü Randevular',
      body: await getTodayAppointmentsMessage(),
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

// Notification handler (App.js veya index.js'de bir kez çağrılmalı)
export function setNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} 