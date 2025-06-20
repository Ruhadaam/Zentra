import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { registerUser } from '../../firebase/authSystem'; // Kendi yazdığımız kayıt fonksiyonu
import { Formik } from 'formik';
import * as Yup from 'yup';


const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Ad Soyad zorunludur'),
  email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta zorunludur'),
  password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]*$/, 'Sadece rakam giriniz')
    .min(10, 'Telefon numarası en az 10 haneli olmalıdır')
    .nullable(), // Telefon numarası opsiyonel
});

export default function RegisterScreen() {
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (values) => {
    setError(null); // Hata durumunu sıfırla
    try {
      // Kendi registerUser fonksiyonumuzu çağırıyoruz
      const user = await registerUser(values.name, values.email, values.password, values.phoneNumber);
      console.log('Kayıt başarılı:', user);

      Alert.alert('Başarılı', 'Hesabınız oluşturuldu!');
      router.push('/(auth)/login'); // Kayıt sonrası giriş sayfasına yönlendirme
    } catch (e) {
      setError(e.message);
      Alert.alert('Kayıt Hatası', e.message);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-dark p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text className="text-white text-3xl font-oswald mb-8 text-center">Kayıt Ol</Text>

        <Formik
          initialValues={{ name: '', email: '', password: '', phoneNumber: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <TextInput
                className="w-full bg-dark-gray text-white p-4 rounded-lg mb-2 font-ancizar text-base"
                placeholder="Ad Soyad"
                placeholderTextColor="#6C757D"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && (
                <Text className="text-red-500 text-sm mb-4">{errors.name}</Text>
              )}

              <TextInput
                className="w-full bg-dark-gray text-white p-4 rounded-lg mb-2 font-ancizar text-base"
                placeholder="E-posta"
                placeholderTextColor="#6C757D"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              {touched.email && errors.email && (
                <Text className="text-red-500 text-sm mb-4">{errors.email}</Text>
              )}

              <TextInput
                className="w-full bg-dark-gray text-white p-4 rounded-lg mb-2 font-ancizar text-base"
                placeholder="Şifre"
                placeholderTextColor="#6C757D"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              {touched.password && errors.password && (
                <Text className="text-red-500 text-sm mb-4">{errors.password}</Text>
              )}

              {/* Telefon Numarası - Opsiyonel */}
              <TextInput
                className="w-full bg-dark-gray text-white p-4 rounded-lg mb-2 font-ancizar text-base"
                placeholder="Telefon Numarası (Opsiyonel)"
                placeholderTextColor="#6C757D"
                keyboardType="phone-pad"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <Text className="text-red-500 text-sm mb-4">{errors.phoneNumber}</Text>
              )}

              {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

              <TouchableOpacity
                className="w-full bg-light-blue p-4 rounded-lg mb-4"
                onPress={handleSubmit}
              >
                <Text className="text-dark text-base text-center font-oswald">Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <TouchableOpacity
          className="w-full p-2"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-light-blue text-base text-center font-oswald">Zaten hesabın var mı? Giriş Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 