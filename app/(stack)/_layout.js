// app/(stack)/_layout.js
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="details"
        options={{
          title: 'Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile-details"
        options={{
          title: 'Profil Detayları',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
