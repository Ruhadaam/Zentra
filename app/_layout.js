import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import '../global.css'; // NativeWind styles
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import Toast from 'react-native-toast-message';
import { UserProvider } from './context/UserContext';


function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    'Oswald-Light': require('../assets/fonts/Oswald-Light.ttf'),
    'Oswald-ExtraLight': require('../assets/fonts/Oswald-ExtraLight.ttf'),
    'Ancizar-Serif': require('../assets/fonts/Ancizar-Serif.ttf'),
  });

  const router = useRouter();
  const segments = useSegments();
  const { user: authUser, loading } = useAuth();
  

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (authUser && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!authUser && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [authUser, loading, segments]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <RootLayoutNav />
        <Toast />
      </UserProvider>
    </AuthProvider>
  );
} 