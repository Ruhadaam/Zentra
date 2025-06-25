import React, { useEffect, useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { requestNotificationPermission, scheduleDailyNotification } from '../../utils/notificationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function NotificationSettingsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(0);

  useEffect(() => {
    // AsyncStorage'dan ayarları yükle
    (async () => {
      const notifEnabled = await AsyncStorage.getItem('notifEnabled');
      const notifHour = await AsyncStorage.getItem('notifHour');
      const notifMinute = await AsyncStorage.getItem('notifMinute');
      setIsEnabled(notifEnabled === 'true');
      if (notifHour) setSelectedHour(Number(notifHour));
      if (notifMinute) setSelectedMinute(Number(notifMinute));
    })();
  }, []);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    await AsyncStorage.setItem('notifEnabled', newValue.toString());
    if (newValue) {
      await requestNotificationPermission();
      await scheduleDailyNotification(selectedHour, selectedMinute);
    } else {
      // Bildirimleri iptal et
      const Notifications = require('expo-notifications');
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const showTimePickerModal = () => setTimePickerVisible(true);
  const hideTimePickerModal = () => setTimePickerVisible(false);
  const handleConfirmTime = async (date) => {
    setTimePickerVisible(false);
    if (date) {
      setSelectedHour(date.getHours());
      setSelectedMinute(date.getMinutes());
      await AsyncStorage.setItem('notifHour', date.getHours().toString());
      await AsyncStorage.setItem('notifMinute', date.getMinutes().toString());
      if (isEnabled) {
        await scheduleDailyNotification(date.getHours(), date.getMinutes());
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-dark">
      <Header title="Bildirim Ayarları" />
      <View className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-white text-lg font-oswald">Bildirim İzni</Text>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            thumbColor={isEnabled ? 'white' : '#888'}
            trackColor={{ false: '#767577', true: '#A8DADC' }}
          />
        </View>
        {isEnabled && (
          <View>
            <Text className="text-white font-oswald mb-2">Bildirim Saati</Text>
            <Text
              className="text-light-blue text-xl font-oswald mb-4"
              onPress={showTimePickerModal}
              style={{ paddingVertical: 8 }}
            >
              {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
            </Text>
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleConfirmTime}
              onCancel={hideTimePickerModal}
              onDismiss={hideTimePickerModal}
              pickerContainerStyleIOS={{
                alignSelf: 'center',
                width: '75%',
                borderRadius: 16,
                backgroundColor: 'white',
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
} 