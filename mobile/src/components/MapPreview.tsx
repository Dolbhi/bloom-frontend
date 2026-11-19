import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Plant } from '../types/plant';
import { colors } from '../theme/colors';

// A deliberately labelled illustration, NOT GPS, interactive maps, or live sightings.
export function MapPreview({ featured, onOpenPlant }: { featured: Plant; onOpenPlant: () => void }) {
  return (
    <View style={styles.map} accessible={false}>
      <View style={styles.park} />
      <View style={styles.stream} />
      <View style={styles.roadOne} />
      <View style={styles.roadTwo} />
      <Text style={styles.parkLabel}>CARLTON GARDENS</Text>
      <Text style={styles.areaLabel}>FITZROY</Text>
      <View style={[styles.smallPin, { top: 79, right: 74 }]}><MaterialCommunityIcons name="flower-outline" size={20} color={colors.leafGreen} /></View>
      <View style={[styles.smallPin, { top: 175, left: 56 }]}><MaterialCommunityIcons name="flower-outline" size={20} color={colors.leafGreen} /></View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Map preview. Open ${featured.name} details`}
        onPress={onOpenPlant}
        style={styles.featuredPin}
      >
        <MaterialCommunityIcons name="flower" size={24} color={colors.white} />
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`View ${featured.name} details`} onPress={onOpenPlant} style={styles.selectedCard}>
        <Image source={featured.photo} style={styles.thumbnail} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.featuredName}>{featured.name}</Text>
          <Text style={styles.scientificName}>{featured.scientificName}</Text>
          <Text style={styles.status}>{featured.bloomStatus} · {featured.pollenLevel} pollen</Text>
        </View>
        <MaterialCommunityIcons name="arrow-top-right" size={25} color={colors.deepPlum} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 350, backgroundColor: '#E8EDD9', overflow: 'hidden', borderRadius: 26, borderWidth: 1, borderColor: '#ACBD95', marginTop: 16 },
  park: { position: 'absolute', width: 142, height: 142, backgroundColor: '#D7E3BF', borderRadius: 80, left: '58%', top: 36 },
  stream: { position: 'absolute', left: -55, right: -25, top: 132, height: 75, backgroundColor: '#CDE1E3', transform: [{ rotate: '-7deg' }] },
  roadOne: { position: 'absolute', width: '150%', left: -25, top: 72, height: 10, backgroundColor: '#FAFBF4', transform: [{ rotate: '12deg' }] },
  roadTwo: { position: 'absolute', width: 10, height: 290, left: '46%', top: -23, backgroundColor: '#FAFBF4', transform: [{ rotate: '5deg' }] },
  parkLabel: { position: 'absolute', top: 40, left: 22, fontSize: 10, letterSpacing: 1.5, color: '#667E53', fontFamily: 'NotoSans_700Bold' },
  areaLabel: { position: 'absolute', top: 187, right: 16, fontSize: 10, letterSpacing: 1.3, color: '#667E53', fontFamily: 'NotoSans_700Bold' },
  smallPin: { position: 'absolute', width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, elevation: 2 },
  featuredPin: { position: 'absolute', width: 54, height: 54, borderRadius: 28, backgroundColor: colors.purple, borderWidth: 4, borderColor: colors.white, alignItems: 'center', justifyContent: 'center', top: 113, left: '30%', elevation: 3 },
  selectedCard: { position: 'absolute', bottom: 12, left: 12, right: 12, padding: 10, borderRadius: 20, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 78, elevation: 2 },
  thumbnail: { width: 57, height: 60, borderRadius: 12 },
  featuredName: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 16 },
  scientificName: { color: colors.leafGreen, fontSize: 12, fontStyle: 'italic' },
  status: { color: colors.leafGreen, fontSize: 12, lineHeight: 17 },
});
