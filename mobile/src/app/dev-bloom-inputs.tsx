import { Redirect, Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BloomFilterChip } from '@/components/BloomFilterChip';
import { BloomSearchField } from '@/components/BloomSearchField';
import { Spacing } from '@/constants/theme';

const filters = ['All', 'Trees', 'Flowers', 'Shrubs', 'Low pollen'] as const;

export default function BloomInputsPreviewRoute() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return <BloomInputsPreview />;
}

function BloomInputsPreview() {
  const [empty, setEmpty] = useState('');
  const [query, setQuery] = useState('');
  const [prefilled, setPrefilled] = useState('Carlton Gardens');
  const [narrow, setNarrow] = useState('Search a plant, park or street');
  const [clearCount, setClearCount] = useState(0);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [longFilter, setLongFilter] = useState(false);
  const [disabledPresses, setDisabledPresses] = useState(0);

  function recordClear() {
    setClearCount((count) => count + 1);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="headlineSmall" accessibilityRole="header">Bloom inputs preview</Text>
        <View style={styles.example}>
          <Text>Empty</Text>
          <BloomSearchField
            value={empty}
            onChangeText={setEmpty}
            accessibilityLabel="Empty example"
            onClear={recordClear}
          />
        </View>
        <View style={styles.example}>
          <Text>Controlled editable search</Text>
          <BloomSearchField
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Plant search"
            onClear={recordClear}
            onSubmit={() => setSubmittedQuery(query)}
          />
          <Text>Search value: {query || '(empty)'}</Text>
          <Text accessibilityLiveRegion="polite">Last submitted: {submittedQuery ?? 'None'}</Text>
        </View>
        <View style={styles.example}>
          <Text>Prefilled</Text>
          <BloomSearchField
            value={prefilled}
            onChangeText={setPrefilled}
            accessibilityLabel="Prefilled search"
            onClear={recordClear}
          />
        </View>
        <View style={[styles.example, styles.narrow]}>
          <Text>Narrow · 180 units</Text>
          <BloomSearchField
            value={narrow}
            onChangeText={setNarrow}
            accessibilityLabel="Narrow search"
            onClear={recordClear}
          />
        </View>
        <View style={styles.example}>
          <Text>Disabled</Text>
          <BloomSearchField
            value="Cherry Blossom"
            onChangeText={setPrefilled}
            accessibilityLabel="Disabled search"
            disabled
          />
        </View>
        <Text accessibilityLiveRegion="polite">Clear events: {clearCount}</Text>

        <Text variant="titleMedium" accessibilityRole="header">Discovery filters</Text>
        <View style={styles.chips}>
          {filters.map((label) => (
            <BloomFilterChip
              key={label}
              label={label}
              selected={filter === label}
              selectedTreatment={label === 'All' ? 'solid' : 'tinted'}
              onPress={() => setFilter(label)}
            />
          ))}
        </View>
        <Text accessibilityLiveRegion="polite">Selected filter: {filter}</Text>
        <View style={styles.example}>
          <Text>Long label</Text>
          <BloomFilterChip
            label="Flowering plants that are easy to spot this season"
            selected={longFilter}
            onPress={() => setLongFilter((selected) => !selected)}
          />
        </View>
        <View style={styles.example}>
          <Text>Disabled · presses: {disabledPresses}</Text>
          <BloomFilterChip
            label="Unavailable"
            disabled
            selected={false}
            onPress={() => setDisabledPresses((count) => count + 1)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: Spacing.three, gap: Spacing.three },
  example: { gap: Spacing.two },
  narrow: { width: 180, maxWidth: '100%' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
