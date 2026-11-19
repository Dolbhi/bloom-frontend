import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, Checkbox, Chip, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { plantApi } from '../../../api/plantApi';
import { PlantTile } from '../../../components/PlantTile';
import { MapPreview } from '../../../components/MapPreview';
import { colors } from '../../../theme/colors';
import type { Plant, PlantCategory } from '../../../types/plant';

type CategoryFilter = 'All' | PlantCategory;
const categories: CategoryFilter[] = ['All', 'Trees', 'Flowers', 'Shrubs'];

export default function DiscoveryScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [lowPollenOnly, setLowPollenOnly] = useState(false);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    plantApi.listPlants().then(setPlants);
  }, []);

  const filtered = useMemo(() => plants.filter((plant) => {
    const matchingName = `${plant.name} ${plant.scientificName} ${plant.location}`.toLowerCase().includes(query.toLowerCase().trim());
    return matchingName && (category === 'All' || plant.category === category) && (!lowPollenOnly || plant.pollenLevel === 'Low');
  }), [plants, query, category, lowPollenOnly]);

  const openPlant = (id: string) => router.push({ pathname: '/plants/[id]', params: { id } });
  const featured = filtered[0];
  const twoColumns = width >= 360;
  const tileWidth = twoColumns ? (width - 44) / 2 : width - 32;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>✿ bloom</Text>
        <Text style={styles.eyebrow}>✧ MELBOURNE, VICTORIA</Text>
        <Text style={styles.heading}>Good morning, explorer</Text>
        <Text style={styles.subheading}>{plants.length} sample plants to discover around you</Text>

        <Text style={styles.fieldLabel}>Search plants or places</Text>
        <View style={styles.searchRow}>
          <TextInput
            mode="outlined"
            value={query}
            onChangeText={setQuery}
            placeholder="Plant, park or street"
            accessibilityLabel="Search plants or places"
            left={<TextInput.Icon icon="magnify" />}
            style={styles.searchInput}
            contentStyle={{ fontSize: 17 }}
            outlineStyle={{ borderRadius: 15 }}
          />
          <Button mode="contained" onPress={() => setFilterDialogVisible(true)} contentStyle={{ minHeight: 54 }} style={styles.filterButton}>Filters</Button>
        </View>
        <View style={styles.chipRow}>
          {categories.map((item) => (
            <Chip key={item} selected={category === item} onPress={() => setCategory(item)} mode="outlined" style={styles.chip} textStyle={styles.chipText}>{item}</Chip>
          ))}
          <Chip selected={lowPollenOnly} onPress={() => setLowPollenOnly(!lowPollenOnly)} mode="outlined" style={styles.chip} textStyle={styles.chipText}>Low pollen</Chip>
        </View>

        {featured && <MapPreview featured={featured} onOpenPlant={() => openPlant(featured.id)} />}
        <Text style={styles.mapCaption}>Illustrative map and sample distances — not live GPS</Text>
        <View style={styles.pollenCard}>
          <Text style={styles.pollenHeading}>Hay fever today · Example: Moderate</Text>
          <Text style={styles.pollenBody}>Sample tree pollen information. Check a local forecast before planning a visit.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Blooming this week</Text>
          <Text style={styles.sectionSide}>Sample sightings</Text>
        </View>
        {filtered.length ? (
          <View style={styles.grid}>
            {filtered.map((plant) => <PlantTile key={plant.id} plant={plant} width={tileWidth} onPress={() => openPlant(plant.id)} />)}
          </View>
        ) : <Text style={styles.emptyState}>No sample plants match these filters. Try All or clear the search.</Text>}
      </ScrollView>

      <Portal>
        <Dialog visible={filterDialogVisible} onDismiss={() => setFilterDialogVisible(false)}>
          <Dialog.Title>Filter plants</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogLabel}>Plant category</Text>
            <View style={styles.chipRow}>
              {categories.map((item) => <Chip key={item} mode="outlined" selected={category === item} onPress={() => setCategory(item)} style={styles.chip}>{item}</Chip>)}
            </View>
            <Checkbox.Item label="Show only low pollen" status={lowPollenOnly ? 'checked' : 'unchecked'} onPress={() => setLowPollenOnly(!lowPollenOnly)} labelStyle={{ fontSize: 17, color: colors.deepPlum }} />
          </Dialog.Content>
          <Dialog.Actions><Button onPress={() => { setCategory('All'); setLowPollenOnly(false); }}>Clear</Button><Button mode="contained" onPress={() => setFilterDialogVisible(false)}>Done</Button></Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.petalWhite },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 30 },
  logo: { fontSize: 27, color: colors.purple, fontFamily: 'NotoSans_700Bold', marginBottom: 27 },
  eyebrow: { fontSize: 12, color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', letterSpacing: 1 },
  heading: { marginTop: 10, fontSize: 27, lineHeight: 37, color: colors.deepPlum, fontFamily: 'NotoSans_700Bold' },
  subheading: { color: colors.deepPlum, fontSize: 17, lineHeight: 26, marginTop: 3 },
  fieldLabel: { marginTop: 24, marginBottom: 7, fontSize: 16, color: colors.leafGreen, fontFamily: 'NotoSans_700Bold' },
  searchRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  searchInput: { flex: 1, backgroundColor: colors.white, minWidth: 0 },
  filterButton: { borderRadius: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 13 },
  chip: { backgroundColor: colors.white, minHeight: 45, justifyContent: 'center', borderColor: colors.leafGreen },
  chipText: { fontSize: 14, color: colors.deepPlum },
  mapCaption: { fontSize: 14, lineHeight: 21, marginTop: 8, color: colors.leafGreen },
  pollenCard: { marginTop: 20, padding: 18, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.white, borderRadius: 18, gap: 6 },
  pollenHeading: { fontFamily: 'NotoSans_700Bold', fontSize: 16, color: colors.deepPlum },
  pollenBody: { fontSize: 15, lineHeight: 23, color: colors.deepPlum },
  sectionHeader: { marginTop: 32, marginBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionTitle: { fontSize: 21, lineHeight: 28, fontFamily: 'NotoSans_700Bold', color: colors.deepPlum, flexShrink: 1 },
  sectionSide: { fontSize: 13, color: colors.leafGreen },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' },
  emptyState: { padding: 22, fontSize: 17, color: colors.deepPlum },
  dialogLabel: { fontSize: 16, fontFamily: 'NotoSans_700Bold' },
});
