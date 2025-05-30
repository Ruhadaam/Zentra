import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import '../global.css'; // NativeWind styles
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Oswald-Light': require('../assets/fonts/Oswald-Light.ttf'),
    'Oswald-ExtraLight': require('../assets/fonts/Oswald-ExtraLight.ttf'),
    'Ancizar-Serif': require('../assets/fonts/Ancizar-Serif.ttf'),
  });

  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setIsAuthenticating(false);
      });
      return () => unsubscribe();
    } else {
      console.error('Firebase Auth başlatılamadı veya undefined.');
      setIsAuthenticating(false); // Auth objesi yoksa da yüklenmeyi bitir
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (isAuthenticating) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, isAuthenticating, segments]);

  if (!fontsLoaded || isAuthenticating) {
    return null;
  } else if (!user && segments[0] !== '(auth)') {
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
    </>
  );
} 