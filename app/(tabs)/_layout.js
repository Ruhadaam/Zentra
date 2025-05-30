// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#A8DADC',    // Aktif ikon rengi
      tabBarInactiveTintColor: '#6C757D',    // Pasif ikon rengi
      tabBarStyle: {
        backgroundColor: '#151C1F',
        borderTopColor: 'white',
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Randevular',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointment-form"
        options={{
          title: 'Randevu Ekle',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="plus-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
