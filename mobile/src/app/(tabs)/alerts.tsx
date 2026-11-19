import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BloomScreen } from '../../components/BloomScreen';
import { colors } from '../../theme/colors';

type Category = 'All' | 'Blooms' | 'Pollen';
const demoAlerts = [
  { id: 'a', kind: 'Blooms' as Category, title: 'Cherry bloom activity nearby', detail: 'Sample update: Cherry Blossom flowering in Carlton Gardens.', icon: 'flower-outline' as const, tone: colors.palePurple },
  { id: 'b', kind: 'Pollen' as Category, title: 'A breezy day ahead', detail: 'Example pollen reminder only. Check a current trusted forecast.', icon: 'weather-windy' as const, tone: colors.pollenBackground },
  { id: 'c', kind: 'Blooms' as Category, title: 'Watch the spring blooms', detail: 'Sample update: Lilac and Dogwood are in the seasonal gallery.', icon: 'leaf' as const, tone: colors.paleGreen },
];
export default function AlertsScreen() {
  const [filter, setFilter] = useState<Category>('All');
  const shown = demoAlerts.filter((a) => filter === 'All' || a.kind === filter);
  return (
    <BloomScreen title="Alerts" subtitle="Bloom activity and seasonal updates at a glance." eyebrow="DISCOVER WHAT'S CHANGING">
      <Card mode="contained" style={styles.summary}><Card.Content style={styles.summaryContent}>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={32} color={colors.leafGreen} />
        <View style={{ flex: 1 }}><Text style={styles.summaryTitle}>Your botanical outlook</Text><Text style={styles.text}>Illustrative Melbourne updates — not live weather, pollen or medical advice.</Text></View>
      </Card.Content></Card>
      <Text style={styles.section}>Notifications</Text>
      <View style={styles.filters}>
        {(['All', 'Blooms', 'Pollen'] as Category[]).map((value) => <Chip key={value} selected={filter === value} onPress={() => setFilter(value)} style={styles.chip} textStyle={styles.chipText}>{value}</Chip>)}
      </View>
      {shown.map((item) => <Card key={item.id} mode="outlined" style={styles.card}>
        <Card.Content style={styles.alertRow}>
          <View style={[styles.iconCircle, { backgroundColor: item.tone }]}><MaterialCommunityIcons name={item.icon} size={27} color={colors.purple} /></View>
          <View style={{ flex: 1 }}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.text}>{item.detail}</Text><Text style={styles.category}>{item.kind} · Sample notice</Text></View>
        </Card.Content>
      </Card>)}
      <Text style={styles.disclaimer}>Automatic notifications will require backend support and user preferences later.</Text>
    </BloomScreen>
  );
}
const styles = StyleSheet.create({
  summary: { borderRadius: 23, backgroundColor: colors.paleGreen },
  summaryContent: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  summaryTitle: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 18 },
  section: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 21 },
  text: { color: colors.deepPlum, fontSize: 16, lineHeight: 24, marginTop: 4 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: colors.white, minHeight: 48, justifyContent: 'center' },
  chipText: { color: colors.deepPlum, fontSize: 16 },
  card: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 22 },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconCircle: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 17, lineHeight: 25 },
  category: { color: colors.leafGreen, fontSize: 13, marginTop: 9 },
  disclaimer: { color: colors.leafGreen, fontSize: 14, lineHeight: 22 },
});
