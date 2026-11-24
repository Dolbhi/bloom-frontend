import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { plantApi } from '../../../../api/plantApi';
import { BloomIndicator } from '../../../../components/BloomIndicator';
import { BloomPollenWarning } from '../../../../components/BloomPollenWarning';
import { colors } from '../../../../theme/colors';
import type { Plant } from '../../../../types/plant';

const monthInitials = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    plantApi.getPlantById(id).then((result) => {
      if (active) { setPlant(result); setLoading(false); }
    });
    return () => { active = false; };
  }, [id]);

  if (loading) return <SafeAreaView style={styles.center}><Text>Loading plant details…</Text></SafeAreaView>;
  if (!plant) return <SafeAreaView style={styles.center}><Text>Plant not found.</Text><Button onPress={() => router.back()}>Back to map</Button></SafeAreaView>;

  const pollenStatus = plant.pollenLevel === 'Low' ? 'pollenLow'
    : plant.pollenLevel === 'High' ? 'pollenHigh'
    : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={plant.photo} style={styles.heroImage} resizeMode="cover" accessibilityLabel={`Photo of ${plant.name}`} />
          <IconButton icon="arrow-left" iconColor={colors.deepPlum} containerColor={colors.white} size={28} onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back to Discovery" />
          {plant.bloomStatus === 'Blooming now' ? (
            <View style={styles.heroIndicator}>
              <BloomIndicator status="bloom" />
            </View>
          ) : (
            <View style={styles.heroBadge}><Text style={styles.badgeText}>{plant.bloomStatus.toUpperCase()}</Text></View>
          )}
        </View>
        <View style={styles.main}>
          <Text style={styles.title}>{plant.name}</Text>
          <Text style={styles.scientificName}>{plant.scientificName}</Text>
          <View style={styles.pills}>
            <Text style={styles.statusPill}>Community sample sighting</Text>
            {pollenStatus ? (
              <BloomIndicator status={pollenStatus} label={`${plant.pollenLevel} POLLEN · Example`} />
            ) : (
              <Text style={styles.pollenPill}>{plant.pollenLevel} POLLEN · Example</Text>
            )}
          </View>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardEyebrow}>BLOOM WINDOW</Text>
              <Text style={styles.dateText}>{plant.bloomWindow}</Text>
            </View>
            <View style={styles.months}>
              {monthInitials.map((month, index) => {
                const isBloomMonth = plant.bloomMonths.includes(index + 1);
                return (
                  <View key={index} style={styles.monthCell}>
                    <Text style={styles.monthLabel}>{month}</Text>
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
          <Text style={styles.sectionTitle}>About this sighting</Text>
          <Text style={styles.bodyText}>{plant.description}</Text>
          <Text style={styles.sectionTitle}>Where to find it</Text>
          <View style={styles.card}>
            <View style={styles.locationPlaceholder}><Text style={styles.locationPlaceholderText}>Illustrative location preview · not live GPS</Text></View>
            <Text style={styles.cardTitle}>{plant.location}</Text>
            <Text style={styles.helper}>{plant.distanceKm.toFixed(1)} km · Sample distance only</Text>
          </View>
          <Text style={styles.sectionTitle}>Community notes</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contributor example</Text>
            <Text style={styles.bodyText}>{plant.contributorNote}</Text>
            <Text style={styles.helper}>Community verification will be connected later.</Text>
          </View>
          <Button mode="contained" onPress={() => router.navigate('/submit')} contentStyle={{ minHeight: 54 }} style={styles.cta}>Submit a sighting</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.petalWhite },
  center: { flex: 1, backgroundColor: colors.petalWhite, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 16 },
  content: { paddingBottom: 26 },
  hero: { height: 245, backgroundColor: colors.paleGreen },
  heroImage: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 10, left: 12 },
  heroIndicator: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  heroBadge: { position: 'absolute', bottom: 16, left: 16, borderRadius: 16, backgroundColor: colors.white, paddingHorizontal: 13, paddingVertical: 8 },
  badgeText: { color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', fontSize: 12 },
  main: { paddingHorizontal: 16, paddingTop: 22, gap: 12 },
  title: { color: colors.deepPlum, fontSize: 29, lineHeight: 39, fontFamily: 'NotoSans_700Bold' },
  scientificName: { color: colors.leafGreen, fontSize: 17, fontStyle: 'italic' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginVertical: 7 },
  statusPill: { color: colors.leafGreen, backgroundColor: colors.paleGreen, fontSize: 13, overflow: 'hidden', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12 },
  pollenPill: { color: colors.pollenText, backgroundColor: colors.pollenBackground, fontSize: 13, overflow: 'hidden', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12 },
  card: { padding: 18, borderRadius: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, gap: 11 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  cardEyebrow: { fontFamily: 'NotoSans_700Bold', color: colors.leafGreen, fontSize: 13 },
  dateText: { fontFamily: 'NotoSans_700Bold', color: colors.deepPlum, fontSize: 14 },
  months: { flexDirection: 'row', gap: 4, marginTop: 9 },
  monthCell: { flex: 1, gap: 7 },
  monthLabel: { fontSize: 11, color: colors.leafGreen, textAlign: 'center' },
  monthBar: { height: 8, backgroundColor: '#E3E4DD', borderRadius: 8 },
  monthBarActive: { backgroundColor: colors.leafGreen },
  helper: { color: colors.leafGreen, fontSize: 13, lineHeight: 21 },
  cardTitle: { color: colors.deepPlum, fontSize: 17, lineHeight: 25, fontFamily: 'NotoSans_700Bold' },
  bodyText: { color: colors.deepPlum, fontSize: 17, lineHeight: 28 },
  sectionTitle: { color: colors.deepPlum, fontSize: 22, lineHeight: 30, fontFamily: 'NotoSans_700Bold', marginTop: 16 },
  locationPlaceholder: { height: 125, backgroundColor: colors.paleGreen, borderRadius: 15, justifyContent: 'center', alignItems: 'center', padding: 14 },
  locationPlaceholderText: { color: colors.leafGreen, textAlign: 'center', fontSize: 15 },
  cta: { borderRadius: 20, marginTop: 16 },
});
