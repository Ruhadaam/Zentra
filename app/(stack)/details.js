import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { deleteAppointment, updateAppointment } from '../../firebase/appointmentService';
import { useState, useRef } from 'react';
import Header from '../../components/Header';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-toast-message';

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const appointment = JSON.parse(params.appointment);

  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState(appointment);
  const originalAppointmentRef = useRef(appointment);

  // Date/Time picker state
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showDatePickerModal = () => setDatePickerVisibility(true);
  const hideDatePickerModal = () => setDatePickerVisibility(false);
  const handleConfirmDate = (date) => {
    setEditedAppointment({ ...editedAppointment, date: date.toISOString().split('T')[0] });
    hideDatePickerModal();
  };

  const showTimePickerModal = () => setTimePickerVisibility(true);
  const hideTimePickerModal = () => setTimePickerVisibility(false);
  const handleConfirmTime = (time) => {
    // Saat: HH:mm formatında kaydet
    const formatted = time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setEditedAppointment({ ...editedAppointment, time: formatted });
    hideTimePickerModal();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAppointment(appointment);
    console.log('Düzenleme tıklandı');
  };

  const handleDelete = async () => {
    try {
      await deleteAppointment(appointment.id);
      Toast.show({
        type: 'success',
        text1: 'Randevu silindi',
        position: 'top',
      });
      router.back();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      Toast.show({
        type: 'error',
        text1: 'Silme başarısız',
        text2: error.message,
        position: 'top',
      });
    }
    console.log('Silme tıklandı');
  };

  const handleSave = async () => {
    try {
      await updateAppointment(editedAppointment);
      setIsEditing(false);
      Toast.show({
        type: 'success',
        text1: 'Randevu güncellendi',
        position: 'top',
      });
    } catch (error) {
      console.error('Failed to update appointment:', error);
      Toast.show({
        type: 'error',
        text1: 'Güncelleme başarısız',
        text2: error.message,
        position: 'top',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAppointment(originalAppointmentRef.current);
  };

  // Yardımcı fonksiyon
  const displayValue = (value) => (value && value !== '' ? value : '-');

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-dark">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        >
          <View className="p-5">
            {/* Header */}
            <Header title="Randevu Detayları" />

            {/* Müşteri Bilgileri */}
            <View className=" rounded-xl p-4 mb-4">
              {/* Müşteri Adı */}
              {isEditing ? (
                <View className="flex-row items-center mb-4">
                  <Ionicons name="person" size={24} color="white" />
                  <TextInput
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base flex-1 ml-2"
                    value={editedAppointment.customerName}
                    onChangeText={(text) => setEditedAppointment({ ...editedAppointment, customerName: text })}
                    placeholder="Müşteri adını girin"
                    placeholderTextColor="#6C757D"
                  />
                </View>
              ) : (
                <View className="flex-row items-center mb-4">
                  <Ionicons name="person" size={24} color="white" />
                  <Text className="text-white text-lg font-ancizar ml-2">
                    {displayValue(editedAppointment.customerName)}
                  </Text>
                </View>
              )}

              {/* Tarih */}
              <View className="flex-row items-center my-3">
                <Ionicons name="calendar" size={20} color="white" />
                {isEditing ? (
                  <TouchableOpacity
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base flex-1 ml-2 flex-row items-center justify-between"
                    onPress={showDatePickerModal}
                  >
                    <Text className="text-white font-ancizar text-base">
                      {displayValue(editedAppointment.date)}
                    </Text>
                    <Ionicons name="calendar" size={24} color="#6C757D" />
                  </TouchableOpacity>
                ) : (
                  <Text className="text-white text-lg font-ancizar ml-2">
                    {displayValue(editedAppointment.date)}
                  </Text>
                )}
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirmDate}
                  onCancel={hideDatePickerModal}
                />
              </View>

              {/* Saat */}
              <View className="flex-row items-center my-3">
                <Ionicons name="time" size={20} color="white" />
                {isEditing ? (
                  <TouchableOpacity
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base flex-1 ml-2 flex-row items-center justify-between"
                    onPress={showTimePickerModal}
                  >
                    <Text className="text-white text-lg font-ancizar ml-2">
                      {displayValue(editedAppointment.time)}
                    </Text>
                    <Ionicons name="time-outline" size={24} color="#6C757D" />
                  </TouchableOpacity>
                ) : (
                  <Text className="text-white text-lg font-ancizar ml-2">
                    {displayValue(editedAppointment.time)}
                  </Text>
                )}
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={handleConfirmTime}
                  onCancel={hideTimePickerModal}
                />
              </View>

              {/* Telefon */}
              <View className="flex-row items-center my-3">
                <Ionicons name="call" size={20} color="white" />
                {isEditing ? (
                  <TextInput
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base flex-1 ml-2"
                    value={editedAppointment.phoneNumber}
                    onChangeText={(text) => setEditedAppointment({ ...editedAppointment, phoneNumber: text })}
                    placeholder="Telefon numarasını girin (opsiyonel)"
                    placeholderTextColor="#6C757D"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                ) : (
                  <Text className="text-white text-lg font-ancizar ml-2">
                    {displayValue(editedAppointment.phoneNumber)}
                  </Text>
                )}
              </View>

              {/* Durum */}
              <View className="flex-row items-center my-3">
                <Ionicons name="information-circle" size={20} color="white" />
                 {isEditing ? (
                  <View className="flex-row ml-2 flex-1">
                    <TouchableOpacity
                      className={`p-2 rounded-md mr-2 ${editedAppointment.status?.toLowerCase() === 'beklemede' ? 'bg-light-blue' : 'bg-gray-500'}`}
                      onPress={() => setEditedAppointment({ ...editedAppointment, status: 'Beklemede' })}
                    >
                      <Text className="text-black text-sm font-oswald">Beklemede</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`p-2 rounded-md ${editedAppointment.status?.toLowerCase() === 'tamamlandı' ? 'bg-light-blue' : 'bg-gray-500'}`}
                      onPress={() => setEditedAppointment({ ...editedAppointment, status: 'Tamamlandı' })}
                    >
                      <Text className="text-black text-sm font-oswald">Tamamlandı</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                <Text className="text-white text-lg font-ancizar ml-2">
                  {displayValue(editedAppointment.status)}
                </Text>
                )}
              </View>
                {/* Notlar */}
              <View className="flex-row items-center my-3">
                <Ionicons name="document-text" size={20} color="white" />
                {isEditing ? (
                  <TextInput
                    className="border-light-blue border-b-2 text-white p-3 rounded-lg font-ancizar text-base flex-1 ml-2"
                    value={editedAppointment.note}
                    onChangeText={(text) => setEditedAppointment({ ...editedAppointment, note: text })}
                    placeholder="Açıklama ekleyin (opsiyonel)"
                    placeholderTextColor="#6C757D"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                ) : (
                  <Text className="text-white text-lg font-ancizar ml-2">
                    {displayValue(editedAppointment.note)}
                  </Text>
                )}
              </View>
            </View>

            {/* İşlem Butonları */}
            <View className="flex-row justify-between">
              {isEditing ? (
                <>
                  <TouchableOpacity 
                    className="bg-green-500 p-4 rounded-lg flex-1 mr-2"
                    onPress={handleSave}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="save" size={20} color="white" />
                      <Text className="text-white text-base font-oswald ml-2">Kaydet</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="bg-red-500 p-4 rounded-lg flex-1 ml-2"
                    onPress={handleCancel}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="close" size={20} color="white" />
                      <Text className="text-white text-base font-oswald ml-2">İptal</Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    className="bg-light-blue p-4 rounded-lg flex-1 mr-2"
                    onPress={handleEdit}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="create" size={20} color="#0B1215" />
                      <Text className="text-dark text-base font-oswald ml-2">Düzenle</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="bg-red-500 p-4 rounded-lg flex-1 ml-2"
                    onPress={handleDelete}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="trash" size={20} color="white" />
                      <Text className="text-white text-base font-oswald ml-2">Sil</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
        <Toast />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 