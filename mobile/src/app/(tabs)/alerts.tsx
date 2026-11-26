import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { BloomButton } from '../../components/BloomButton';
import { BloomFilterChip } from '../../components/BloomFilterChip';
import { BloomLogo } from '../../components/BloomLogo';
import { BloomScreen } from '../../components/BloomScreen';
import { Radii, Spacing } from '../../constants/theme';
import { usePlantList } from '../../hooks/usePlantList';
import { colors } from '../../theme/colors';
import { displayTypography } from '../../theme/typography';
import type { Plant, PollenLevel } from '../../types/plant';

const categories = ['All', 'Blooms', 'Pollen'] as const;
type Category = (typeof categories)[number];

const demoAlerts: {
  id: string;
  kind: Exclude<Category, 'All'>;
  title: string;
  detail: string;
  plantIds: string[];
  presentation: 'standard' | 'seasonNote';
}[] = [
  {
    id: 'a', kind: 'Blooms', title: 'Cherry bloom activity nearby',
    detail: 'Sample update: Cherry Blossom flowering in Carlton Gardens.',
    plantIds: ['cherry-blossom'],
    presentation: 'standard',
  },
  {
    id: 'b', kind: 'Pollen', title: 'A breezy day ahead',
    detail: 'Example pollen reminder only. Check a current trusted forecast.',
    plantIds: [],
    presentation: 'standard',
  },
  {
    id: 'c', kind: 'Blooms', title: 'Watch the spring blooms',
    detail: 'Sample update: Lilac and Dogwood are in the seasonal gallery.',
    plantIds: ['common-lilac', 'pacific-dogwood'],
    presentation: 'seasonNote',
  },
];

const pollenColors: Record<PollenLevel, { color: string; backgroundColor: string }> = {
  Low: { color: colors.leafGreen, backgroundColor: colors.paleGreen },
  Moderate: { color: colors.deepPlum, backgroundColor: colors.palePurple },
  High: { color: colors.pollenText, backgroundColor: colors.pollenBackground },
};

function PollenBadge({ level, label }: { level: PollenLevel; label: string }) {
  return <Text style={[styles.badge, pollenColors[level]]}>{label}</Text>;
}

function PlantReference({ plant }: { plant: Plant }) {
  return (
    <View style={styles.plantReference}>
      <View style={styles.plantInfo}>
        <Image source={plant.photo} resizeMode="cover" style={styles.photo} accessible={false} aria-hidden />
        <View style={styles.plantText}>
          <Text style={styles.cardTitle}>{plant.name}</Text>
          <PollenBadge level={plant.pollenLevel} label={`${plant.pollenLevel} pollen · Plant sample`} />
        </View>
      </View>
      <BloomButton
        label="Plant details"
        accessibilityLabel={`View ${plant.name} details`}
        variant="secondary"
        width="100%"
        onPress={() => router.push({ pathname: '/plants/[id]', params: { id: plant.id } })}
      />
    </View>
  );
}

