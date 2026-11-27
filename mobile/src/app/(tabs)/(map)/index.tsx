import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, Checkbox, Dialog, Portal, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { plantApi } from '../../../api/plantApi';
import { BloomFilterChip } from '../../../components/BloomFilterChip';
import { BloomLogo } from '../../../components/BloomLogo';
import { BloomPollenWarning } from '../../../components/BloomPollenWarning';
import { BloomScreen } from '../../../components/BloomScreen';
import { BloomSearchField } from '../../../components/BloomSearchField';
import { PlantTile } from '../../../components/PlantTile';
import { MapPreview } from '../../../components/MapPreview';
import { Spacing } from '../../../constants/theme';
import { colors } from '../../../theme/colors';
import { displayTypography } from '../../../theme/typography';
import type { Plant, PlantCategory } from '../../../types/plant';

type CategoryFilter = 'All' | PlantCategory;
const categories: CategoryFilter[] = ['All', 'Trees', 'Flowers', 'Shrubs'];

export default function DiscoveryScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(true);
  const [plantFetchError, setPlantFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [lowPollenOnly, setLowPollenOnly] = useState(false);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const { width } = useWindowDimensions();

  const fetchPlants = useCallback(async () => {
    setIsLoadingPlants(true);
    setPlantFetchError(null);
    try {
      setPlants(await plantApi.listPlants());
    } catch (error) {
      setPlantFetchError(error instanceof Error ? error.message : 'Unable to fetch plants.');
    } finally {
      setIsLoadingPlants(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlants();
  }, [fetchPlants]);

  const filtered = useMemo(() => plants.filter((plant) => {
    const matchingName = `${plant.name} ${plant.scientificName} ${plant.location}`.toLowerCase().includes(query.toLowerCase().trim());
    return matchingName && (category === 'All' || plant.category === category) && (!lowPollenOnly || plant.pollenLevel === 'Low');
  }), [plants, query, category, lowPollenOnly]);

  const openPlant = (id: string) => router.push({ pathname: '/plants/[id]', params: { id } });
  const featured = filtered[0];
  const twoColumns = width >= 360;
  const tileWidth = twoColumns ? (width - 44) / 2 : width - 32;

  return (
    <>
      <BloomScreen
        botanical
        contentContainerStyle={styles.content}
        header={
          <>
            <View style={styles.logo}><BloomLogo /></View>
            <View style={styles.location}>
              <MaterialCommunityIcons name="crosshairs" size={14} color={colors.leafGreen} aria-hidden />
              <Text style={styles.eyebrow}>MELBOURNE, VICTORIA</Text>
            </View>
            <Text style={styles.heading}>Good morning, explorer</Text>
            <Text style={styles.subheading}>
              <Text style={styles.count}>{plants.length} sample {plants.length === 1 ? 'plant' : 'plants'}</Text>
              {' to discover around you'}
            </Text>
          </>
        }
      >
        <View style={styles.fetchControls}>
          <Button
            mode="contained"
            icon="refresh"
            disabled={isLoadingPlants}
            onPress={() => void fetchPlants()}
            contentStyle={styles.fetchButtonContent}
          >
            {isLoadingPlants ? 'Fetching plants…' : 'Fetch plants'}
          </Button>
          {plantFetchError && <Text style={styles.fetchError}>Could not fetch plants: {plantFetchError}</Text>}
        </View>
        <Text style={styles.fieldLabel}>Search plants or places</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <BloomSearchField
              value={query}
              onChangeText={setQuery}
              placeholder="Search a plant, park or street"
              accessibilityLabel="Search plants or places"
            />
          </View>
          <Button
            mode="contained"
            onPress={() => setFilterDialogVisible(true)}
            contentStyle={styles.filterButtonContent}
            style={styles.filterButton}
          >
            Filters
          </Button>
        </View>
        <View style={styles.chipRow}>
          {categories.map((item) => (
            <BloomFilterChip
              key={item}
              label={item}
              selected={category === item}
              selectedTreatment={item === 'All' ? 'solid' : 'tinted'}
              onPress={() => setCategory(item)}
            />
          ))}
          <View style={styles.pollenRow}>
            <BloomFilterChip
              label="Low pollen"
              selected={lowPollenOnly}
              onPress={() => setLowPollenOnly(!lowPollenOnly)}
            />
          </View>
        </View>

        {featured && (
          <View style={styles.mapSection}>
            <MapPreview featured={featured} onOpenPlant={() => openPlant(featured.id)} />
            <Text style={styles.mapCaption}>
              Showing {filtered.length} sample {filtered.length === 1 ? 'sighting' : 'sightings'} · Illustrative map and sample distances
            </Text>
          </View>
        )}
        <View style={styles.warningPlacement}>
          <BloomPollenWarning
            title="Hay fever today · Example: Moderate"
            body="Sample tree pollen information. Check a local forecast before planning a visit."
          />
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
      </BloomScreen>

      <Portal>
        <Dialog visible={filterDialogVisible} onDismiss={() => setFilterDialogVisible(false)}>
          <Dialog.Title>Filter plants</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogLabel}>Plant category</Text>
            <View style={styles.chipRow}>
              {categories.map((item) => (
                <BloomFilterChip
                  key={item}
                  label={item}
                  selected={category === item}
                  selectedTreatment={item === 'All' ? 'solid' : 'tinted'}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>
            <Checkbox.Item label="Show only low pollen" status={lowPollenOnly ? 'checked' : 'unchecked'} onPress={() => setLowPollenOnly(!lowPollenOnly)} labelStyle={{ fontSize: 17, color: colors.deepPlum }} />
          </Dialog.Content>
          <Dialog.Actions><Button onPress={() => { setCategory('All'); setLowPollenOnly(false); }}>Clear</Button><Button mode="contained" onPress={() => setFilterDialogVisible(false)}>Done</Button></Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.three, paddingBottom: Spacing.five },
  logo: { marginBottom: Spacing.five },
  location: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  eyebrow: { flexShrink: 1, fontSize: 12, color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', letterSpacing: 1 },
  heading: { ...displayTypography.screenHeading, marginTop: Spacing.three },
  subheading: { color: colors.deepPlum, fontSize: 17, lineHeight: 26, marginTop: Spacing.two },
  count: { fontFamily: 'NotoSans_700Bold' },
  fetchControls: { alignItems: 'flex-start', gap: Spacing.two, marginBottom: Spacing.two },
  fetchButtonContent: { minHeight: 48 },
  fetchError: { color: colors.pollenText, fontSize: 14 },
  fieldLabel: { marginTop: Spacing.four, marginBottom: Spacing.two, fontSize: 16, color: colors.leafGreen, fontFamily: 'NotoSans_700Bold' },
  searchRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  searchField: { flex: 1, minWidth: 0 },
  filterButton: { borderRadius: 24, maxWidth: '45%' },
  filterButtonContent: { minHeight: 48 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 13 },
  pollenRow: { width: '100%', alignItems: 'flex-start' },
  mapSection: { marginTop: Spacing.four, gap: Spacing.twelve },
  mapCaption: { fontSize: 14, lineHeight: 21, color: colors.deepPlum },
  warningPlacement: { marginTop: Spacing.four },
  sectionHeader: { marginTop: 32, marginBottom: 15, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionTitle: { ...displayTypography.sectionHeading, flexShrink: 1, maxWidth: '100%' },
  sectionSide: { fontSize: 13, color: colors.leafGreen, flexShrink: 1, maxWidth: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' },
  emptyState: { padding: 22, fontSize: 17, color: colors.deepPlum },
  dialogLabel: { fontSize: 16, fontFamily: 'NotoSans_700Bold' },
});
