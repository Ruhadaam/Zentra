import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Header = ({ title = 'Başlık', showBack = true }) => {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center mb-8">
      {showBack ? (
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-light-blue p-2 rounded-lg"
        >
          <Ionicons name="arrow-back" size={24} color="#0B1215" />
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}
      <Text className="text-white text-3xl font-oswald  text-center">{title}</Text>
      <View className="w-10" />
    </View>
  );
};

export default Header;
