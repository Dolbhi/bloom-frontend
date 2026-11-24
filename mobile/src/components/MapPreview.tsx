import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Plant } from '../types/plant';
import { colors } from '../theme/colors';
import { Radii, Spacing } from '../constants/theme';

const decorativeMarkers = [
  { top: 72, left: '59%' },
  { top: 184, left: '69%' },
  { top: 218, left: '18%' },
] as const;

// A deliberately labelled illustration, NOT GPS, interactive maps, or live sightings.
export function MapPreview({ featured, onOpenPlant }: { featured: Plant; onOpenPlant: () => void }) {
  const bloomStatus = featured.bloomStatus.trim() || 'Bloom status unknown';
  const pollenStatus = featured.pollenLevel ? `${featured.pollenLevel} pollen` : 'Pollen level unknown';
  const highPollen = featured.pollenLevel === 'High';

  return (
    <View style={styles.map} accessible={false}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.park, styles.eastPark]} />
        <View style={[styles.park, styles.westPark]} />
        <View style={styles.stream} />
        <View style={[styles.crossRoad, styles.northRoad]} />
        <View style={styles.centralRoad} />
        <View style={[styles.crossRoad, styles.southRoad]} />
        <Text style={[styles.mapLabel, styles.parkLabel]}>CARLTON GARDENS</Text>
        <Text style={[styles.mapLabel, styles.areaLabel]}>FITZROY</Text>
        {decorativeMarkers.map((position) => (
          <View key={position.left} style={[styles.smallPin, position]}>
            <MaterialCommunityIcons name="flower-outline" size={18} color={colors.leafGreen} />
          </View>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Map preview. Open ${featured.name} details`}
        onPress={onOpenPlant}
        style={({ pressed }) => [styles.featuredPin, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons name="flower" size={24} color={colors.white} aria-hidden />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${featured.name} details. ${featured.scientificName}. ${bloomStatus}. ${pollenStatus}, example data.`}
        onPress={onOpenPlant}
        style={({ pressed }) => [styles.selectedCard, pressed && styles.pressed]}
      >
        <View style={styles.cardHeader}>
          <Image source={featured.photo} style={styles.thumbnail} accessible={false} aria-hidden />
          <View style={styles.plantNames}>
            <Text style={styles.featuredName}>{featured.name}</Text>
            <Text style={styles.scientificName}>{featured.scientificName}</Text>
          </View>
          <View style={styles.arrow}>
            <MaterialCommunityIcons name="arrow-top-right" size={22} color={colors.deepPlum} aria-hidden />
          </View>
        </View>
        <View style={styles.statusRow}>
          <Text style={[styles.badge, bloomStatus === 'Blooming now' && styles.activeBloom]}>{bloomStatus}</Text>
          <Text style={[styles.badge, highPollen && styles.highPollen]}>{pollenStatus} · Example</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    paddingTop: 284,
    paddingHorizontal: Spacing.twelve,
    paddingBottom: Spacing.twelve,
    backgroundColor: '#E8EDD9',
    overflow: 'hidden',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#ACBD95',
  },
  park: { position: 'absolute', backgroundColor: '#DCE6C9', borderRadius: 80 },
  eastPark: { width: 126, height: 126, right: '4%', top: 34 },
  westPark: { width: 132, height: 132, left: '5%', top: 203 },
  stream: { position: 'absolute', left: '-20%', width: '140%', top: 159, height: 83, backgroundColor: '#CDE1E3', transform: [{ rotate: '-6deg' }] },
  crossRoad: { position: 'absolute', width: '140%', left: '-20%', height: 9, backgroundColor: '#FAFBF4' },
  northRoad: { top: 53, transform: [{ rotate: '10deg' }] },
  southRoad: { top: 280, transform: [{ rotate: '-14deg' }] },
  centralRoad: { position: 'absolute', width: 9, top: -12, bottom: -12, left: '47%', backgroundColor: '#FAFBF4', transform: [{ rotate: '5deg' }] },
  mapLabel: { position: 'absolute', fontSize: 10, letterSpacing: 1.3, color: colors.leafGreen, fontFamily: 'NotoSans_700Bold' },
  parkLabel: { top: 70, left: Spacing.four },
  areaLabel: { top: 170, right: Spacing.three },
  smallPin: { position: 'absolute', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, elevation: 2 },
  featuredPin: { position: 'absolute', width: 54, height: 54, borderRadius: 27, backgroundColor: colors.purple, borderWidth: 4, borderColor: colors.white, alignItems: 'center', justifyContent: 'center', top: 125, left: '29%', elevation: 3 },
  selectedCard: { padding: Spacing.twelve, borderRadius: Radii[20], backgroundColor: colors.white, gap: Spacing.two, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  thumbnail: { width: 44, height: 60, borderRadius: Radii[12] },
  plantNames: { flex: 1, minWidth: 0, gap: Spacing.one },
  featuredName: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 16 },
  scientificName: { color: colors.leafGreen, fontSize: 12, fontStyle: 'italic' },
  arrow: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.petalGreen, alignItems: 'center', justifyContent: 'center' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  badge: {
    maxWidth: '100%',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radii[12],
    backgroundColor: colors.paleGreen,
    color: colors.deepPlum,
    fontFamily: 'NotoSans_700Bold',
    fontSize: 12,
  },
  activeBloom: { backgroundColor: colors.petalGreen },
  highPollen: { backgroundColor: colors.pollenBackground, color: colors.pollenText },
  pressed: { opacity: 0.84 },
});
