import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function AnaSayfaScreen() {



  
  return (
    <SafeAreaView className="bg-dark flex-1">
      <ScrollView className="flex-1">
        <View className="p-5">
          {/* Header */}
          <Animated.Text 
            entering={FadeIn.duration(1000)}
            className="text-white text-3xl font-oswald mb-5"
          >
            Ana Sayfa
          </Animated.Text>
          
          {/* Stats Cards */}
          <View className="flex-row flex-wrap justify-between mb-5">
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg mb-4"
            >
              <Text className="text-white font-oswald text-lg">Bugünkü Randevular</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">5</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg mb-4"
            >
              <Text className="text-white font-oswald text-lg">Bu Hafta</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">12</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(600).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg"
            >
              <Text className="text-white font-oswald text-lg">Bu Ay</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">45</Text>
            </Animated.View>
            <Animated.View 
              entering={FadeInDown.delay(800).springify()}
              className="bg-dark-gray w-[48%] p-4 rounded-lg"
            >
              <Text className="text-white font-oswald text-lg">Toplam</Text>
              <Text className="text-light-blue text-2xl font-oswald mt-2">156</Text>
            </Animated.View>
          </View>

          {/* Quick Actions */}
          <Animated.View 
            entering={FadeInUp.delay(1000).springify()}
            className="bg-dark-gray p-4 rounded-lg"
          >
            <Text className="text-white font-oswald text-xl mb-4">Hızlı İşlemler</Text>
            <View className="flex-row flex-wrap justify-between">
              <Animated.View
                entering={FadeInUp.delay(1200).springify()}
                className="w-[48%] mb-4"
              >
                <TouchableOpacity className="bg-light-blue p-4 rounded-lg items-center">
                  <FontAwesome name="calendar-plus-o" size={24} color="#0B1215" />
                  <Text className="text-dark font-oswald mt-2">Yeni Randevu</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(1400).springify()}
                className="w-[48%] mb-4"
              >
                <TouchableOpacity className="bg-light-blue p-4 rounded-lg items-center">
                  <FontAwesome name="search" size={24} color="#0B1215" />
                  <Text className="text-dark font-oswald mt-2">Randevu Ara</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 