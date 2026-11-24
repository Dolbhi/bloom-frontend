import { Redirect, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlantTile } from '@/components/PlantTile';
import { Spacing } from '@/constants/theme';
import { mockPlants } from '@/data/mockPlants';

export default function BloomPlantCardPreviewRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return <BloomPlantCardPreview />;
}

function BloomPlantCardPreview() {
  const [pressCount, setPressCount] = useState(0);
  const current = mockPlants.find((plant) => plant.bloomStatus === 'Blooming now');
  const historical = mockPlants.find((plant) => plant.bloomStatus === 'Previously recorded');

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" accessibilityRole="header">Plant Discovery Card preview</Text>
        <Text>Plant information on this page is sample data.</Text>
        {current && (
          <>
            <Text>Reference width · 248 units · interactive</Text>
            <PlantTile plant={current} width={248} onPress={() => setPressCount((count) => count + 1)} />
            <Text accessibilityLiveRegion="polite">Card presses: {pressCount}</Text>
            <Text>Narrow · 150 units</Text>
            <PlantTile plant={current} width={150} />
            <Text>Long name and location · test copy</Text>
            <PlantTile
              plant={{
                ...current,
                name: 'Cherry Blossom Along the Northern Garden Path',
                location: 'Carlton Gardens, near the northern entrance and walking path, Melbourne',
              }}
              width={248}
            />
          </>
        )}
        {historical && (
          <>
            <Text>Flexible width · previously recorded</Text>
            <PlantTile plant={historical} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: Spacing.two, padding: Spacing.three },
});
