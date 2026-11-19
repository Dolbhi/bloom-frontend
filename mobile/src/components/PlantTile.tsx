import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { Plant } from '../types/plant';
import { colors } from '../theme/colors';

export function PlantTile({ plant, onPress, width }: { plant: Plant; onPress: () => void; width: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${plant.name}, ${plant.distanceKm} kilometres, ${plant.bloomStatus}`}
      onPress={onPress}
      style={[styles.card, { width }]}
    >
      <Image source={plant.photo} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors />
      <View style={styles.content}>
        <Text style={styles.name}>{plant.name}</Text>
        <Text style={styles.distance}>{plant.distanceKm.toFixed(1)} km · {plant.bloomStatus}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', minHeight: 174 },
  image: { width: '100%', height: 98 },
  content: { paddingHorizontal: 12, paddingVertical: 12, gap: 4 },
  name: { color: colors.deepPlum, fontSize: 16, lineHeight: 22, fontFamily: 'NotoSans_700Bold' },
  distance: { color: colors.leafGreen, fontSize: 14, lineHeight: 21, fontFamily: 'NotoSans_400Regular' },
});
