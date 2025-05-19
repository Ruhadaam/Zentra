import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import '../global.css'; // NativeWind styles

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Oswald-Light': require('../assets/fonts/Oswald-Light.ttf'),
    'Oswald-ExtraLight': require('../assets/fonts/Oswald-ExtraLight.ttf'),
    'Ancizar-Serif': require('../assets/fonts/Ancizar-Serif.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }
  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
} 