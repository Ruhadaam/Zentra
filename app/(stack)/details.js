import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { deleteAppointment, updateAppointment } from '../../firebase/appointmentService';
import { useState, useRef } from 'react';

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const appointment = JSON.parse(params.appointment);

  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState(appointment);
  const originalAppointmentRef = useRef(appointment);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedAppointment(appointment);
    console.log('Düzenleme tıklandı');
  };

  const handleDelete = async () => {
    try {
      await deleteAppointment(appointment.id);
      router.back();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
    console.log('Silme tıklandı');
  };

  const handleSave = async () => {
    try {
      await updateAppointment(editedAppointment);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAppointment(originalAppointmentRef.current);
  };

  return (
    <SafeAreaView className="bg-dark flex-1">
      <View className="p-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-light-blue p-2 rounded-lg"
          >
            <Ionicons name="arrow-back" size={24} color="#0B1215" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-oswald">Randevu Detayları</Text>
          <View className="w-10" /> 
        </View>

        {/* Müşteri Bilgileri */}
        <View className="bg-light-blue rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="person" size={24} color="#0B1215" />
            {isEditing ? (
              <TextInput
                className="text-dark text-xl font-oswald ml-2 border-b border-dark/30 flex-1"
                value={editedAppointment.customerName}
                onChangeText={(text) => setEditedAppointment({ ...editedAppointment, customerName: text })}
                placeholder="Müşteri Adı"
                placeholderTextColor="#0B121580"
              />
            ) : (
              <Text className="text-dark text-xl font-oswald ml-2">
                {editedAppointment.customerName}
              </Text>
            )}
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar" size={20} color="#0B1215" />
            {isEditing ? (
               <TextInput
                 className="text-dark text-lg font-oswald ml-2 border-b border-dark/30 flex-1"
                 value={editedAppointment.date}
                 onChangeText={(text) => setEditedAppointment({ ...editedAppointment, date: text })}
                 placeholder="Tarih (YYYY-MM-DD)"
                 placeholderTextColor="#0B121580"
               />
            ) : (
              <Text className="text-dark text-lg font-oswald ml-2">
                {editedAppointment.date}
              </Text>
            )}
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="time" size={20} color="#0B1215" />
            {isEditing ? (
              <TextInput
                className="text-dark text-lg font-oswald ml-2 border-b border-dark/30 flex-1"
                value={editedAppointment.time}
                onChangeText={(text) => setEditedAppointment({ ...editedAppointment, time: text })}
                placeholder="Saat (HH:mm)"
                placeholderTextColor="#0B121580"
              />
            ) : (
              <Text className="text-dark text-lg font-oswald ml-2">
                {editedAppointment.time}
              </Text>
            )}
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="call" size={20} color="#0B1215" />
            {isEditing ? (
              <TextInput
                className="text-dark text-lg font-oswald ml-2 border-b border-dark/30 flex-1"
                value={editedAppointment.phoneNumber}
                onChangeText={(text) => setEditedAppointment({ ...editedAppointment, phoneNumber: text })}
                placeholder="Telefon Numarası"
                placeholderTextColor="#0B121580"
                keyboardType="phone-pad"
              />
            ) : (
              <Text className="text-dark text-lg font-oswald ml-2">
                {editedAppointment.phoneNumber}
              </Text>
            )}
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={20} color="#0B1215" />
             {isEditing ? (
              <View className="flex-row ml-2 flex-1">
                <TouchableOpacity
                  className={`p-2 rounded-md mr-2 ${editedAppointment.status?.toLowerCase() === 'beklemede' ? 'bg-dark' : 'bg-dark/50'}`}
                  onPress={() => setEditedAppointment({ ...editedAppointment, status: 'Beklemede' })}
                >
                  <Text className="text-white text-sm font-oswald">Beklemede</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`p-2 rounded-md ${editedAppointment.status?.toLowerCase() === 'tamamlandı' ? 'bg-dark' : 'bg-dark/50'}`}
                  onPress={() => setEditedAppointment({ ...editedAppointment, status: 'Tamamlandı' })}
                >
                  <Text className="text-white text-sm font-oswald">Tamamlandı</Text>
                </TouchableOpacity>
              </View>
            ) : (
            <Text className="text-dark text-lg font-oswald ml-2">
              {editedAppointment.status}
            </Text>
            )}
          </View>
        </View>

        {/* Notlar */}
        <View className="bg-light-blue rounded-xl p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="document-text" size={20} color="#0B1215" />
            <Text className="text-dark text-lg font-oswald ml-2">Notlar</Text>
          </View>
          {isEditing ? (
            <TextInput
              className="text-dark text-base font-ancizar border-b border-dark/30 p-2"
              value={editedAppointment.note}
              onChangeText={(text) => setEditedAppointment({ ...editedAppointment, note: text })}
              placeholder="Not"
              placeholderTextColor="#0B121580"
              multiline
              style={{  textAlignVertical: 'top' }}
            />
          ) : (
          <Text className="text-dark text-base font-ancizar" style={{ flexWrap: 'wrap' }}>
            {editedAppointment.note}
          </Text>
          )}
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
    </SafeAreaView>
  );
} 