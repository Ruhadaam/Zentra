import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const appointment = JSON.parse(params.appointment);

  const handleEdit = () => {
    // Düzenleme işlevi buraya gelecek
    console.log('Düzenleme tıklandı');
  };

  const handleDelete = () => {
    // Silme işlevi buraya gelecek
    console.log('Silme tıklandı');
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
            <Text className="text-dark text-xl font-oswald ml-2">
              {appointment.title}
            </Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar" size={20} color="#0B1215" />
            <Text className="text-dark text-lg font-oswald ml-2">
              {appointment.date}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="time" size={20} color="#0B1215" />
            <Text className="text-dark text-lg font-oswald ml-2">
              {appointment.time}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="call" size={20} color="#0B1215" />
            <Text className="text-dark text-lg font-oswald ml-2">
              {appointment.phoneNumber}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={20} color="#0B1215" />
            <Text className="text-dark text-lg font-oswald ml-2">
              {appointment.status}
            </Text>
          </View>
        </View>

        {/* Notlar */}
        <View className="bg-light-blue rounded-xl p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="document-text" size={20} color="#0B1215" />
            <Text className="text-dark text-lg font-oswald ml-2">Notlar</Text>
          </View>
          <Text className="text-dark text-base font-ancizar">
            {appointment.note}
          </Text>
        </View>

        {/* İşlem Butonları */}
        <View className="flex-row justify-between">
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
        </View>
      </View>
    </SafeAreaView>
  );
} 