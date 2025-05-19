import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-8">Giriş Yap</Text>
      <TextInput
        className="w-full bg-gray-100 p-4 rounded-lg mb-4"
        placeholder="E-posta"
        keyboardType="email-address"
      />
      <TextInput
        className="w-full bg-gray-100 p-4 rounded-lg mb-6"
        placeholder="Şifre"
        secureTextEntry
      />
      <TouchableOpacity className="w-full bg-red-500 p-4 rounded-lg">
        <Text className="text-white text-center font-bold">Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
} 