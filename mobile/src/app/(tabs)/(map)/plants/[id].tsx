import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { plantApi } from '../../../../api/plantApi';
import { BloomButton } from '../../../../components/BloomButton';
import { BloomPollenWarning } from '../../../../components/BloomPollenWarning';
import { BloomScreen } from '../../../../components/BloomScreen';
import { ControlSize, Radii, Spacing } from '../../../../constants/theme';
import { colors } from '../../../../theme/colors';
import { displayTypography } from '../../../../theme/typography';
import type { Plant, PollenLevel } from '../../../../types/plant';
import { calendarMonths } from '../../../../utils/calendar';

const pollenColors: Record<PollenLevel, { backgroundColor: string; color: string }> = {
  Low: { backgroundColor: colors.paleGreen, color: colors.leafGreen },
  Moderate: { backgroundColor: colors.palePurple, color: colors.deepPlum },
  High: { backgroundColor: colors.pollenBackground, color: colors.pollenText },
};

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PlantDetails key={id} id={id} />;
}

type PlantDetailsState =
  | { status: 'loading' | 'missing' | 'error' }
  | { status: 'success'; plant: Plant };

function PlantDetails({ id }: { id: string }) {
  const { fontScale } = useWindowDimensions();
  const [state, setState] = useState<PlantDetailsState>({ status: 'loading' });
  const { status } = state;

  useEffect(() => {
    if (status !== 'loading') return;
    let active = true;

    async function load() {
      try {
        const plant = await plantApi.getPlantById(id);
        if (active) setState(plant ? { status: 'success', plant } : { status: 'missing' });
      } catch {
        if (active) setState({ status: 'error' });
      }
    }

    void load();
    return () => { active = false; };
  }, [id, status]);

  if (state.status !== 'success') {
    return (
      <SafeAreaView style={styles.center}>
        <Text accessibilityLiveRegion="polite" style={{ color: colors.deepPlum }}>
          {status === 'loading' ? 'Loading plant details…'
            : status === 'missing' ? 'Plant not found.'
            : 'Couldn’t load plant details.'}
        </Text>
        {status === 'error' && (
          <BloomButton
            label="Retry"
            accessibilityLabel="Retry loading plant details"
            onPress={() => setState((current) => current.status === 'error' ? { status: 'loading' } : current)}
          />
        )}
        {status !== 'loading' && <Button onPress={() => router.back()}>Back to map</Button>}
      </SafeAreaView>
    );
  }
  const { plant } = state;

  return (
    <BloomScreen
      botanical
      contentContainerStyle={styles.content}
      header={
        <View style={styles.hero}>
          <Image source={plant.photo} style={styles.heroImage} resizeMode="cover" accessibilityLabel={`Photo of ${plant.name}`} />
          <View style={styles.heroOverlay} pointerEvents="box-none">
            <IconButton
              icon="arrow-left"
              iconColor={colors.white}
              containerColor={colors.deepPlum}
              size={24}
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityLabel="Go back to Discovery"
            />
            <Text style={[styles.pill, plant.bloomStatus === 'Blooming now' ? styles.inBloom : styles.recorded]}>
              {plant.bloomStatus}
            </Text>
          </View>
        </View>
      }
    >
      <View style={styles.main}>
        <View style={styles.identity}>
          <Text accessibilityRole="header" style={displayTypography.screenHeading}>{plant.name}</Text>
          <Text style={styles.scientificName}>{plant.scientificName}</Text>
          <View style={styles.pills}>
            <Text style={[styles.pill, styles.communityPill]}>Community sample sighting</Text>
            <Text style={[styles.pill, pollenColors[plant.pollenLevel]]}>
              {plant.pollenLevel} pollen · Example
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardEyebrow}>BLOOM WINDOW</Text>
            <Text style={styles.dateText}>{plant.bloomWindow}</Text>
          </View>
          <View style={styles.months} aria-hidden>
            {calendarMonths.map(({ name, number, initial }) => {
              const isBloomMonth = plant.bloomMonths.includes(number);
              return (
                <View key={name} style={[styles.monthCell, { minWidth: 10 * fontScale }]}>
                  <Text style={styles.monthLabel}>{initial}</Text>
                  <View style={[styles.monthBar, isBloomMonth && styles.monthBarActive]} />
                </View>
              );
            })}
          </View>
          <Text style={styles.helper}>Example flowering window · Southern hemisphere</Text>
        </View>
        <BloomPollenWarning
          title={`${plant.pollenLevel} pollen — take care`}
          body="This is illustrative pollen guidance, not a live reading or medical advice. Check local pollen conditions."
        />
        <Text accessibilityRole="header" style={styles.sectionTitle}>About this sighting</Text>
        <Text style={styles.bodyText}>{plant.description}</Text>
        <Text accessibilityRole="header" style={styles.sectionTitle}>Where to find it</Text>
        <View style={styles.locationCard}>
          <View style={styles.locationPreview}>
            <View aria-hidden style={styles.waterBand} />
            <Text style={styles.locationPreviewText}>Illustrative location preview · not live GPS</Text>
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.cardTitle}>{plant.location}</Text>
            <Text style={styles.helper}>{plant.distanceKm.toFixed(1)} km · Sample distance only</Text>
          </View>
        </View>
        <Text accessibilityRole="header" style={styles.sectionTitle}>Community notes</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contributor example</Text>
          <Text style={styles.bodyText}>{plant.contributorNote}</Text>
          <Text style={styles.helper}>Community verification will be connected later.</Text>
        </View>
        <View style={styles.cta}>
          <BloomButton label="Submit a sighting" width="100%" onPress={() => router.navigate('/submit')} />
        </View>
      </View>
    </BloomScreen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.petalWhite, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 16 },
  content: { paddingTop: 0, paddingBottom: Spacing.five },
  hero: {
    height: 245,
    marginHorizontal: -Spacing.three,
    overflow: 'hidden',
    backgroundColor: colors.paleGreen,
  },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    padding: Spacing.three,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: { margin: 0, width: ControlSize.minimumTouch, height: ControlSize.minimumTouch },
  main: { paddingTop: Spacing.four, gap: Spacing.twelve },
  identity: { gap: Spacing.two },
  scientificName: { color: colors.deepPlum, fontSize: 17, fontStyle: 'italic' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, marginVertical: Spacing.twelve },
  pill: {
    maxWidth: '100%',
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 13,
    overflow: 'hidden',
    borderRadius: Radii[24],
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.twelve,
  },
  inBloom: { backgroundColor: colors.petalGreen, textTransform: 'uppercase' },
  recorded: { backgroundColor: colors.white, color: colors.leafGreen },
  communityPill: { color: colors.leafGreen, backgroundColor: colors.paleGreen },
  card: { padding: Spacing.three, borderRadius: Radii[24], borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, gap: Spacing.twelve },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  cardEyebrow: { fontFamily: 'NotoSans_700Bold', color: colors.leafGreen, fontSize: 13 },
  dateText: { fontFamily: 'NotoSans_700Bold', color: colors.deepPlum, fontSize: 14 },
  months: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, marginVertical: Spacing.two },
  monthCell: { flexGrow: 1, flexBasis: 0, gap: Spacing.two },
  monthLabel: { fontSize: 11, color: colors.leafGreen, textAlign: 'center' },
  monthBar: { height: Spacing.two, backgroundColor: colors.border, borderRadius: Radii[8] },
  monthBarActive: { backgroundColor: colors.leafGreen },
  helper: { color: colors.leafGreen, fontSize: 13, lineHeight: 21 },
  cardTitle: { color: colors.deepPlum, fontSize: 17, lineHeight: 25, fontFamily: 'NotoSans_700Bold' },
  bodyText: { color: colors.deepPlum, fontSize: 17, lineHeight: 28 },
  sectionTitle: { ...displayTypography.sectionHeading, marginTop: Spacing.three },
  locationCard: { overflow: 'hidden', borderRadius: Radii[24], borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  locationPreview: { minHeight: 112, overflow: 'hidden', backgroundColor: colors.paleGreen, justifyContent: 'center', alignItems: 'center', padding: Spacing.three },
  waterBand: { position: 'absolute', width: '115%', height: Spacing.four, backgroundColor: '#CDE1E3', transform: [{ rotate: '-6deg' }] },
  locationPreviewText: { color: colors.leafGreen, textAlign: 'center', fontSize: 15 },
  locationDetails: { padding: Spacing.three, gap: Spacing.one },
  cta: { marginTop: Spacing.three },
});
