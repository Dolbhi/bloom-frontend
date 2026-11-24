import { Redirect, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BloomButton } from '@/components/BloomButton';
import { Spacing } from '@/constants/theme';

export default function BloomButtonPreviewRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return <BloomButtonPreview />;
}

function BloomButtonPreview() {
  const [interaction, setInteraction] = useState({ count: 0, lastPressed: 'None' });

  function recordPress(lastPressed: string) {
    setInteraction(({ count }) => ({ count: count + 1, lastPressed }));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" accessibilityRole="header">
          BloomButton preview
        </Text>
        <Text>Press each button. The disabled button should leave the results unchanged.</Text>
        <View style={styles.example}>
          <Text>Primary default · 240 units</Text>
          <BloomButton label="Explore Plants" onPress={() => recordPress('Primary default')} />
        </View>
        <View style={styles.example}>
          <Text>Primary disabled · 240 units</Text>
          <BloomButton
            label="Explore Plants"
            accessibilityLabel="Explore Plants, primary disabled example"
            disabled
            onPress={() => recordPress('Primary disabled')}
          />
        </View>
        <View style={styles.example}>
          <Text>Secondary default · 240 units</Text>
          <BloomButton
            label="View details"
            variant="secondary"
            onPress={() => recordPress('Secondary default')}
          />
        </View>
        <View style={styles.example}>
          <Text>Secondary disabled · 240 units</Text>
          <BloomButton
            label="View details"
            variant="secondary"
            disabled
            accessibilityLabel="View details, secondary disabled example"
            onPress={() => recordPress('Secondary disabled')}
          />
        </View>
        <View style={styles.example}>
          <Text>Flexible width · 100%</Text>
          <BloomButton
            label="Explore Plants"
            accessibilityLabel="Explore Plants, flexible-width example"
            width="100%"
            onPress={() => recordPress('Flexible width')}
          />
        </View>
        <View style={styles.example}>
          <Text>Long label · 240 units</Text>
          <BloomButton
            label="Explore plants and flowering trees near you"
            variant="secondary"
            onPress={() => recordPress('Long label')}
          />
        </View>
        <Text accessibilityLiveRegion="polite">
          Presses: {interaction.count}{'\n'}Last pressed: {interaction.lastPressed}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: Spacing.four, padding: Spacing.three },
  example: { gap: Spacing.two },
});
