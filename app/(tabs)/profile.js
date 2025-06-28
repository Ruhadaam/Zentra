import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../firebase/authSystem';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      console.log('Kullanıcı çıkış yaptı');
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error.message);
      Alert.alert('Çıkış Hatası', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark p-5">
      <ScrollView className="flex-1">
        <Text className="text-white text-3xl font-oswald mb-8 text-center">👤 Profil</Text>

    

        {/* Profil Detayları */}
        <TouchableOpacity
          className="bg-light-blue p-4 rounded-lg mb-4"
          onPress={() => router.push({ pathname: '/(stack)/profile-details' })}
        >
          <Text className="text-dark font-oswald text-lg text-center">📝 Profil Detayları</Text>
        </TouchableOpacity>

        
        <TouchableOpacity
          className="bg-light-blue p-4 rounded-lg mb-4"
          onPress={() => router.push({ pathname: '/(stack)/notification-settings' })}
        >
          <Text className="text-dark font-oswald text-lg text-center">🔔 Bildirim Ayarları</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-dark-gray p-4 rounded-lg mb-8"
          onPress={() => { console.log('Geri Bildirim Gönder tıklandı'); }}
        >
          <Text className="text-white font-oswald text-lg">💬 Geri Bildirim Gönder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-white font-oswald text-lg text-center">🚪 Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// StyleSheet artık kullanılmıyor
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
*/ 