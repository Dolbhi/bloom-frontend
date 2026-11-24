import { Redirect, Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BloomIndicator } from '@/components/BloomIndicator';
import { BloomPollenWarning } from '@/components/BloomPollenWarning';
import { Spacing } from '@/constants/theme';

const sampleTitle = 'Hay fever today · Example: Moderate';
const sampleBody = 'Sample tree pollen information. Check a local forecast before planning a visit.';

export default function BloomStatusPreviewRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" accessibilityRole="header">Bloom status preview</Text>
        <Text>All pollen values on this page are sample data.</Text>
        <View style={styles.examples}>
          <Text variant="titleMedium" accessibilityRole="header">Indicators</Text>
          <BloomIndicator status="bloom" />
          <BloomIndicator status="pollenLow" />
          <BloomIndicator status="pollenHigh" />
          <BloomIndicator status="bloom" label="Spring blooms" />
          <BloomIndicator status="bloom" label="Cherry blossoms are in bloom along the garden paths" />
          <View style={styles.narrow}>
            <BloomIndicator status="pollenHigh" label="Sample: high tree pollen" />
          </View>
        </View>
        <View style={styles.examples}>
          <Text variant="titleMedium" accessibilityRole="header">Pollen warnings</Text>
          <BloomPollenWarning title={sampleTitle} body={sampleBody} />
          <View style={styles.narrow}>
            <BloomPollenWarning title={sampleTitle} body={sampleBody} />
          </View>
          <BloomPollenWarning
            title="Sample warning: tree and grass pollen"
            body={`${sampleBody} This preview uses longer copy to show how the title and body wrap at different widths.`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: Spacing.three, gap: Spacing.three },
  examples: { gap: Spacing.two },
  narrow: { width: 180, maxWidth: '100%' },
});
