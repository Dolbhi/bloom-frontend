import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, NotoSans_400Regular, NotoSans_700Bold } from '@expo-google-fonts/noto-sans';
import { bloomTheme } from '../theme/theme';
import { colors } from '../theme/colors';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ NotoSans_400Regular, NotoSans_700Bold });
  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={bloomTheme}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="account" options={{ headerShown: true, title: 'Account', headerTintColor: colors.purple, headerStyle: { backgroundColor: colors.petalWhite } }} />
          <Stack.Screen name="review" options={{ headerShown: true, title: 'Community review', headerTintColor: colors.purple, headerStyle: { backgroundColor: colors.petalWhite } }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
