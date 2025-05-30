import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
// import { StyleSheet } from 'react-native'; // StyleSheet artık kullanılmayacak
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../firebase/authSystem'; // signOut fonksiyonunu içe aktaralım
import { useRouter } from 'expo-router';

export default function ProfileScreen() { // İsimlendirmeyi ProfileScreen olarak güncelleyelim
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Başarılı çıkış sonrası login ekranına yönlendir
      // Yönlendirme _layout.js tarafından otomatik yapılacaktır,
      // ancak emin olmak için buraya da ekleyebiliriz.
      // router.replace('/(auth)/login');
      console.log("Kullanıcı çıkış yaptı");
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error.message);
      Alert.alert("Çıkış Hatası", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark p-5">
      <ScrollView className="flex-1">
        <Text className="text-white text-3xl font-oswald mb-8 text-center">Profil</Text>

        {/* Profil Bilgileri */}
        <TouchableOpacity
          className="bg-dark-gray p-4 rounded-lg mb-4"
          onPress={() => { /* Profil bilgileri sayfasına yönlendirme veya modal açma */ console.log('Profil Bilgileri tıklandı'); }}
        >
          <Text className="text-white font-oswald text-lg">Profil Bilgileri</Text>
        </TouchableOpacity>

        {/* Ayarlar */}
        <TouchableOpacity
          className="bg-dark-gray p-4 rounded-lg mb-4"
          onPress={() => { /* Ayarlar sayfasına yönlendirme veya modal açma */ console.log('Ayarlar tıklandı'); }}
        >
          <Text className="text-white font-oswald text-lg">Ayarlar</Text>
        </TouchableOpacity>

        {/* Bildirimler */}
        <TouchableOpacity
          className="bg-dark-gray p-4 rounded-lg mb-4"
          onPress={() => { /* Bildirim ayarları sayfasına yönlendirme */ console.log('Bildirimler tıklandı'); }}
        >
          <Text className="text-white font-oswald text-lg">Bildirimler</Text>
        </TouchableOpacity>

        {/* Submit Feedback */}
        <TouchableOpacity
          className="bg-dark-gray p-4 rounded-lg mb-8"
          onPress={() => { /* Geri bildirim gönderme ekranına yönlendirme */ console.log('Geri Bildirim Gönder tıklandı'); }}
        >
          <Text className="text-white font-oswald text-lg">Geri Bildirim Gönder</Text>
        </TouchableOpacity>

        {/* Çıkış Yap */}
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-white font-oswald text-lg text-center">Çıkış Yap</Text>
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