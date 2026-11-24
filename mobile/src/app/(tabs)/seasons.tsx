import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { router } from 'expo-router';
import { BloomScreen } from '../../components/BloomScreen';
import { plantApi } from '../../api/plantApi';
import type { Plant } from '../../types/plant';
import { colors } from '../../theme/colors';

const months = [
  { label: 'Sep', number: 9 }, { label: 'Oct', number: 10 },
  { label: 'Nov', number: 11 }, { label: 'Dec', number: 12 },
];
export default function SeasonsScreen() {
  const [month, setMonth] = useState(11);
  const [plants, setPlants] = useState<Plant[]>([]);
  useEffect(() => { plantApi.listPlants().then(setPlants); }, []);
  const seasonalPlants = plants.filter((plant) => plant.bloomMonths.includes(month));
  return (
    <BloomScreen title="Seasons" eyebrow="MELBOURNE · SAMPLE CALENDAR" subtitle="Follow the flowering seasons and see what may be blooming.">
      <Card style={styles.hero} mode="contained"><Card.Content>
        <Text style={styles.heroEyebrow}>SPRING BLOOMS</Text>
        <Text style={styles.heroTitle}>See the season unfold</Text>
        <Text style={styles.heroBody}>These sample bloom windows are for layout testing, not real-time predictions.</Text>
      </Card.Content></Card>
      <Text style={styles.section}>Explore by month</Text>
      <View style={styles.monthRow}>
        {months.map((m) => <Chip key={m.number} selected={month === m.number} onPress={() => setMonth(m.number)} style={styles.monthChip} textStyle={styles.monthText}>{m.label}</Chip>)}
      </View>
      <Text style={styles.section}>Plants in this window</Text>
      {seasonalPlants.length === 0 ? <Text style={styles.empty}>No sample flowering windows recorded for this month.</Text> : seasonalPlants.map((plant) => (
        <Pressable key={plant.id} style={styles.plantRow} onPress={() => router.push({ pathname: '/plants/[id]', params: { id: plant.id } })} accessibilityRole="button" accessibilityLabel={`View ${plant.name} details`}>
          <Image source={plant.photo} style={styles.image} />
          <View style={styles.info}><Text style={styles.plantName}>{plant.name}</Text><Text style={styles.smallText}>{plant.bloomWindow}</Text><Text style={styles.smallText}>{plant.location}</Text></View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
      <Card mode="outlined" style={styles.tip}><Card.Content><Text style={styles.section}>Coming into bloom</Text><Text style={styles.body}>This section will use the backend team's bloom predictions when available.</Text></Card.Content></Card>
      <Button mode="outlined" contentStyle={{ minHeight: 48 }} onPress={() => router.navigate('/')}>Explore the map</Button>
    </BloomScreen>
  );
}
const styles = StyleSheet.create({
  hero: { backgroundColor: colors.leafGreen, borderRadius: 24 },
  heroEyebrow: { color: colors.white, fontSize: 13, fontFamily: 'NotoSans_700Bold', letterSpacing: 0.8 },
  heroTitle: { color: colors.white, fontFamily: 'NotoSans_700Bold', fontSize: 23, lineHeight: 32, marginTop: 5 },
  heroBody: { color: colors.white, fontSize: 16, lineHeight: 24, marginTop: 8 },
  section: { fontSize: 21, lineHeight: 29, fontFamily: 'NotoSans_700Bold', color: colors.deepPlum },
  monthRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  monthChip: { minWidth: 69, minHeight: 48, justifyContent: 'center', backgroundColor: colors.white },
  monthText: { fontSize: 16, color: colors.deepPlum },
  plantRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 11, minHeight: 104, backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  image: { width: 80, height: 80, borderRadius: 12 },
  info: { flex: 1, gap: 3 },
  plantName: { fontSize: 18, lineHeight: 25, fontFamily: 'NotoSans_700Bold', color: colors.deepPlum },
  smallText: { color: colors.leafGreen, fontSize: 14, lineHeight: 20 },
  chevron: { fontSize: 32, color: colors.purple },
  empty: { fontSize: 17, color: colors.deepPlum, lineHeight: 25, backgroundColor: colors.white, padding: 18, borderRadius: 18 },
  tip: { borderColor: colors.border, backgroundColor: colors.paleGreen },
  body: { color: colors.deepPlum, fontSize: 16, lineHeight: 25, marginTop: 7 },
});
