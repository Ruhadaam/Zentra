import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';


const infoBlocks = [
  {
    label: 'Ad Soyad',
    valueKey: 'name',
    emoji: '👤',
    fallback: '-',
  },
  {
    label: 'E-posta',
    valueKey: 'email',
    emoji: '📧',
    fallback: '-',
  },
  {
    label: 'Telefon',
    valueKey: 'phoneNumber',
    emoji: '📱',
    fallback: '-',
  },
];

const ProfileDetails = () => {
  const { userInfo, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-dark p-5 justify-center items-center">
        <Text className="text-white text-lg">Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (!userInfo) {
    return (
      <SafeAreaView className="flex-1 bg-dark p-5 justify-center items-center">
        <Text className="text-white text-lg">Kullanıcı bilgisi bulunamadı.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark p-5">
      <ScrollView className="flex-1">
      <Header title="Profil Detayları" />



       
        {infoBlocks.map((block, idx) => (
          <View
            key={block.valueKey}
            className="bg-dark-gray p-5 rounded-2xl mb-6 flex-row items-center shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text className="text-2xl mr-4">{block.emoji}</Text>
            <View>
              <Text className="text-light-blue font-oswald text-xs mb-1 tracking-widest uppercase">{block.label}</Text>
              <Text className="text-white font-ancizar text-lg">{userInfo[block.valueKey] || block.fallback}</Text>
            </View>
          </View>
        ))}
        {/* Buraya ek detaylar ekleyebilirsin */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetails;
