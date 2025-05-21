import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState } from 'react';

export default function AnaSayfaScreen() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAppointmentPress = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleComplete = () => {
    // Burada randevuyu tamamlandı olarak işaretleme işlemi yapılacak
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Burada randevuyu iptal etme işlemi yapılacak
    setModalVisible(false);
  };

  // Örnek randevu verileri
  const todayAppointments = [
    { id: 1, time: '09:00', patient: 'Ahmet Yılmaz', phone: '0532 123 4567' },
    { id: 2, time: '10:30', patient: 'Ayşe Demir', phone: '0533 234 5678', note: 'İlk muayene' },
    { id: 3, time: '14:00', patient: 'Mehmet Kaya', phone: '0535 345 6789', note: 'Kanal tedavisi' },
    { id: 4, time: '15:30', patient: 'Zeynep Şahin', phone: '0536 456 7890', note: 'Diş beyazlatma' },
    { id: 5, time: '16:45', patient: 'Ali Öztürk', phone: '0537 567 8901', note: 'Diş eti tedavisi' },
    { id: 6, time: '16:45', patient: 'Ali Öztürk', phone: '0537 567 8901', note: 'Kontrol' },
    { id: 7, time: '16:45', patient: 'Ali Öztürk', phone: '0537 567 8901', note: 'Diş çekimi' },
    { id: 8, time: '16:45', patient: 'Ali Öztürk', phone: '0537 567 8901', note: 'İmplant kontrol' },
    { id: 9, time: '16:45', patient: 'Ali Öztürk', phone: '0537 567 8901', note: 'Diş dolgusu' },
  ];

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
              <Text className="text-light-blue text-2xl font-oswald mt-2">5</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg mb-4"
            >
              <Text className="text-white font-oswald text-lg">Bu Hafta</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">12</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(600).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg"
            >
              <Text className="text-white font-oswald text-lg">Bu Ay</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">45</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(800).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg"
            >
              <Text className="text-white font-oswald text-lg">Toplam</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">156</Text>
            </Animated.View>
          </View>

          {/* Bugünün Randevuları */}
          <Animated.View 
            entering={FadeInUp.delay(1000).springify()}
            className="bg-dark-gray p-4 rounded-lg"
          >
            <Text className="text-white font-oswald text-xl mb-4">Bugünün Randevuları</Text>
            {todayAppointments.map((appointment, index) => (
              <Animated.View
                key={appointment.id}
                entering={FadeInUp.delay(1200 + (index * 200)).springify()}
                className="bg-light-blue p-3 rounded-lg mb-3"
              >
                <TouchableOpacity onPress={() => handleAppointmentPress(appointment)}>
                  <View className="flex-row justify-between items-start">
                    <View>
                      <View className="flex-row items-center">
                        <FontAwesome name="clock-o" size={20} color="#0B1215" />
                        <Text className="text-dark font-oswald ml-2">{appointment.time}</Text>
                      </View>
                      {appointment.note && (
                        <View className="flex-row items-center mt-1 ml-7">
                          <FontAwesome name="sticky-note-o" size={14} color="#0B1215" />
                          <Text className="text-dark font-oswald text-sm ml-1">Not var</Text>
                        </View>
                      )}
                    </View>
                    <View className="items-end">
                      <Text className="text-dark font-oswald">{appointment.patient}</Text>
                      <Text className="text-dark font-oswald text-sm">{appointment.phone}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </ScrollView>

      <Modal
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
      </Modal>
    </SafeAreaView>
  );
} 