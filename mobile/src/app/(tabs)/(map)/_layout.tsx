import { Stack } from 'expo-router';

// Nest the details stack inside the Map tab to keep the five-tab bar visible.
export default function MapStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
