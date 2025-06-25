import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { loginUser } from "../../firebase/authSystem";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../context/AuthContext";
import { BlurView } from 'expo-blur';


const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta zorunludur'),
  password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
});

export default function Login() {
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
 


  useEffect(() => {
    // AsyncStorage'den rememberMe tercihini oku
    const loadRememberMe = async () => {
      try {
        const value = await AsyncStorage.getItem('@rememberMe');
        if (value !== null) {
          setRememberMe(JSON.parse(value));
        }
      } catch (e) {
        console.error('AsyncStorage okuma hatası:', e);
      }
    };
    loadRememberMe();
  }, []);

  const handleLogin = async (values) => {
    setError(null);
    try {
      // "Beni Hatırla" tercihini AsyncStorage'a kaydet
      await AsyncStorage.setItem('@rememberMe', JSON.stringify(rememberMe));

      await login(values.email, values.password);

    } catch (e) {
      setError(e.message);
      Alert.alert('Giriş Hatası', e.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-dark justify-center">
  
        <Text className="text-white text-3xl font-oswald mb-8 text-center">Giriş Yap</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
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

            {/* Beni Hatırla Checkbox */}
            <TouchableOpacity 
              className="flex-row items-center mb-6"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View className={`w-6 h-6 rounded border-2 ${rememberMe ? 'border-light-blue bg-light-blue' : 'border-gray-400'} justify-center items-center mr-2`}>
                 {rememberMe && <Text className="text-dark text-xs font-bold">✓</Text>}
              </View>
              <Text className="text-white font-ancizar text-base">Beni Hatırla</Text>
            </TouchableOpacity>

            {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

            <TouchableOpacity
              className="w-full bg-light-blue p-4 rounded-lg mb-4"
              onPress={handleSubmit}
            >
              <Text className="text-dark text-base text-center font-oswald">Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity
        className="w-full p-2"
        onPress={() => {
          router.push('/(auth)/register');
        }}
      >
        <Text className="text-light-blue text-base text-center font-oswald">Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
    
    </SafeAreaView>
  );
}
