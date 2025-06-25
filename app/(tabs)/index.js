import { View, Text, ScrollView, TouchableOpacity, /*Modal,*/ Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { fetchAppointmentsWithIds, updateAppointment } from '../../firebase/appointmentService';
import Toast from 'react-native-toast-message';
import { useUser } from '../context/UserContext';

export default function AnaSayfaScreen() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { uid } = useUser();

  const handleAppointmentPress = async (appointment) => {
    // Status toggle logic
    const newStatus = appointment.status === 'Tamamlandı' ? 'Beklemede' : 'Tamamlandı';
    const updatedAppointment = { ...appointment, status: newStatus };
    try {
      await updateAppointment(uid, updatedAppointment);
      // Update local state for instant UI feedback
      setTodayAppointments((prev) => prev.map((a) => a.id === appointment.id ? { ...a, status: newStatus } : a));
      Toast.show({
        type: 'success',
        text1: 'Durum güncellendi',
        text2: `Randevu durumu: ${newStatus}`,
        position: 'top',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Durum güncellenemedi',
        position: 'top',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadAppointments = async () => {
        try {
          const appointmentsArr = await fetchAppointmentsWithIds(uid);
          setAppointmentsData(appointmentsArr || []);

          if (appointmentsArr && appointmentsArr.length > 0) {
            setTotalCount(appointmentsArr.length);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday start of week
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            const appointmentsToday = appointmentsArr.filter(app => {
              if (!app.date) return false;
              const appDate = new Date(app.date);
              appDate.setHours(0, 0, 0, 0);
              return appDate.getTime() === today.getTime();
            }).sort((a, b) => {
              if (!a.time || !b.time) return 0; // Handle cases with missing time
              const [aHour, aMinute] = a.time.split(':').map(Number);
              const [bHour, bMinute] = b.time.split(':').map(Number);
              if (aHour !== bHour) return aHour - bHour;
              return aMinute - bMinute;
            });
            setTodayAppointments(appointmentsToday);
            setTodayCount(appointmentsToday.length);

            const appointmentsThisWeek = appointmentsArr.filter(app => {
              if (!app.date) return false;
              const appDate = new Date(app.date);
              appDate.setHours(0, 0, 0, 0);
              return appDate >= startOfWeek && appDate <= today; // Include today
            });
            setWeekCount(appointmentsThisWeek.length);

            const appointmentsThisMonth = appointmentsArr.filter(app => {
              if (!app.date) return false;
              const appDate = new Date(app.date);
              appDate.setHours(0, 0, 0, 0);
              return appDate >= startOfMonth && appDate <= today; // Include today
            });
            setMonthCount(appointmentsThisMonth.length);

          } else {
            setTotalCount(0);
            setTodayCount(0);
            setWeekCount(0);
            setMonthCount(0);
            setTodayAppointments([]);
          }

        } catch (error) {
          console.error('Failed to load appointments:', error);
          // Optionally show an error message to the user
        }
      };

      loadAppointments();
    }, [uid])
  );

  return (
    <SafeAreaView className="bg-dark flex-1">
      <ScrollView className="flex-1">
        <View className="p-5">
          {/* Header */}
          <Animated.Text 
            entering={FadeIn.duration(1000)}
            className="text-white text-3xl font-oswald mb-5"
          >
            Ana Sayfa
          </Animated.Text>
          
          {/* Stats Cards */}
          <View className="flex-row flex-wrap justify-between mb-5">
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg mb-4"
            >
              <Text className="text-white font-oswald text-lg">Bugünkü Randevular</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">{todayCount}</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg mb-4"
            >
              <Text className="text-white font-oswald text-lg">Bu Hafta</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">{weekCount}</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(600).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg"
            >
              <Text className="text-white font-oswald text-lg">Bu Ay</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">{monthCount}</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(800).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg"
            >
              <Text className="text-white font-oswald text-lg">Toplam</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">{totalCount}</Text>
            </Animated.View>
          </View>

          {/* Bugünün Randevuları */}
          <Text className="text-gray-500 font-oswald text-center text-base mb-2">Randevu hakkında detay için randevuya tıklayınız</Text>
          <Animated.View 
            entering={FadeInUp.delay(1000).springify()}
            className="bg-dark-gray p-4 rounded-lg"
          >
            <Text className="text-white font-oswald text-xl mb-4">Bugünün Randevuları</Text>
            {todayAppointments.length > 0 ? (todayAppointments.map((appointment, index) => (
              <TouchableOpacity
                key={`${appointment.id || index}`}
                onPress={() => handleAppointmentPress(appointment)}
              >
                <Animated.View
                  entering={FadeInUp.delay(1200 + (index * 200)).springify()}
                  className="bg-light-blue rounded-xl p-4 mb-3"
                >
                  <View className="flex-row justify-between items-start">
                    {/* Saat ve Not */}
                    <View className="min-w-[80px] max-w-[100px]">
                      <View className="flex-row items-center">
                        <FontAwesome name="clock-o" size={20} color="#0B1215" />
                        <Text className="text-dark font-oswald text-base ml-2" numberOfLines={1} ellipsizeMode="tail">{appointment.time || '--:--'}</Text>
                      </View>
                      {appointment.note && (
                        <View className="flex-row items-center mt-3 ml-2">
                          <FontAwesome name="sticky-note-o" size={16} color="#0B1215" />
                          <Text className="text-dark font-oswald text-base ml-1" numberOfLines={1} ellipsizeMode="tail">Not var</Text>
                        </View>
                      )}
                    </View>
                    {/* Durum */}
                    <View className="items-center justify-center min-w-[80px] max-w-[90px]">
                      <Text className="text-dark font-oswald text-sm">Durum</Text>
                      <Text className={`text-dark font-oswald text-lg ${appointment.status === 'Beklemede' ? 'text-yellow-600' : appointment.status === 'Tamamlandı' ? 'text-green-600' : 'text-red-600'}`} numberOfLines={1} ellipsizeMode="tail">{appointment.status || '--'}</Text>
                    </View>
                    {/* Müşteri Adı ve Telefon */}
                    <View className="items-end min-w-[100px] max-w-[120px]">
                      <Text className="text-dark font-oswald text-lg" numberOfLines={1} ellipsizeMode="tail">{appointment.customerName || 'Bilinmiyor'}</Text>
                      <Text className="text-dark font-oswald text-base" numberOfLines={1} ellipsizeMode="tail">{appointment.phoneNumber}</Text>
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))): (
              <Text className="text-gray-400 font-oswald text-center mt-3">
                Bugün için randevu bulunamadı.
              </Text>
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          onPress={() => setModalVisible(false)}
          className="flex-1 "
        >
          <View className="flex-1 justify-end">
            <View className="bg-light-blue rounded-t-3xl p-5">
              <View className="w-12 h-1 bg-dark/20 rounded-full self-center mb-4" />
              <Text className="text-dark font-oswald text-xl mb-4">Randevu Detayı</Text>
              
              {selectedAppointment && (
                <>
                  <View className="flex-row justify-between mb-4">
                    <View>
                      <Text className="text-dark font-oswald">Saat</Text>
                      <Text className="text-dark font-oswald text-lg">{selectedAppointment.time}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-dark font-oswald text-lg">{selectedAppointment.patient}</Text>
                      <Text className="text-dark font-oswald">{selectedAppointment.phone}</Text>
                    </View>
                  </View>

                  {selectedAppointment.note && (
                    <View className="bg-dark/5 p-3 rounded-lg mb-4">
                      <View className="flex-row items-center mb-2">
                        <FontAwesome name="sticky-note-o" size={16} color="#0B1215" />
                        <Text className="text-dark font-oswald ml-2">Not</Text>
                      </View>
                      <Text className="text-dark font-oswald">{selectedAppointment.note}</Text>
                    </View>
                  )}

                  <View className="flex-row justify-between mt-4">
                    <TouchableOpacity 
                      onPress={handleComplete}
                      className="bg-green-500 px-6 py-3 rounded-lg flex-1 mr-2"
                    >
                      <Text className="text-white font-oswald text-center">Tamamlandı</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={handleCancel}
                      className="bg-red-500 px-6 py-3 rounded-lg flex-1 ml-2"
                    >
                      <Text className="text-white font-oswald text-center">İptal Et</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Pressable>
      </Modal> */}
    </SafeAreaView>
  );
} 