export default function AlertsScreen() {
  const [filter, setFilter] = useState<Category>('All');
  const { status, plants, retry } = usePlantList();
  const shown = demoAlerts.filter((alert) => filter === 'All' || alert.kind === filter);
  const showsPlantReferences = shown.some((alert) => alert.plantIds.length > 0);
  const hasMissingReferences = plants && shown.some((alert) =>
    alert.plantIds.some((id) => !plants.some((plant) => plant.id === id)),
  );

  return (
    <BloomScreen
      botanical
      contentContainerStyle={styles.content}
      header={
        <View style={styles.header}>
          <BloomLogo />
          <Text style={styles.eyebrow}>MELBOURNE · SAMPLE UPDATES</Text>
          <Text accessibilityRole="header" style={displayTypography.screenHeading}>Alerts</Text>
          <Text style={styles.body}>Explore sample bloom updates and pollen information for Melbourne.</Text>
        </View>
      }
    >
      <View style={styles.sections}>
        <View style={styles.card}>
          <View style={styles.outlookTop}>
            <Text style={styles.eyebrow}>EXAMPLE POLLEN OUTLOOK</Text>
            <PollenBadge level="Moderate" label="Moderate · Example" />
          </View>
          <Text accessibilityRole="header" style={displayTypography.sectionHeading}>Spring tree pollen</Text>
          <Text style={styles.body}>Illustrative spring outlook. Check a trusted local forecast for current pollen conditions.</Text>
          <Text style={styles.helper}>Live pollen readings and forecasts are unavailable in Bloom.</Text>
        </View>

        <View style={styles.alerts}>
          <Text accessibilityRole="header" style={displayTypography.sectionHeading}>Sample alerts</Text>
          <View style={styles.filters}>
            {categories.map((value) => (
              <BloomFilterChip
                key={value}
                label={filter === value ? `✓ ${value}` : value}
                accessibilityLabel={value === 'All' ? 'All sample alerts' : `${value} sample alerts`}
                selected={filter === value}
                selectedTreatment="solid"
                onPress={() => setFilter(value)}
              />
            ))}
          </View>
          {showsPlantReferences && status === 'loading' && (
            <Text accessibilityLiveRegion="polite" style={styles.body}>Loading plant references…</Text>
          )}
          {showsPlantReferences && status === 'error' && (
            <>
              <Text accessibilityRole="alert" style={styles.body}>Couldn’t load plant references.</Text>
              <BloomButton label="Retry" accessibilityLabel="Retry loading plant references" onPress={retry} />
            </>
          )}
          {showsPlantReferences && status === 'empty' && (
            <Text style={styles.body}>No sample plants are available for these alerts.</Text>
          )}
          {hasMissingReferences && (
            <Text style={styles.body}>Some plant references are unavailable.</Text>
          )}
          {shown.map((alert) => {
            const isSeasonNote = alert.presentation === 'seasonNote';
            return (
                <View key={alert.id} style={[styles.card, isSeasonNote && styles.seasonCard]}>
                  <View style={styles.alertHeading}>
                    <MaterialCommunityIcons
                      name={alert.kind === 'Pollen' ? 'weather-windy' : 'flower-outline'}
                      size={22}
                      color={isSeasonNote ? colors.white : colors.leafGreen}
                      aria-hidden
                    />
                    <Text style={[styles.eyebrow, isSeasonNote && styles.inverse]}>
                      {isSeasonNote ? 'SEASON NOTE' : `${alert.kind} · Sample notice`}
                    </Text>
                  </View>
                  <Text accessibilityRole="header" style={isSeasonNote
                    ? [displayTypography.sectionHeading, styles.inverse]
                    : styles.cardTitle}>
                    {alert.title}
                  </Text>
                  <Text style={[styles.body, isSeasonNote && styles.inverse]}>{alert.detail}</Text>
                  {alert.plantIds.map((id) => {
                    const plant = plants?.find((candidate) => candidate.id === id);
                    return plant && <PlantReference key={id} plant={plant} />;
                  })}
                </View>
            );
          })}
        </View>

        <Text style={styles.notice}>These notices are examples. Automatic notifications and notification preferences are unavailable in this version.</Text>
      </View>
    </BloomScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.three, paddingBottom: Spacing.five },
  header: { gap: Spacing.twelve },
  eyebrow: { color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', fontSize: 13, letterSpacing: 0.5, flexShrink: 1 },
  sections: { gap: Spacing.four, marginTop: Spacing.four },
  alerts: { gap: Spacing.twelve },
  card: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: Radii[24], padding: Spacing.three, gap: Spacing.twelve },
  outlookTop: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  badge: { alignSelf: 'flex-start', maxWidth: '100%', overflow: 'hidden', borderRadius: Radii[24], paddingHorizontal: Spacing.twelve, paddingVertical: Spacing.two, fontFamily: 'NotoSans_700Bold', fontSize: 13, lineHeight: 19 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  alertHeading: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  cardTitle: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 17, lineHeight: 24 },
  body: { color: colors.deepPlum, fontSize: 16, lineHeight: 24 },
  helper: { color: colors.leafGreen, fontSize: 14, lineHeight: 22 },
  seasonCard: { backgroundColor: colors.leafGreen, borderColor: colors.leafGreen },
  inverse: { color: colors.white },
  plantReference: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: Radii[16], padding: Spacing.twelve, gap: Spacing.twelve },
  plantInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.twelve },
  plantText: { flex: 1, minWidth: 0, gap: Spacing.one },
  photo: { width: 48, height: 48, borderRadius: Radii[12] },
  notice: { color: colors.deepPlum, backgroundColor: colors.pollenBackground, borderRadius: Radii[16], padding: Spacing.three, fontSize: 14, lineHeight: 22 },
});
